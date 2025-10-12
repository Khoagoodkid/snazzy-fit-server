// stripe.service.ts

import { BadRequestException, Injectable, InternalServerErrorException, Logger, Inject, forwardRef } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from '@prisma/client';
import { OrderService } from 'src/order/order.service';
import { BusinessLogicError } from 'src/core/base.error';
import { VariantService } from 'src/variant/variant.service';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;
  private readonly CLIENT_BASE_URL: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly variantService: VariantService,
    private readonly cartService: CartService
  ) {
    const stripeKey = this.configService.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    this.stripe = new Stripe(stripeKey);
    this.CLIENT_BASE_URL = this.configService.get('CLIENT_BASE_URL') || 'http://localhost:3000';
  }

  async createCheckoutSession(createCheckoutSessionDto: CreateCheckoutSessionDto, userId: string) {
    this.logger.log('createCheckoutSession()');
    try {
      // Validate amount is a valid number
      if (!createCheckoutSessionDto.amount || isNaN(createCheckoutSessionDto.amount) || createCheckoutSessionDto.amount <= 0) {
        throw new InternalServerErrorException('Invalid amount provided');
      }

      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: createCheckoutSessionDto.orderId,
              },
              unit_amount: Math.round(createCheckoutSessionDto.amount * 100), // Amount in cents
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          metadata: {
            orderId: createCheckoutSessionDto.orderId,
            userId: userId,
          },
        },
        mode: 'payment',
        success_url: `${this.CLIENT_BASE_URL}/payment?status=success&orderId=${createCheckoutSessionDto.orderId}`,
        cancel_url: `${this.CLIENT_BASE_URL}/payment?status=cancel&orderId=${createCheckoutSessionDto.orderId}`,
      });

      return session;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to create Stripe checkout session', error.message);
    }
  }

  constructEvent(payload: Buffer, signature: string, endpointSecret: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
      return event;
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }

  async getPaymentIntent(paymentIntentId: string) {
    return this.stripe.paymentIntents.retrieve(paymentIntentId)
  }

  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    try {

      const paymentIntent = await this.getPaymentIntent(session.payment_intent as string);
      console.log('✅ Payment intent:', paymentIntent);


      
      const order = await this.orderService.getOrderDetails(paymentIntent.metadata.orderId as string);
      
      if (!order) {
        throw new BusinessLogicError("Order not found");
      }

      const outOfStock = order.items.filter(item => item.variant.stock < item.quantity);
      if (outOfStock.length > 0) {
        const productNames = outOfStock.map(item => item.variant.product.name).join(", ");
        throw new BusinessLogicError(`Product ${productNames} is out of stock`);
      }

      const variantsToUpdate = order.items.map(item => ({
        id: item.variant_id,
        by: item.quantity,
      }));
      
      
      await this.variantService.updateStockMany(variantsToUpdate);
      
      const cartsToRemove = order.items.map(item => item.cart_id).filter(cart => cart !== null);
      await this.cartService.removeMany(cartsToRemove as string[]);
      
      await this.orderService.updateOrderStatus(paymentIntent.metadata.orderId as string, OrderStatus.PAID);
    } catch (error) {
      console.log(error);
      throw new BusinessLogicError("Failed to handle checkout session completed");
    }
  }
}
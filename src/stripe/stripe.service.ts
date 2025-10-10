// stripe.service.ts

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;
  private readonly CLIENT_BASE_URL: string;

  constructor(private readonly configService: ConfigService) {
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
              unit_amount: createCheckoutSessionDto.amount * 100, // Amount in cents
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
        success_url: `${this.CLIENT_BASE_URL}/payment?status=success`,
        cancel_url: `${this.CLIENT_BASE_URL}/payment?status=cancel`,
      });

      return session;
    } catch (error) {
        console.log(error);
      throw new InternalServerErrorException('Failed to create Stripe checkout session', error.message);
    }
  }
}
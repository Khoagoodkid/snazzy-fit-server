// stripe.controller.ts
import { Controller, Post, Body, Req, Res, Headers, HttpCode, HttpStatus, RawBodyRequest } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { Redirect, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { FastifyRequest, FastifyReply } from 'fastify';
import { OrderStatus } from '@prisma/client';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService, private configService: ConfigService,
  ) {}

  @Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  async createSession(@Req() req: FastifyRequest, @Body() body: CreateCheckoutSessionDto) {
    const userId = (req as any).user.id;
    const session = await this.stripeService.createCheckoutSession(body, userId);
    return { url: session.url, id: session.id };
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async stripeWebhook(@Req() req: any, @Res() res: FastifyReply, @Headers('stripe-signature') signature: string) {
    try {
      // Access the raw body that we stored in the preParsing hook
      const payload: Buffer = req.rawBody;
      
      if (!payload) {
        throw new Error('No raw body found in request');
      }
      
      const endpointSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
      console.log("payload received, size:", payload.length);
      // const endpointSecret = 'whsec_7b2c0eb0e0e34f0fdf490395ee17c3bd28585bf253cfafe4138c14a15252d389';
      const event = this.stripeService.constructEvent(payload, signature, endpointSecret);

      console.log(`✨ Received event: ${event.type}`);

      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object
          console.log('✅ Checkout completed:', session.id)
          await this.stripeService.handleCheckoutSessionCompleted(session as any);

          break

        case 'payment_intent.succeeded':
          console.log('💰 Payment success')
          break

        case 'invoice.payment_failed':
          console.log('⚠️ Payment failed')
          break

        default:
          console.log(`Unhandled event: ${event.type}`)
      }

      res.send({ received: true });
    } catch (error) {
      console.error('Webhook error:', error.message);
      res.status(400).send({ error: error.message });
    }
  }
}

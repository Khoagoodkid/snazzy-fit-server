// stripe.controller.ts
import { Controller, Post, Body, Req, Res, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request, Response } from 'express';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { Redirect, UseGuards } from '@nestjs/common';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  async createSession(@Req() req: Request, @Body() body: CreateCheckoutSessionDto) {
    const userId = (req as any).user.id;
    const session = await this.stripeService.createCheckoutSession(body, userId);
    return { url: session.url, id: session.id };
  }

//   @Post('webhook')
//   @HttpCode(HttpStatus.OK)
//   async stripeWebhook(@Req() req: Request, @Res() res: Response, @Headers('stripe-signature') signature: string) {
//     const payload = req['rawBody']; // see below for how to get raw body
//     const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

//     const event = this.stripeService.constructEvent(payload, signature, endpointSecret);

//     // handle the event types you need
//     if (event.type === 'checkout.session.completed') {
//       const session = event.data.object as Stripe.Checkout.Session;
//       await this.stripeService.handleCheckoutSessionCompleted(session);
//     }
//     // ... handle other event types

//     res.send({ received: true });
//   }
}

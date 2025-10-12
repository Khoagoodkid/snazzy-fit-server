// stripe.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeController } from './stripe.controller';
import { OrderModule } from 'src/order/order.module';
import { CartModule } from 'src/cart/cart.module';

@Module({})
export class StripeModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StripeModule,
      imports: [ConfigModule, OrderModule, CartModule],
      controllers: [StripeController],
    };
  }
}

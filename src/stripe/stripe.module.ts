// stripe.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';

@Module({})
export class StripeModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StripeModule,
      imports: [ConfigModule],
      providers: [
        StripeService,
        {
          provide: 'STRIPE_SECRET_KEY',
          useFactory: (config: ConfigService) => config.get<string>('STRIPE_SECRET_KEY'),
          inject: [ConfigService],
        },
      ],
      controllers: [StripeController],
      exports: [StripeService],
    };
  }
}

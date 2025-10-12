import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CollectionModule } from './collection/collection.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { VariantModule } from './variant/variant.module';
import { StripeModule } from './stripe/stripe.module';
import { OrderModule } from './order/order.module';
import { AddressModule } from './address/address.module';
import { UploadModule } from './upload/upload.module';
import { ProductReviewModule } from './product-review/product-review.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    ProductModule,
    CollectionModule,
    CategoriesModule,
    CartModule,
    StripeModule.forRootAsync(),
    VariantModule,
    OrderModule,
    AddressModule,
    UploadModule,
    ProductReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

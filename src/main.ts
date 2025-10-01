import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { setupSwagger } from './config/swagger.config';
import { CustomValidationPipe } from './core/custom-validation';
import * as fastifyCookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import { middlewareGuard } from './config/middleware.guard';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>
    (AppModule, new FastifyAdapter());
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  // app.enableCors();
  app.useGlobalPipes(new CustomValidationPipe());


  await app.register(fastifyCookie as any, {
    secret: configService.get<string>('COOKIE_SECRET') || 'default_secret',
    // hook: 'onRequest',
  });

  await app.register(multipart as any, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });

  middlewareGuard(app);

  setupSwagger(app);
  await app.listen(configService.get<number>('PORT') ?? 3000, '0.0.0.0');
  console.log(`🚀 Server is running on http://localhost:${configService.get<number>('PORT') ?? 3000}`);
  console.log(`🔗 API Docs: http://localhost:${configService.get<number>('PORT') ?? 3000}/api-docs`);
}
bootstrap();

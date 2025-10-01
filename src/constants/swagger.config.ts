import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Auto-generated API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      // requestInterceptor: async (req) => {
      //   const response = await fetch('/api/auth/csrf-token', {
      //     credentials: 'include',
      //   });

      //   if (response.ok) {
      //     const { data } = await response.json();
      //     req.headers['x-csrf-token'] = data; // Make sure token is sent
      //   }

      //   return req;
      // },
    },
  });
}

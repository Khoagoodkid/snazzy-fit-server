import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import compress from '@fastify/compress';
import rateLimit from '@fastify/rate-limit';
import userAgent from 'express-useragent';

export function middlewareGuard(app: any) {
  const fastify = app.getHttpAdapter().getInstance();

  fastify.register(
    helmet,
    //   {
    //   contentSecurityPolicy: {
    //     directives: {
    //       defaultSrc: ["'self'"],
    //       scriptSrc: ["'self'", "'unsafe-inline'"],
    //       connectSrc: ["'self'", 'ws://127.0.0.1:3000'], 
    //       imgSrc: ["'self'", 'data:'],
    //       styleSrc: ["'self'", "'unsafe-inline'"],
    //     },
    //   },
    // }
    {
      contentSecurityPolicy: {
        directives: {
          frameAncestors: ['*'],
        },
      },
    },
  );

  // Allow all origins
  fastify.register(cors, {
    origin: true,
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  });
  fastify.register(compress);

  // Avoid spam request
  fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: (req, context) => {
      return {
        statusCode: 429,
        error: 'Too Many Requests',
        message: 'Too many Requests.',
      };
    },
  });

  // Get user agent
  // fastify.addHook('preHandler', (request: any, reply: any, done: any) => {
  //   request.userAgent = userAgent.parse(request.headers['user-agent'] || '');
  //   done();
  // });

  // Allow all frames7
  fastify.addHook('onRequest', (request: any, reply: any, done: any) => {
    reply.header('X-Frame-Options', 'ALLOWALL');
    done();
  });

  // Avoid spam request
  //   fastify.use(slowDown({ windowMs: 60000, delayAfter: 50, delayMs: 500 }));

  // XSS Protection
  fastify.addHook('onRequest', (request: any, reply: any, done: any) => {
    if (request.body && typeof request.body === 'object') {
      for (const key in request.body) {
        if (typeof request.body[key] === 'string') {
          request.body[key] = request.body[key]
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        }
      }
    }
    done();
  });

  // Extract client IP
  fastify.addHook('onRequest', (request: any, reply: any, done: any) => {
    const headers = request.headers;
    const ipFromHeaders = (headers['x-forwarded-for'] || headers['x-real-ip'] || headers['cf-connecting-ip']) as string | undefined;
    const ip = ipFromHeaders ? ipFromHeaders.split(',')[0].trim() : (request.ip || request.socket.remoteAddress);
    request.clientIp = ip;

    done();
  });
}

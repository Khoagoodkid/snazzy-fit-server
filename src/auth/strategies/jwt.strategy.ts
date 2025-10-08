import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Api401Error } from '../../core/base.error';
import { TimeService } from 'src/utils/time.service';
import * as jwt from 'jsonwebtoken';
import { FastifyRequest } from 'fastify';
import { UserTokensService } from 'src/user-tokens/user-tokens.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userTokensService: UserTokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyRequest) => {
          const token = request.cookies?.access_token;
          if (!token) {
            throw new Api401Error('Can not find access token in cookie');
          }
          return token;
        },
      ]),
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: FastifyRequest, payload: any) {
    // const csrfToken = req.headers['x-csrf-token'];
    // if (!csrfToken) {
    //   throw new Api401Error('Can not find csrf token in header');
    // }
    // const csrfTokenFromCookie = req.cookies?.csrf_token;
    // if (csrfTokenFromCookie !== csrfToken) {
    //   throw new Api401Error('CSRF token mismatch');
    // }

    const accessToken = req.cookies?.access_token;
    if (!accessToken) {
      throw new Api401Error('Can not find access token in cookie');
    }

    const secret = this.configService.get<string>('ACCESS_TOKEN_SECRET') || "secret";
    
    try {
      jwt.verify(accessToken, secret);
    } catch (error) {
      throw new Api401Error('Invalid access token');
    }

    const validToken = await this.userTokensService.findTokenByToken(accessToken, payload.id, "accessToken");

    if(!validToken) {
      throw new Api401Error('Invalid access token');
    }

    // if(Number(validToken.expires_at) < TimeService.currentUnix()) {
    //   throw new Api401Error('Access token expired');
    // }

    return {
        id: payload.id,
        username: payload.username,
        email: payload.email,
        role: payload.role,
    }
  }
}

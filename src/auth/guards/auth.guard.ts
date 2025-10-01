// auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Api401Error } from 'src/core/base.error';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    handleRequest(err: any, user: any, info: any) {
        if (info) {
            throw new Api401Error(info.message || "Unauthorized");
        }
        if (err || !user) {
            throw new Api401Error(err.message || "Unauthorized");
        }
        return user;
    }
}

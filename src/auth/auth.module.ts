import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UserTokensModule } from "src/user-tokens/user-tokens.module";
import { JwtAuthGuard } from "./guards/auth.guard";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        UserModule, 
        UserTokensModule,
        ConfigModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, JwtAuthGuard],
    exports: [AuthService, JwtAuthGuard, JwtStrategy],
})
export class AuthModule { }

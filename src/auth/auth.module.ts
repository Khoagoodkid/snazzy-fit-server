import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UserTokensModule } from "src/user-tokens/user-tokens.module";
import { JwtAuthGuard } from "./guards/auth.guard";
import { ConfigModule } from "@nestjs/config";
import { PasswordService } from "src/utils/password.service";
import { HashService } from "src/utils/hash.service";
import { JwtModule } from "@nestjs/jwt";
import { SanitizeDataService } from "src/utils/sanitize-data.service";
import { GoogleModule } from "src/google/google.module";
import { SendMailModule } from "src/send-mail/send-mail.module";
import { DeviceModule } from "src/device/device.module";
import { LoginAttemptModule } from "src/login-attempt/login-attempt.module";
import { RoleModule } from "src/role/role.module";

@Module({
    imports: [
        UserModule,
        UserTokensModule,
        ConfigModule,
        JwtModule,
        GoogleModule,
        SendMailModule,
        DeviceModule,
        LoginAttemptModule,
        RoleModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        JwtAuthGuard,
        PasswordService,
        HashService,
        SanitizeDataService,
    ],
    exports: [AuthService, JwtAuthGuard, JwtStrategy],
})
export class AuthModule { }

import { Module } from "@nestjs/common";
import { LoginAttemptRepository } from "./login-attempt.repository";
import { LoginAttemptService } from "./login-attempt.service";
import { PrismaModule } from "src/common/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    providers: [LoginAttemptService, LoginAttemptRepository],
    exports: [LoginAttemptService],
})
export class LoginAttemptModule { }


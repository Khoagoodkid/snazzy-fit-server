import { Module } from "@nestjs/common";
import { SendMailService } from "./send-mail.service";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ConfigModule],
    providers: [SendMailService],
    exports: [SendMailService],
})
export class SendMailModule { }
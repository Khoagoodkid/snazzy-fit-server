import { Controller, Post, Req, Res } from "@nestjs/common";
import { TelegramService } from "./telegram.service";
import { FastifyReply, FastifyRequest } from "fastify";
import { TelegramWebhookRequest } from "./request/webhook-request";
import { OkResponse } from "src/core/successResponse";

@Controller('telegram')
export class TelegramController {
    constructor(private readonly telegramService: TelegramService) { }

    @Post('webhook')
    async handleWebhook(@Req() req: FastifyRequest, @Res() reply: FastifyReply,
    ) {
        const request = req.body as TelegramWebhookRequest;
         this.telegramService.handleWebhook(request);

         return reply.send(new OkResponse({
            message: 'Webhook received successfully',
            data: null,
         }));
    }

}
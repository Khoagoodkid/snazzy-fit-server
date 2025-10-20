import { Controller, Post, UseGuards, Req, Body, Get, Res } from "@nestjs/common";
import { SessionService } from "./session.service";
import { FastifyReply, FastifyRequest } from "fastify";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";
import { ApiBody } from "@nestjs/swagger";
import { CreateSessionByTicketDto } from "./dto/create-session-by-ticket.dto";
import { CreatedResponse, GetResponse } from "src/core/successResponse";


@Controller('sessions')
export class SessionController {
    constructor(private readonly sessionService: SessionService) { }

    @Post('/admin/create-by-ticket')
    @UseGuards(JwtAuthGuard)
    @ApiBody({ type: CreateSessionByTicketDto })
    async createSession(@Req() req: FastifyRequest, @Body() body: CreateSessionByTicketDto, @Res() reply: FastifyReply) {
        const assistantId = (req as any).user.id;
        const session = await this.sessionService.createSessionByTicket(body, assistantId);
        return reply.send(new CreatedResponse({
            data: session,
            message: 'Session created successfully',
        }));
    }

    @Get('/admin/get-all')
    @UseGuards(JwtAuthGuard)
    async getSessions(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {

        const sessions = await this.sessionService.getAllSessions();
        return reply.send(new GetResponse({
            data: sessions,
            message: 'Sessions fetched successfully',
        }));
    }

    @Get('')
    @UseGuards(JwtAuthGuard)
    async getSessionsByUserId(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const userId = (req as any).user.id;
        const session = await this.sessionService.getSessionsByUserId(userId);
        return reply.send(new GetResponse({
            data: session,
            message: 'Session fetched successfully',
        }));
    }
}
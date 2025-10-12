import { Controller, Delete, Get, Param, Post, Req, Res, UseGuards, UseInterceptors, Patch } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { FastifyRequest, FastifyReply } from "fastify";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";
import { CreatedResponse, DeletedResponse, GetResponse, UpdatedResponse } from "src/core/successResponse";
import { ParseMultipartFormInterceptor } from "src/interceptors/parse-formdata";
import { ApiConsumes, ApiBody } from "@nestjs/swagger";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";


@Controller('tickets')
export class TicketController {
    constructor(private readonly ticketService: TicketService) { }


    @Post('/')
    @UseGuards(JwtAuthGuard)
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateTicketDto })
    @UseInterceptors(ParseMultipartFormInterceptor)
    async createTicket(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const userId = (req as any).user.id;
        const body = req.body as CreateTicketDto;
        const data = await this.ticketService.createTicket(body, userId);
        return reply.send(new CreatedResponse({
            data: data,
            message: 'Ticket created successfully',
        }));
    }

    @Get('/')
    @UseGuards(JwtAuthGuard)
    async getTickets(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const userId = (req as any).user.id;
        const data = await this.ticketService.getTicketsByUserId(userId);
        return reply.send(new GetResponse({
            data: data,
            message: 'Tickets fetched successfully',
            totalRecord: data.length,
        }));
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    async getTicket(@Param('id') id: string, @Res() reply: FastifyReply, @Req() req: FastifyRequest) {
        const userId = (req as any).user.id;
        const data = await this.ticketService.getTicketById(id, userId);
        return reply.send(new GetResponse({
            data: data,
            message: 'Ticket fetched successfully',
        }));
    }

    @Patch('/:id')
    @UseGuards(JwtAuthGuard)
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UpdateTicketDto })
    @UseInterceptors(ParseMultipartFormInterceptor)
    async updateTicket(@Param('id') id: string, @Res() reply: FastifyReply, @Req() req: FastifyRequest) {
        const userId = (req as any).user.id;
        const data = await this.ticketService.updateTicket(id, req.body as UpdateTicketDto, userId);
        return reply.send(new UpdatedResponse({
            data: data,
            message: 'Ticket updated successfully',
        }));
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    async deleteTicket(@Param('id') id: string, @Res() reply: FastifyReply, @Req() req: FastifyRequest) {
        const userId = (req as any).user.id;
        const data = await this.ticketService.deleteTicket(id, userId);
        return reply.send(new DeletedResponse({
            data: data,
            message: 'Ticket deleted successfully',
        }));
    }
}

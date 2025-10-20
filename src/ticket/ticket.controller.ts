import { Controller, Delete, Get, Param, Post, Req, Res, UseGuards, UseInterceptors, Patch } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { FastifyRequest, FastifyReply } from "fastify";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";
import { CreatedResponse, DeletedResponse, GetResponse, UpdatedResponse } from "src/core/successResponse";
import { ParseMultipartFormInterceptor } from "src/interceptors/parse-formdata";
import { ApiConsumes, ApiBody } from "@nestjs/swagger";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { Permission } from "src/auth/decorators/permission.decorators";
import { PermissionStore } from "src/constants/permission.constants";
import { PermissionGuard } from "src/auth/guards/permission.guard";


@Controller('tickets')
export class TicketController {
    constructor(private readonly ticketService: TicketService) { }


    @Post('/')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permission(PermissionStore.CREATE_TICKET)
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
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permission(PermissionStore.GET_TICKETS)
    async getTickets(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const userId = (req as any).user.id;
        const data = await this.ticketService.getTicketsByUserId(userId);
        return reply.send(new GetResponse({
            data: data,
            message: 'Tickets fetched successfully',
            totalRecord: data.length,
        }));
    }

    @Get('/admin/get-all')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permission(PermissionStore.GET_TICKETS)
    async getAllTickets(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
        const data = await this.ticketService.getAllTickets();
        return reply.send(new GetResponse({
            data: data,
            message: 'Tickets fetched successfully',
        }));
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permission(PermissionStore.GET_TICKET_BY_ID)
    async getTicket(@Param('id') id: string, @Res() reply: FastifyReply, @Req() req: FastifyRequest) {
        const userId = (req as any).user.id;
        const data = await this.ticketService.getTicketById(id, userId);
        return reply.send(new GetResponse({
            data: data,
            message: 'Ticket fetched successfully',
        }));
    }

    @Patch('/:id')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UpdateTicketDto })
    @UseInterceptors(ParseMultipartFormInterceptor)
    @Permission(PermissionStore.UPDATE_TICKET)
    async updateTicket(@Param('id') id: string, @Res() reply: FastifyReply, @Req() req: FastifyRequest) {
        const userId = (req as any).user.id;
        const data = await this.ticketService.updateTicket(id, req.body as UpdateTicketDto, userId);
        return reply.send(new UpdatedResponse({
            data: data,
            message: 'Ticket updated successfully',
        }));
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permission(PermissionStore.DELETE_TICKET)
    async deleteTicket(@Param('id') id: string, @Res() reply: FastifyReply, @Req() req: FastifyRequest) {
        const userId = (req as any).user.id;
        const data = await this.ticketService.deleteTicket(id, userId);
        return reply.send(new DeletedResponse({
            data: data,
            message: 'Ticket deleted successfully',
        }));
    }

    @Patch('/:id/admin/mark-as-resolved')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permission(PermissionStore.MARK_AS_RESOLVED)
    async markAsResolved(@Param('id') id: string, @Res() reply: FastifyReply, @Req() req: FastifyRequest) {
        const userId = (req as any).user.id;
        const data = await this.ticketService.markAsResolved(id, userId);
        return reply.send(new UpdatedResponse({
            data: data,
            message: 'Ticket marked as resolved',
        }));
    }
}

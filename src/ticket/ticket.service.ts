import { Injectable } from "@nestjs/common";
import { TicketRepository } from "./ticket.repository";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { Api403Error, BusinessLogicError } from "src/core/base.error";
import { UploadService } from "src/upload/upload.service";
import { UserService } from "src/user/user.service";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { TicketStatus } from "@prisma/client";
import { TimeService } from "src/utils/time.service";
@Injectable()
export class TicketService {
    constructor(private readonly ticketRepository: TicketRepository, private readonly uploadService: UploadService, private readonly userService: UserService) { }

    async createTicket(data: CreateTicketDto, userId: string) {
        try {
            const user = await this.userService.findUserById(userId);
            if (!user) {
                throw new BusinessLogicError("User not found");
            }

            let images: string[] | null = null;
            if (data.files && data.files.length > 0) {
                images = await Promise.all(data.files.map(async (file) => {
                    const path = "userId-" + userId + "/" + file.filename;
                    return await this.uploadService.uploadImage(file, path, 'tickets');
                }));
            }
            return this.ticketRepository.create({
                user_id: userId,
                title: data.title,
                description: data.description,
                images: images ?? [],
                order_id: data.order_id || undefined,
                type: data.type || undefined,
                tags: data.tags || undefined,
            });
        } catch (error) {
            throw new BusinessLogicError("Failed to create ticket");
        }
    }

    async getTicketsByUserId(userId: string) {
        try {
            return this.ticketRepository.findAll({
                user_id: userId,
            });
        } catch (error) {
            throw new BusinessLogicError("Failed to get tickets");
        }
    }

    async getTicketById(id: string, userId: string) {
        try {

            const ticket = await this.ticketRepository.findById(id);
            if (!ticket) {
                throw new BusinessLogicError("Ticket not found");
            }

            if (ticket.user_id !== userId) {
                throw new Api403Error("You are not authorized to get this ticket");
            }
            return ticket;
        } catch (error) {
            throw new BusinessLogicError("Failed to get ticket");
        }
    }

    async updateTicket(id: string, data: UpdateTicketDto, userId: string) {
        const ticket = await this.ticketRepository.findById(id);
        if (!ticket) {
            throw new BusinessLogicError("Ticket not found");
        }

        if (ticket.user_id !== userId) {
            throw new Api403Error("You are not authorized to update this ticket");
        }
        try {

            let images: string[] | null = null;
            if (data.files && data.files.length > 0) {
                images = await Promise.all(data.files.map(async (file) => {
                    const path = "userId-" + userId + "/" + file.filename;
                    return await this.uploadService.uploadImage(file, path, 'tickets');
                }));
            }

            const payload = {
                title: data.title,
                description: data.description,
                order_id: data.order_id || undefined,
                images: [...data.previous_images, ...(images ?? [])],
                type: data.type || undefined,
                tags: data.tags || undefined,
            }
            return this.ticketRepository.update(id, payload);
        } catch (error) {
            throw new BusinessLogicError("Failed to update ticket");
        }
    }

    async deleteTicket(id: string, userId: string) {
        const ticket = await this.ticketRepository.findById(id);
        if (!ticket) {
            throw new BusinessLogicError("Ticket not found");
        }

        if (ticket.user_id !== userId) {
            throw new BusinessLogicError("You are not authorized to delete this ticket");
        }
        try {

            return this.ticketRepository.delete(id);
        } catch (error) {
            throw new BusinessLogicError("Failed to delete ticket");
        }
    }

    async getAllTickets() {
        try {
            return this.ticketRepository.findAll({});
        } catch (error) {
            throw new BusinessLogicError("Failed to get all tickets");
        }
    }

    async markAsResolved(id: string, userId: string) {
        const ticket = await this.ticketRepository.findById(id);
        if (!ticket) {
            throw new BusinessLogicError("Ticket not found");
        }
        try {

            // if (ticket.user_id !== userId) {
            //     throw new Api403Error("You are not authorized to mark this ticket as resolved");
            // }

            return this.ticketRepository.update(id, {
                status: TicketStatus.RESOLVED,
                resolved_at: TimeService.currentUnix(),
            });
        } catch (error) {
            throw new BusinessLogicError("Failed to mark ticket as resolved");
        }
    }
}
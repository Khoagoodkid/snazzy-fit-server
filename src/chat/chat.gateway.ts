import { WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { TimeService } from 'src/utils/time.service';
import { UploadService } from 'src/upload/upload.service';
import * as cookie from 'cookie';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { MessageRole, SessionSource } from '@prisma/client';
import { SessionService } from 'src/session/session.service';
import { SerializeService } from 'src/utils/serialize.service';
import { DiscordService } from 'src/discord/discord.service';
export const ASSISTANT_ROOM = "ASSISTANT";

@WebSocketGateway(8001, {
    namespace: 'chat',
    transports: ['websocket'],
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private server: Server;
    constructor(private readonly chatService: ChatService,
        private readonly uploadService: UploadService,
        private readonly configService: ConfigService,
        private readonly sessionService: SessionService,
        private readonly discordService: DiscordService) { }
    afterInit(server: Server) {
        console.log('WebSocket server initialized');
        this.server = server;
    }

    handleConnection(client: Socket) {
        const cookies = cookie.parse(client.handshake.headers.cookie || '');
        const token = cookies['access_token'];
        const ACCESS_TOKEN_SECRET = this.configService.get<string>('ACCESS_TOKEN_SECRET') || "secret";

        try {
            const payload: any = jwt.verify(token, ACCESS_TOKEN_SECRET);
            client.data.user = payload;
            console.log('Connected user:', payload.email);
        } catch {
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected: ' + client.id);
    }

    @SubscribeMessage('joinAllSessions')
    async handleJoinAllSessions(client: Socket, {
        roomId,

    }: {
        roomId: string;
    }) {
        client.join(roomId);
        console.log('Client joined room: ' + roomId)

        // try {
        //     let sessions: any[] = [];
        //     if (roomId === ASSISTANT_ROOM) {
        //         sessions = await this.sessionService.getAllSessions() || [];
        //     } else {
        //         sessions = await this.sessionService.getSessionsByUserId(roomId);
        //     }

        //     const serializedSessions = sessions.map((session) => {
        //         return SerializeService.serializeBigInt(session);
        //     });
        //     this.server.to(roomId).emit('sessions', {
        //         sessions: serializedSessions,
        //     });
        // } catch (error) {
        //     console.log(error);
        //     this.server.emit('error', {
        //         message: "Failed to join all sessions",
        //     });
        // }
    }

    @SubscribeMessage('joinRoom')
    async handleJoinRoom(client: Socket, {
        sessionId,
    }: {
        sessionId: string;
    }) {
        client.join(sessionId);
        console.log('Client joined room: ' + sessionId);
        try {
            const messages = await this.chatService.getMessages(sessionId, undefined, undefined, {
                created_at: 'asc',
            });
            this.server.to(sessionId).emit('getSessionHistory', {
                messages: SerializeService.serializeBigInt(messages),
            });
        } catch (error) {
            console.log(error);
            this.server.emit('error', {
                message: "Failed to join room",
            });
        }
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, {
        sessionId,
    }: {
        sessionId: string;
    }) {
        client.leave(sessionId);
        console.log('Client left room: ' + sessionId);
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(client: Socket, {
        content,
        files,
        sessionId
    }: {
        content: string;
        files: {
            filename: string;
            buffer: any;
        }[];
        sessionId: string;
    }
    ) {
        console.log('Message received: ' + content);
        try {

            let images: string[] | null = null;
            if (files && files.length > 0) {
                images = await Promise.all(files.map(async (file) => {
                    const path = "sessionId-" + sessionId + "/" + file.filename;
                    console.log("path", file);
                    return await this.uploadService.uploadImage(file.buffer, path, 'chat');
                }));
            }
            // console.log("1", sessionId);
            const session = await this.sessionService.getSessionById(sessionId);
            if(!session) {
                this.server.emit('error', {
                    message: "Session not found",
                });
                return;
            }

            if(session.source === SessionSource.WEB) {
                await this.handleSendWebMessage(client, {
                    content,
                    session,
                    images: images ?? [],
                    sessionId
                });
            } else {
                await this.handleSendDiscordMessage(client, {
                    content,
                    session,
                    images: images ?? [],
                    sessionId
                });
            }


        } catch (error) {
            console.log(error);
            this.server.emit('error', {
                message: "Failed to send message",
            });
        }


    }

    async handleSendDiscordMessage(client: Socket, {
        content,
        session,
        images,
        sessionId
    }: {
        content: string;
        images: string[];
        sessionId: string;
        session: any;
    }) {
        // const createdMessage = await this.chatService.createMessage({
        //     content: content,
        //     sender: {
        //         connect: {
        //             id: client.data.user.id
        //         }
        //     },
        //     session: {
        //         connect: {
        //             id: sessionId
        //         }
        //     },
        //     created_at: TimeService.currentUnix(),
        //     media: images ?? [],
        //     role: MessageRole.ASSISTANT,
        // });

        await this.discordService.sendMessage(session.discord_channel_id, {
            content: content,
            files: images ?? [],
        });

        await this.sessionService.updateSession(sessionId, {
            updated_at: TimeService.currentUnix(),
        });

        // this.server.to(ASSISTANT_ROOM).emit('receiveMessage', {
        //     message: SerializeService.serializeBigInt(createdMessage),
        // });
    }

    async handleSendWebMessage(client: Socket, {
        content,
        session,
        images,
        sessionId
    }: {
        content: string;
        images: string[];
        sessionId: string;
        session: any;
    }) {
        const createdMessage = await this.chatService.createMessage({
            content: content,
            sender: {
                connect: {
                    id: client.data.user.id
                }
            },
            session: {
                connect: {
                    id: sessionId
                }
            },
            created_at: TimeService.currentUnix(),
            media: images ?? [],
            role: client.data.user.role === "USER" ? MessageRole.USER : MessageRole.ASSISTANT,
        });

        await this.sessionService.updateSession(sessionId, {
            updated_at: TimeService.currentUnix(),
        });

        // send to user
        if (session && session.user_id) {
            this.server.to(session.user_id).emit('receiveMessage', {
                message: SerializeService.serializeBigInt(createdMessage),
            });

        }
        this.server.to(ASSISTANT_ROOM).emit('receiveMessage', {
            message: SerializeService.serializeBigInt(createdMessage),
        });
    }

    async emitToRoom(room: string, event: string, data: any) {
        this.server.to(room).emit(event, data);
    }

    getServer() {
        return this.server;
    }
}
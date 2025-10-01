import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) { }

    async login(email: string, password: string) {
        // return this.userService.login(email, password);
    }

    async register(user: CreateUserDto) {
        return this.userService.createUser(user);
    }
}
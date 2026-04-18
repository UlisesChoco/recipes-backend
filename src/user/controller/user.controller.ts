import { Body, Controller, Get, HttpCode, Post, Query } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { UserRegisterDTO } from "../dto/user-register.dto";

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Get()
    async getByEmail(
        @Query("email") email: string
    ) {
        return await this.userService.findByEmail(email);
    }

    @Post()
    @HttpCode(201)
    async register(
        @Body() body: UserRegisterDTO
    ) {
        return await this.userService.register(body);
    }
}
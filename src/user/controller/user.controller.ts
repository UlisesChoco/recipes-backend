import { Body, Controller, Get, HttpCode, Post, Query } from "@nestjs/common";
import { UserService } from "../service/user.service";

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
}
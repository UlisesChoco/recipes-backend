import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthRegisterDTO } from "../dto/auth-register.dto";
import { AuthService } from "../service/auth.service";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('register')
    @HttpCode(201)
    async register(
        @Body() body: AuthRegisterDTO
    ) {
        return await this.authService.register(body);
    }
}
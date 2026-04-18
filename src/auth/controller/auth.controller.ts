import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthRegisterDTO } from "../dto/auth-register.dto";
import { AuthService } from "../service/auth.service";
import { AuthLoginRequestDTO } from "../dto/auth-login-request.dto";
import { AuthDTO } from "../dto/auth.dto";
import { AuthLoginResponseDTO } from "../dto/auth-login-response.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('register')
    @HttpCode(201)
    async register(
        @Body() body: AuthRegisterDTO
    ): Promise<AuthDTO> {
        return await this.authService.register(body);
    }

    @Post('login')
    @HttpCode(200)
    async login(
        @Body() body: AuthLoginRequestDTO
    ): Promise<AuthLoginResponseDTO> {
        return await this.authService.login(body);
    }
}
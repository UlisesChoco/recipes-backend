import { BadRequestException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entity/user.entity";
import { Repository } from "typeorm";
import { AuthRegisterDTO } from "../dto/auth-register.dto";
import * as bcrypt from "bcryptjs";
import { AuthMapper } from "../mapper/auth.mapper";
import { AuthDTO } from "../dto/auth.dto";
import { AuthLoginRequestDTO } from "../dto/auth-login-request.dto";
import { AuthLoginResponseDTO } from "../dto/auth-login-response.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) { }

    async register(
        dto: AuthRegisterDTO
    ): Promise<AuthDTO> {
        const exists = await this.userRepository.existsBy({ email: dto.email });
        if (exists) {
            this.logger.error(`User with email ${dto.email} already exists`);
            throw new BadRequestException("User with email already exists");
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const entity = this.userRepository.create({
            ...dto,
            password: hashedPassword,
        });

        const savedEntity = await this.userRepository.save(entity);

        this.logger.log(`User registered successfully: ${savedEntity.email}`);
        return AuthMapper.toAuthDTO(savedEntity);
    }

    async login(
        dto: AuthLoginRequestDTO
    ): Promise<AuthLoginResponseDTO> {
        const entity = await this.userRepository.findOneBy({ email: dto.email });
        if (!entity) {
            this.logger.error(`Invalid email or password for email: ${dto.email}`);
            throw new UnauthorizedException("Invalid email or password");
        }

        const passwordMatches = await bcrypt.compare(dto.password, entity.password);
        if (!passwordMatches) {
            this.logger.error(`Invalid password for email: ${dto.email}`);
            throw new UnauthorizedException("Invalid email or password");
        }

        const payload = {
            sub: entity.id,
            name: entity.name,
            surname: entity.surname,
            email: entity.email
        };
        const token = this.jwtService.sign(payload);

        this.logger.log(`User logged in successfully: ${entity.email}`);
        return new AuthLoginResponseDTO(token);
    }
}
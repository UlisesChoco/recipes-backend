import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entity/user.entity";
import { Repository } from "typeorm";
import { AuthRegisterDTO } from "../dto/auth-register.dto";
import * as bcrypt from "bcryptjs";
import { AuthMapper } from "../mapper/auth.mapper";
import { AuthDTO } from "../dto/auth.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }

    async register(
        dto: AuthRegisterDTO
    ): Promise<AuthDTO> {
        const exists = await this.userRepository.existsBy({ email: dto.email });
        if (exists)
            throw new BadRequestException("User with email already exists");

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const entity = this.userRepository.create({
            ...dto,
            password: hashedPassword,
        });

        const savedEntity = await this.userRepository.save(entity);

        return AuthMapper.toAuthDTO(savedEntity);
    }
}
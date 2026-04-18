import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { Repository } from "typeorm";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UserDTO } from "../dto/user.dto";
import { UserMapper } from "../mapper/user.mapper";
import { UserRegisterDTO } from "../dto/user-register.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }
    
    async findByEmail(
        email: string
    ): Promise<UserDTO> {
        const entity: User | null = await this.userRepository.findOneBy({ email });

        if (!entity)
            throw new NotFoundException("User not found");

        return UserMapper.toUserDTO(entity);
    }

    async register(
        dto: UserRegisterDTO
    ): Promise<UserDTO> {
        const exists = await this.userRepository.existsBy({ email: dto.email });
        if (exists)
            throw new BadRequestException("User with email already exists");

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const entity = this.userRepository.create({
            ...dto,
            password: hashedPassword,
        });

        const savedEntity = await this.userRepository.save(entity);

        return UserMapper.toUserDTO(savedEntity);
    }
}
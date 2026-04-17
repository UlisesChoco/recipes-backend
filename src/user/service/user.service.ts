import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserDTO } from "../dto/user.dto";
import { UserMapper } from "../mapper/user.mapper";

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

        return UserMapper.toDTO(entity);
    }
}
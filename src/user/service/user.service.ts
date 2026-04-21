import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { Repository } from "typeorm";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { UserDTO } from "../dto/user.dto";
import { UserMapper } from "../mapper/user.mapper";

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }
    
    async findByEmail(
        email: string
    ): Promise<UserDTO> {
        const entity: User | null = await this.userRepository.findOneBy({ email });

        if (!entity) {
            throw new NotFoundException("User not found");
            this.logger.error(`User with email ${email} not found`);
        }
            
        this.logger.log(`User with email ${email} found: ${entity.id}`);
        return UserMapper.toUserDTO(entity);
    }   
}
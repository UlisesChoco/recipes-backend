import { UserDTO } from "../dto/user.dto";
import { User } from "../entity/user.entity";

export class UserMapper {
    static toDTO(user: User): UserDTO {
        const dto = new UserDTO();
        dto.name = user.name;
        dto.surname = user.surname;
        dto.email = user.email;
        dto.verified = user.verified;
        return dto;
    }
}
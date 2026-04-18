import { UserDTO } from "../dto/user.dto";
import { User } from "../entity/user.entity";

export class UserMapper {
    static toUserDTO(user: User): UserDTO {
        const dto = new UserDTO();
        dto.name = user.name;
        dto.surname = user.surname;
        dto.email = user.email;
        return dto;
    }
}
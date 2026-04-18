import { User } from "src/user/entity/user.entity";
import { AuthDTO } from "../dto/auth.dto";

export class AuthMapper {
    static toAuthDTO(user: User): AuthDTO {
        const dto = new AuthDTO();
        dto.name = user.name;
        dto.surname = user.surname;
        dto.email = user.email;
        return dto;
    }
}
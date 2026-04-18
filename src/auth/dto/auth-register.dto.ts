import { IsEmail, IsString, Matches, Length } from "class-validator";

export class AuthRegisterDTO {
    @IsString()
    @Length(2, 20)
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/, {
        message: "Name must contain only letters"
    })
    name!: string;

    @IsString()
    @Length(2, 20)
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/, {
        message: "Surname must contain only letters"
    })
    surname!: string;

    @IsEmail({}, { message: "Email must be a valid email address" })
    email!: string;

    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,}$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number and no spaces",
    })
    password!: string;
}
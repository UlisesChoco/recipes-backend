export class AuthLoginResponseDTO {
    token: string;

    constructor(token: string) {
        this.token = token;
    }
}
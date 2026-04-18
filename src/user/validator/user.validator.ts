export class UserValidator {
    private static readonly emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    private static readonly nameRegex: RegExp = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/;

    private static readonly surnameRegex: RegExp = this.nameRegex;

    private static readonly passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,}$/;

    static emailIsValid(email: string): boolean {
        return this.emailRegex.test(email);
    }

    static nameIsValid(name: string): boolean {
        return this.nameRegex.test(name) && name.length >= 2;
    }

    static surnameIsValid(surname: string): boolean {
        return this.surnameRegex.test(surname) && surname.length >= 2;
    }

    static passwordIsValid(password: string): boolean {
        return this.passwordRegex.test(password);
    }
}
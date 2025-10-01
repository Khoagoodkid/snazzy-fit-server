import { BusinessLogicError } from "../core/base.error";
import * as bcrypt from "bcrypt";

export class PasswordService {
    constructor() { }

    hashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    validatePassword(password: string) {
        if (password.length < 8) {
            throw new BusinessLogicError(
                "Password must be at least 8 characters long"
            );
        }

        if (!/[A-Z]/.test(password)) {
            throw new BusinessLogicError(
                "Password must contain at least one uppercase letter"
            );
        }

        if (!/[0-9]/.test(password)) {
            throw new BusinessLogicError("Password must contain at least one number");
        }

        if (!/[!@#$%^&*]/.test(password)) {
            throw new BusinessLogicError(
                "Password must contain at least one special character"
            );
        }

        return true;
    }
}


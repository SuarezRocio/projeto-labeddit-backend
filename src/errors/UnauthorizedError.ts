import { BaseError } from "./BaseError";

export class UnathorizedError extends BaseError{
    constructor(
        message: string = "Token invalido"
    ){
        super(401, message)
    }
}
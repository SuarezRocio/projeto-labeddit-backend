import { BaseError } from "./BaseError";

export class ConflictError extends BaseError{
    constructor(
        message: string = "ja existe um recurso como esse identificador"
    ){
        super(409, message)
    }
}
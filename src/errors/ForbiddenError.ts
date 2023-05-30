import { BaseError } from "./BaseError";

export class ForbiddenError extends BaseError{
    constructor(
        message: string = "Token valido, mas sem permissoes suficientes"
    ){
        super(403, message)
    }
}
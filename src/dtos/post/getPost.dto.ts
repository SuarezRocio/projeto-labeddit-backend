import z from "zod"
import { PostModel } from "../../models/Post"

export interface GetPostInputDTO {
  token: string
}

// ProductModel é a estrutura de Product que será devolvida para o Front
// (sem password e createdAt camelCase)
export type GetPostOutputDTO = PostModel[]

export const GetPostSchema = z.object({
  token: z.string().min(1).optional()
}).transform(data => data as GetPostInputDTO)
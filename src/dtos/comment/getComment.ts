import z from "zod"
import { CommentModel } from "../../models/Comment"

export interface GetCommentInputDTO {
  token: string,
  post_id: string
}

// ProductModel é a estrutura de Product que será devolvida para o Front
// (sem password e createdAt camelCase)
export type GetCommentOutputDTO = CommentModel[]

export const GetCommentSchema = z.object({
  token: z.string().min(1).optional(),
  post_id: z.string().min(1).optional()
}).transform(data => data as GetCommentInputDTO)
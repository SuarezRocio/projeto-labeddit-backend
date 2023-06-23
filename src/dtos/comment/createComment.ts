import z from "zod"
import { CommentModel } from "../../models/Comment"

export interface CreateCommentInputDTO {
  // id: string,
  content: string,
  token: string,
  post_id: string
}

export type CreateCommentOutputDTO = undefined/*{
 interface
  message: string,
  post: PostModel  
}*/

export const CreateCommentSchema = z.object({
  // id: z.string().min(1),
  content: z.string().min(2),
  token: z.string().min(1),
  post_id: z.string().min(1)
}).transform(data => data as CreateCommentInputDTO)
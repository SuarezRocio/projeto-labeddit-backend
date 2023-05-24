import z from "zod"
import { PostModel } from "../../models/Post"

export interface CreatePostInputDTO {
  // id: string,
  content: string,
  token : string
}

export type CreatePostOutputDTO = undefined/*{
 interface
  message: string,
  post: PostModel  
}*/

export const CreatePostSchema = z.object({
  // id: z.string().min(1),
  content: z.string().min(2),
  token: z.string().min(1)
}).transform(data => data as CreatePostInputDTO)
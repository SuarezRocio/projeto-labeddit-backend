import z from 'zod'

export interface LikeOrDislikeInputDTO {
commentId: string,
token: string,
like: boolean
}

export type LikeOrDislikeOuputDTO = undefined

export const LikeOrDislikeCommentSchema = z.object({
postId: z.string().min(1),
token: z.string().min(1),
like: z.boolean()
}).transform(data => data as  LikeOrDislikeInputDTO)

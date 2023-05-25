import z from 'zod'

export interface LikeOrDislikeInputDTO {
commentId: string,
token: string,
likes: boolean
}

export type LikeOrDislikeOuputDTO = undefined

export const LikeOrDislikeCommentSchema = z.object({
commentId: z.string().min(1),
token: z.string().min(1),
likes: z.boolean()
}).transform(data => data as  LikeOrDislikeInputDTO)

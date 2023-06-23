import z from 'zod'

export interface LikeOrDislikeInputDTO {
    post_id: string,
    token: string,
    likes: boolean
}

export type LikeOrDislikeOuputDTO = undefined

export const LikeOrDislikePostSchema = z.object({
    post_id: z.string().min(1),
    token: z.string().min(1),
    likes: z.boolean()
}).transform(data => data as LikeOrDislikeInputDTO)
/*{
    like: true 
}*/
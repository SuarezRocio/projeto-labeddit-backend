import z from "zod";
import { PostModel } from "../../models/Post";

export interface GetPostByIdInputDTO {
    token: string;
    post_id: string;
}

export type GetPostByIdOutputDTO = { result: PostModel };

export const GetPostByIdSchema = z
    .object({
        token: z.string().min(1),
        post_id: z.string().min(1),
    })
    .transform((data) => data as GetPostByIdInputDTO);
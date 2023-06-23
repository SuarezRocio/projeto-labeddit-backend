import z from "zod";
import { CommentModel } from "../../models/Comment";

export interface GetCommentsByPostIdInputDTO {
    token: string;
    post_id: string;
}

export type GetCommentsByPostIdOutputDTO = { result: CommentModel[] };

export const GetCommentsByPostIdSchema = z
    .object({
        token: z.string().min(1),
        post_id: z.string().min(1),
    })
    .transform((data) => data as GetCommentsByPostIdInputDTO);
//import { PostDTOS } from "../dtos/post";
import {LikeDislikeDB, COMMENT_LIKE, CommentDB, CommentDBWhitCreatorName } from "../models/Comment";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class CommentDatabase extends BaseDatabase {
    public static TABLE_COMMENT = "comment"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes_comment"

    public findComment = async (id: string): Promise<CommentDB | undefined> => {
        const [result] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .select()
            .where({ id })

        return result as CommentDB | undefined
    }
    /*    let postDB
 
        if (q) {
            const result: PostDTOS[] = await BaseDatabase
                .connection(PostDatabase.TABLE_POST)
                .where("name", "LIKE", `%${q}%`)
 
                postDB = result
        } else {
            const result: PostDTOS[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
                
            postDB = result
        }
 
        return  postDB*/


    public async findCommentById(id: string) : Promise <CommentDB | undefined> {
        const [result] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .select()
            .where({ id })

        return result as CommentDB | undefined
    }


    public async updateCommentById(id: string, newComment: object) {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .update({ comment: newComment })
            .where({ id })
    }


    public updateComment = async (
        commentDB: CommentDB
    ): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .update(commentDB)
            .where({ id: commentDB.id })
    }


    public deleteCommentById = async (
        id: string
    ): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .delete()
            .where({ id })
    }


     /*public async insertComment(newCommentDB: CommentDB) {
         await BaseDatabase
             .connection(CommentDatabase.TABLE_COMMENT)
             .insert(newCommentDB)
     }*/

    public insertComment = async (
        commentDB: CommentDB
    ): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENT)
            .insert(commentDB)
    }


    /*   public getPost = async (): Promise <PostDBWhitCreatorName[]> => {
           const postsDB : PostDBWhitCreatorName[] = await PostDatabase
           .connection(PostDatabase.TABLE_POST)
           .select()
   
           return postsDB
       }
     */  /* public async deletePostById(PostToDeleteDB : string) {
           await BaseDatabase
           .connection(PostDatabase.TABLE_POST)
           .insert(PostToDeleteDB)
       }*/

    /** 
        creator_id : string, 
        content : string,
        likes: number,
        dislikes: number,
        created_at : string,
        update_at : string,
        createdAt: string
        creator_name: string*/

    public getCommentDBWhitCreatorName =
        async (): Promise<CommentDBWhitCreatorName[]> => {
            const result = await BaseDatabase
                .connection(CommentDatabase.TABLE_COMMENT)
                .select(`${CommentDatabase.TABLE_COMMENT}`,
                    `${CommentDatabase.TABLE_COMMENT}.creator_id`,
                    `${CommentDatabase.TABLE_COMMENT}.content`,
                    `${CommentDatabase.TABLE_COMMENT}.likes`,
                    `${CommentDatabase.TABLE_COMMENT}.dislikes`,
                    `${CommentDatabase.TABLE_COMMENT}.update_at`,
                    `${CommentDatabase.TABLE_COMMENT}.createdAt`,
                    `${UserDatabase.TABLE_USERS}.name as creator_name`,
                )
                .join(
                    `${UserDatabase.TABLE_USERS}`,
                    `${CommentDatabase.TABLE_COMMENT}.creator_id`,
                    "=",
                    `${UserDatabase.TABLE_USERS}.id`,
                )

            return result as CommentDBWhitCreatorName[]
        }

    public findCommetDBWhitCreatorNameById =
        async (id: string): Promise<CommentDBWhitCreatorName | undefined> => {
            const [result] = await BaseDatabase
                .connection(CommentDatabase.TABLE_COMMENT)
                .select(
                    `${CommentDatabase.TABLE_COMMENT}.id`,
                    `${CommentDatabase.TABLE_COMMENT}.creator_id`,
                    `${CommentDatabase.TABLE_COMMENT}.dislikes`,
                    `${CommentDatabase.TABLE_COMMENT}.likes`,
                    `${CommentDatabase.TABLE_COMMENT}.content`,
                    `${CommentDatabase.TABLE_COMMENT}.created_at`,
                    `${CommentDatabase.TABLE_COMMENT}.update_at`,
                    `${UserDatabase.TABLE_USERS}.name as creator_name`,
                )
/**
            private id: string,
            private creator_id: string,
            private dislikes: number,
            private likes: number,
            private content: string,
            private createdAt: string,
            private updateAt: string,
            private creator_name: string, */

                .join(
                    `${UserDatabase.TABLE_USERS}`,
                    `${CommentDatabase.TABLE_COMMENT}.creator_id`,
                    "=",
                    `${UserDatabase.TABLE_USERS}.id`,
                )
                .where({ [`${CommentDatabase.TABLE_COMMENT}.id`]: id })

            return result as CommentDBWhitCreatorName | undefined
        }

    public findDislikeLike = async (
        likeDislikesDB: LikeDislikeDB
    ): Promise<COMMENT_LIKE | undefined> => {
        const [result]: Array<COMMENT_LIKE | undefined> = await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
            .select()
            .where({
                user_id: likeDislikesDB.user_id,
                comment_id: likeDislikesDB.comment_id
            })

         return result as COMMENT_LIKE | undefined
          }
    /*if (result === undefined) {
        return undefined
    } else if (result.like === 1) {
        return POST_LIKE.ALREDY_LIKED.
    } else {
        return POST_LIKE.ALREDY_DISLIKED
    }*/
    public removeLikeDislike = async (
        likesDislikeDB: LikeDislikeDB
    ): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
            .delete()
            .where({
                user_id: likesDislikeDB.user_id,
                comment_id: likesDislikeDB.comment_id
            })
    }

    public insertLikeDislike = async (
        likesDislikeDB: LikeDislikeDB
    ): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
            .insert(likesDislikeDB)

    }


    public updateLikeDislike = async (
        likesDislikeDB: LikeDislikeDB
    ): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
            .update(likesDislikeDB)
            .where({
                user_id: likesDislikeDB.user_id,
                comment_id: likesDislikeDB.comment_id 
            })
    }


}
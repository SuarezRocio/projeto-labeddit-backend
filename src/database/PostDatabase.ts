//import { PostDTOS } from "../dtos/post";
import { LikeDislikeDB, POST_LIKE, PostDB, PostDBWhitCreatorName, PostDTOS } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POST = "post"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"

    public findPost = async (id: string): Promise<PostDB | undefined> => {
        const [result] = await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .select()
            .where({ id })

        return result as PostDB | undefined
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


    public async findPostById(id: string): Promise<PostDB | undefined> {
        const [result] = await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .select()
            .where({ id })

        return result as PostDB | undefined
    }


    public async updatePostById(id: string, newPost: object) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .update({ post: newPost })
            .where({ id })
    }


    public updatePost = async (
        postDB: PostDB
    ): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .update(postDB)
            .where({ id: postDB.id })
        console.log(postDB)
    }


    public deletePostById = async (
        id: string
    ): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .delete()
            .where({ id })
    }


    /* public async insertPost(newPostDB: PostDTOS) {
         await BaseDatabase
             .connection(PostDatabase.TABLE_POST)
             .insert(newPostDB)
     }*/

    public insertPost = async (
        postDB: PostDB
    ): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .insert(postDB)
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

    public getPostDBWhitCreatorName =
        async (): Promise<PostDBWhitCreatorName[]> => {
            const result = await BaseDatabase
                .connection(PostDatabase.TABLE_POST)
                .select(`${PostDatabase.TABLE_POST}.id`,
                    `${PostDatabase.TABLE_POST}.creator_id`,
                    `${PostDatabase.TABLE_POST}.content`,
                    `${PostDatabase.TABLE_POST}.likes`,
                    `${PostDatabase.TABLE_POST}.dislikes`,
                    `${PostDatabase.TABLE_POST}.created_at`,
                    `${PostDatabase.TABLE_POST}.update_at`,
                    `${UserDatabase.TABLE_USERS}.name as creator_name`,
                )
                .join(
                    `${UserDatabase.TABLE_USERS}`,
                    `${PostDatabase.TABLE_POST}.creator_id`,
                    "=",
                    `${UserDatabase.TABLE_USERS}.id`,
                )

            return result as PostDBWhitCreatorName[]
        }

    public findPostDBWhitCreatorNameById =
        async (id: string): Promise<PostDBWhitCreatorName | undefined> => {
            const [result] = await BaseDatabase
                .connection(PostDatabase.TABLE_POST)
                .select(
                    `${PostDatabase.TABLE_POST}.id`,
                    `${PostDatabase.TABLE_POST}.creator_id`,
                    `${PostDatabase.TABLE_POST}.dislikes`,
                    `${PostDatabase.TABLE_POST}.likes`,
                    `${PostDatabase.TABLE_POST}.content`,
                    `${PostDatabase.TABLE_POST}.created_at`,
                    `${PostDatabase.TABLE_POST}.update_at`,
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
                    `${PostDatabase.TABLE_POST}.creator_id`,
                    "=",
                    `${UserDatabase.TABLE_USERS}.id`,
                )
                .where({ [`${PostDatabase.TABLE_POST}.id`]: id })

            return result as PostDBWhitCreatorName | undefined
        }

    public findDislikeLike = async (
        likeDislikesDB: LikeDislikeDB
    ): Promise<POST_LIKE | undefined> => {
        const [result]: Array<POST_LIKE | undefined> = await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .select()
            .where({
                user_id: likeDislikesDB.user_id,
                post_id: likeDislikesDB.post_id
            })

        return result as POST_LIKE | undefined
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
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .delete()
            .where({
                user_id: likesDislikeDB.user_id,
                post_id: likesDislikeDB.post_id
            })
    }

    public insertLikeDislike = async (
        likesDislikeDB: LikeDislikeDB
    ): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .insert(likesDislikeDB)

    }


    public updateLikeDislike = async (
        likesDislikeDB: LikeDislikeDB
    ): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .update(likesDislikeDB)
            .where({
                user_id: likesDislikeDB.user_id,
                post_id: likesDislikeDB.post_id
            })
    }


}
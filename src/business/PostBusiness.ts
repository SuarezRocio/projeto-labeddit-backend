import { PostDatabase } from "../database/PostDatabase"
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/post/createPost.dto"
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dtos/post/deletePost.dto"
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/post/editPost.dto"
import { GetPostOutputDTO, GetPostInputDTO } from "../dtos/post/getPost.dto"
import { LikeOrDislikeInputDTO, LikeOrDislikeOuputDTO, LikeOrDislikePostSchema } from "../dtos/post/likeOrDislike.dto"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { UnathorizedError } from "../errors/UnauthorizedError"
import { LikeDislikeDB, POST_LIKE } from "../models/Post"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import {Post, PostDB} from "../models/Post"
import { ForbiddenError } from "../errors/ForbiddenError"
import { USER_ROLES } from "../models/User"

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) { }

  public getPost = async (
    input: GetPostInputDTO
  ): Promise<GetPostOutputDTO> => {
    const { token } = input

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new UnathorizedError("Token inválido.")
    }

    const postDBWhitCreatorName = await this.postDatabase.getPostDBWhitCreatorName()


    //pasamos los datos para generar una instancia para generar una instancia y asi 
    //poder generar postModel
    const postajesDB = postDBWhitCreatorName
      .map((PostDBWhitCreatorName) => {
        const postajesDB = new Post (
          PostDBWhitCreatorName.id,
          PostDBWhitCreatorName.creator_id,
          PostDBWhitCreatorName.dislikes,
          PostDBWhitCreatorName.likes,
          PostDBWhitCreatorName.content,
          PostDBWhitCreatorName.created_at,
          PostDBWhitCreatorName.update_at,
          PostDBWhitCreatorName.creator_name
        )
        return postajesDB.toBusinessModel()
      })

    const output: GetPostOutputDTO = postajesDB

    return output
  }


  public editPost = async (
    input: EditPostInputDTO
  ): Promise<EditPostOutputDTO> => {
    const {idToEdit,  token } = input


    
    const payload = this.tokenManager.getPayload(token)
    
    if(!payload){
      throw new UnathorizedError()
    }

    if (payload === null) {
      throw new BadRequestError("Token inválido.")
    }

    const PostDB = await this.postDatabase.findPostById(idToEdit)
    console.log(PostDB)
    if (!PostDB) {
      throw new NotFoundError("post com esse id nao existe")
    }

    if(payload.id !== PostDB.creator_id){
      throw new ForbiddenError("soamente que crio o post pode editarlo")
    }

  
     if(payload.id !== PostDB.creator_id){
       throw new ForbiddenError("soamente que crio o post pode editarlo")
     }

    const post = new Post (
      PostDB.id,
      PostDB.creator_id,
      PostDB.dislikes,
      PostDB.likes,
      PostDB.content,
      PostDB.created_at,
      PostDB.update_at,
      payload.name
    )

    const updatePostDB = post.toDBModel()
    await this.postDatabase.updatePost(updatePostDB)


    const output: EditPostOutputDTO = undefined

    return output
  }



  public deletePost = async (
    input: DeletePostInputDTO
  ): Promise<DeletePostOutputDTO> => {
    const { token, idToDelete } = input

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError("Token inválido.")
    }

   /* if(payload.role !== USER_ROLES.ADMIN){
    if(payload.id !== PostDB.creator_id){
      throw new  ForbiddenError("soamente que crio o post pode editarlo")
    }
    }*/

    const postDadosDB = await this.postDatabase.findPostById(idToDelete)

    if(!payload){
      throw new UnathorizedError()
    }

    if (!postDadosDB) {
      throw new NotFoundError("post com esse id nao existe")
    }

    await this.postDatabase.deletePostById(idToDelete)


    const output: DeletePostOutputDTO = undefined

    return output
  }


  public likeOrDislikePost = async (
    input: LikeOrDislikeInputDTO
  ): Promise<LikeOrDislikeOuputDTO> => {
    const { token, postId } = input

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError("Token inválido.")
    }

    const postDadosDB = await this.postDatabase.findPostById(token)

    if(!payload){
      throw new UnathorizedError()
    }

    if (!postDadosDB) {
      throw new NotFoundError("post com esse id nao existe")
    }

     if(payload.id !== postDadosDB.creator_id){
       throw new ForbiddenError("soamente que crio o post pode editarlo")
     }


    const postDBWhitCreatorName =
      await this.postDatabase.findPostDBWhitCreatorNameById(postId)

    if (!postDBWhitCreatorName) {
      throw new NotFoundError("post com essa id nao existe")
    }

    const posts = new Post(
      postDBWhitCreatorName.id,
      postDBWhitCreatorName.creator_id,
      postDBWhitCreatorName.dislikes,
      postDBWhitCreatorName.likes,
      postDBWhitCreatorName.content,
      postDBWhitCreatorName.created_at,
      postDBWhitCreatorName.update_at,
      postDBWhitCreatorName.creator_name
    )
   
    const likeSQLlite = LikeOrDislikePostSchema ? 1 : 0


    const likeOrDislike: LikeDislikeDB = {
      user_id: payload.id,
      post_id: postId,
      like: likeSQLlite
    }

    const likeDislikesExits =
      await this.postDatabase.findDislikeLike(likeOrDislike)

    if (likeDislikesExits === POST_LIKE.ALREDY_LIKED) {
      if (likeOrDislike) {
        await this.postDatabase.removeLikeDislike(likeOrDislike)
        posts.removeLike()
      } else {
        await this.postDatabase.updateLikeDislike(likeOrDislike)
        posts.removeLike()
        posts.addDisLike()

      }
    } else if (likeDislikesExits === POST_LIKE.ALREDY_DISLIKED) {
      if (!likeOrDislike === false) {
        await this.postDatabase.removeLikeDislike(likeOrDislike)
        posts.removeDisLike()
      } else {
        await this.postDatabase.updateLikeDislike(likeOrDislike)
        posts.removeDisLike()
        posts.addLike()
      }
    } else {
      await this.postDatabase.insertLikeDislike(likeOrDislike)
      likeOrDislike ? posts.addLike() : posts.addDisLike()
    }

    const updatePostDB = posts.toDBModel()
    await this.postDatabase.updatePost(updatePostDB)

    const output: LikeOrDislikeOuputDTO = undefined
    return output
  }

  public createPost = async (
    input: CreatePostInputDTO
  ): Promise<CreatePostOutputDTO> => {
    // const { id, name, price } = input
    const { content, token } = input
 
    const payload = this.tokenManager.getPayload(token)

    if(!payload){
      throw new UnathorizedError()
    }

    const id = this.idGenerator.generate()

    const post = new Post(
      id,
      content,
      0,
      0,
     new Date().toISOString(),
     new Date().toISOString(),
     payload.id,
     payload.name
    )


    const PostsDB = post.toDBModel()
    await this.postDatabase.insertPost(PostsDB)

    const output : CreatePostOutputDTO = undefined
    return output
    

}
}

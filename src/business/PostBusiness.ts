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
import { Post, PostDB } from "../models/Post"
import { ForbiddenError } from "../errors/ForbiddenError"
import { USER_ROLES } from "../models/User"
import { GetPostByIdInputDTO, GetPostByIdOutputDTO } from "../dtos/post/getPostById"

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
        const postajesDB = new Post(
          PostDBWhitCreatorName.id,
          PostDBWhitCreatorName.comments,
          PostDBWhitCreatorName.creator_id,
          PostDBWhitCreatorName.dislikes,
          PostDBWhitCreatorName.likes,
          PostDBWhitCreatorName.content,
          PostDBWhitCreatorName.created_at,
          PostDBWhitCreatorName.update_at
        )
        return postajesDB.toBusinessModel()
      })
    /**
                private id: string,
                private creator_id: string,
                private dislikes: number,
                private likes: number,
                private content: string,
                private createdAt: string,
                private updateAt: string,
                private creator_name: string, */
    const output: GetPostOutputDTO = postajesDB

    return output
  }


  public editPost = async (
    input: EditPostInputDTO
  ): Promise<EditPostOutputDTO> => {
    const { idToEdit, token, content } = input



    const payload = this.tokenManager.getPayload(token)

    if (!content) {
      throw new BadRequestError()
    }

    if (!payload) {
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

    if (payload.id !== PostDB.creator_id) {
      throw new ForbiddenError("soamente que crio o post pode editarlo")
    }


    if (payload.id !== PostDB.creator_id) {
      throw new ForbiddenError("soamente que crio o post pode editarlo")
    }

    const post = new Post(
      PostDB.id,
      PostDB.comments,
      PostDB.creator_id,
      PostDB.dislikes,
      PostDB.likes,
      content,
      PostDB.created_at,
      PostDB.update_at
    )


    //post.setContent = (content) 

    const updatePostDB = post.toDBModel()
    await this.postDatabase.updatePost(updatePostDB)
    // console.log(updatePostDB)


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

    /*if(payload.role !== USER_ROLES.ADMIN){
    if(payload.id !== Post.creator_id){
      throw new  ForbiddenError("soamente que crio o post pode editarlo")
    }
    }*/

    const postDadosDB = await this.postDatabase.findPostById(idToDelete)

    if (!payload) {
      throw new UnathorizedError()
    }

    if (!postDadosDB) {
      throw new NotFoundError("post com esse id nao existe")
    }

    await this.postDatabase.deletePostById(idToDelete)


    const output: DeletePostOutputDTO = undefined

    return output
  }

  public createPost = async (
    input: CreatePostInputDTO
  ): Promise<CreatePostOutputDTO> => {
    // const { id, name, price } = input
    const { content, token } = input

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
      throw new UnathorizedError()
    }

    const id = this.idGenerator.generate()

    const post = new Post(
      id,
      0,
      payload.id,
      0,
      0,
      content,
      new Date().toISOString(),
      new Date().toISOString()
    )


    const postsDB = post.toDBModel()

    console.log(postsDB)
    await this.postDatabase.insertPost(postsDB)


    const output: CreatePostOutputDTO = undefined
    return output


  }

  public likeOrDislikePost = async (
    input: LikeOrDislikeInputDTO
  ): Promise<LikeOrDislikeOuputDTO> => {
    const { token, post_id, likes } = input

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError("Token inválido.")
    }

    const postDadosDB = await this.postDatabase.findPostById(post_id)

    if (!payload) {
      throw new UnathorizedError()
    }

    if (!postDadosDB) {
      throw new NotFoundError("post com esse id nao existe")
    }

    if (payload.id !== postDadosDB.creator_id) {
      throw new ForbiddenError("soamente que crio o post pode editarlo")
    }


    const postDBWhitCreatorName = await this.postDatabase.findPostDBWhitCreatorNameById(post_id)

    if (!postDBWhitCreatorName) {
      throw new NotFoundError("post com essa id nao existe")
    }

    const posts = new Post(
      postDBWhitCreatorName.id,
      postDBWhitCreatorName.comments,
      postDBWhitCreatorName.creator_id,
      postDBWhitCreatorName.dislikes,
      postDBWhitCreatorName.likes,
      postDBWhitCreatorName.content,
      postDBWhitCreatorName.created_at,
      postDBWhitCreatorName.update_at
    )


    // const likes = true;
    const likeSQLlite = likes ? 1 : 0;

    const likeOrDislike: LikeDislikeDB = {
      user_id: payload.id,
      post_id: post_id,
      likes: likeSQLlite
    }

    const likeDislikesExits =
      await this.postDatabase.findDislikeLike(likeOrDislike)

    if (likeDislikesExits === POST_LIKE.ALREDY_LIKED) {
      if (likes) {
        await this.postDatabase.removeLikeDislike(likeOrDislike)
        posts.removeLike()
      } else {
        await this.postDatabase.updateLikeDislike(likeOrDislike)
        posts.removeLike()
        posts.addDisLike()

      }
    } else if (likeDislikesExits === POST_LIKE.ALREDY_DISLIKED) {
      if (!likes === false) {
        await this.postDatabase.removeLikeDislike(likeOrDislike)
        posts.removeDisLike()
      } else {
        await this.postDatabase.updateLikeDislike(likeOrDislike)
        posts.removeDisLike()
        posts.addLike()
      }
    } else {
      await this.postDatabase.insertLikeDislike(likeOrDislike)
      likes ? posts.addLike() : posts.addDisLike()
    }

    const updatePostDB = posts.toDBModel()
    await this.postDatabase.updatePost(updatePostDB)

    const output: LikeOrDislikeOuputDTO = undefined
    return output
  }



  //getPostById
  public getPostById = async (
    input: GetPostByIdInputDTO
  ): Promise<GetPostByIdOutputDTO> => {
    const { token, post_id } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnathorizedError();
    }

    const postDBWithUsername = await this.postDatabase.findPostByIdWithUsername(
      post_id
    );

    if (!postDBWithUsername) {
      throw new NotFoundError("não existe post com o id informado");
    }

    const post = new Post(
      postDBWithUsername.id,
      postDBWithUsername.comments,
      postDBWithUsername.creator_id,
      postDBWithUsername.dislikes,
      postDBWithUsername.likes,
      postDBWithUsername.content,
      postDBWithUsername.created_at,
      postDBWithUsername.update_at
    );

    const postBusinessModel = post.toBusinessModel();
    const output: GetPostByIdOutputDTO = { result: postBusinessModel };

    return output;
  };



}
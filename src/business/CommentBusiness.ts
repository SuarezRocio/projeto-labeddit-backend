import { CommentDatabase } from "../database/CommentDatabase"
import { CreateCommentInputDTO, CreateCommentOutputDTO } from "../dtos/comment/createComment"
import { DeleteCommentInputDTO, DeleteCommentOutputDTO } from "../dtos/comment/deleteComment"
import { EditCommentInputDTO, EditCommentOutputDTO } from "../dtos/comment/editComment"
import { GetCommentInputDTO, GetCommentOutputDTO } from "../dtos/comment/getComment"
import { LikeOrDislikeCommentSchema } from "../dtos/comment/likeOrDislikeComment"
import { LikeOrDislikeInputDTO, LikeOrDislikeOuputDTO } from "../dtos/comment/likeOrDislikeComment"
import { BadRequestError } from "../errors/BadRequestError"
import { ForbiddenError } from "../errors/ForbiddenError"
import { NotFoundError } from "../errors/NotFoundError"
import { UnathorizedError } from "../errors/UnauthorizedError"
import { COMMENT_LIKE } from "../models/Comment"
import { LikeDislikeDB, Comment } from "../models/Comment"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export class CommentBusiness {
  constructor(
    private commentDatabase: CommentDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) { }

  public getComment = async (
    input: GetCommentInputDTO
  ): Promise<GetCommentOutputDTO> => {
    const { token } = input

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new UnathorizedError("Token inválido.")
    }

    const commentDBWhitCreatorName = await this.commentDatabase.getCommentDBWhitCreatorName()


    //pasamos los datos para generar una instancia para generar una instancia y asi 
    //poder generar postModel
    const commentsDB = commentDBWhitCreatorName
      .map((CommentDBWhitCreatorName) => {
        const commentDB = new Comment(
          CommentDBWhitCreatorName.id,
          CommentDBWhitCreatorName.creator_id,
          CommentDBWhitCreatorName.dislikes,
          CommentDBWhitCreatorName.likes,
          CommentDBWhitCreatorName.content,
          CommentDBWhitCreatorName.created_at,
          CommentDBWhitCreatorName.update_at
        )
        return commentDB.toBusinessModel()
      })

    const output: GetCommentOutputDTO = commentsDB

    return output
  }


  public editComment = async (
    input: EditCommentInputDTO
  ): Promise<EditCommentOutputDTO> => {
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

    const CommentDB = await this.commentDatabase.findCommentById(idToEdit)
    console.log(CommentDB)
    if (!CommentDB) {
      throw new NotFoundError("comment com esse id nao existe")
    }

    if (payload.id !== CommentDB.creator_id) {
      throw new ForbiddenError("soamente que crio o comment pode editarlo")
    }


    if (payload.id !== CommentDB.creator_id) {
      throw new ForbiddenError("soamente que crio o comment pode editarlo")
    }

    const comment = new Comment(
      CommentDB.id,
      CommentDB.creator_id,
      CommentDB.dislikes,
      CommentDB.likes,
      content,
      CommentDB.created_at,
      CommentDB.update_at
    )

    const updateCommentDB = comment.toDBModel()
    await this.commentDatabase.updateComment(updateCommentDB)


    const output: EditCommentOutputDTO = undefined

    return output
  }



  public deleteComment = async (
    input: DeleteCommentInputDTO
  ): Promise<DeleteCommentOutputDTO> => {
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

    const commentDadosDB = await this.commentDatabase.findCommentById(idToDelete)

    if (!payload) {
      throw new UnathorizedError()
    }

    if (!commentDadosDB) {
      throw new NotFoundError("comment com esse id nao existe")
    }

    await this.commentDatabase.deleteCommentById(idToDelete)


    const output: DeleteCommentOutputDTO = undefined

    return output
  }


  public likeOrDislikeComment = async (
    input: LikeOrDislikeInputDTO
  ): Promise<LikeOrDislikeOuputDTO> => {
    const { token, commentId, likes } = input

    const payload = this.tokenManager.getPayload(token)

    if (payload === null) {
      throw new BadRequestError("Token inválido.")
    }

    const commentDadosDB = await this.commentDatabase.findCommentById(commentId)

    if (!payload) {
      throw new UnathorizedError()
    }

    if (!commentDadosDB) {
      throw new NotFoundError("comment com esse id nao existe")
    }

    if (payload.id !== commentDadosDB.creator_id) {
      throw new ForbiddenError("soamente que crio o comment pode editarlo")
    }


    const commentDBWhitCreatorName =
      await this.commentDatabase.findCommetDBWhitCreatorNameById(commentId)

    if (!commentDBWhitCreatorName) {
      throw new NotFoundError("comment com essa id nao existe")
    }

    const comments = new Comment(
      commentDBWhitCreatorName.id,
      commentDBWhitCreatorName.creator_id,
      commentDBWhitCreatorName.dislikes,
      commentDBWhitCreatorName.likes,
      commentDBWhitCreatorName.content,
      commentDBWhitCreatorName.created_at,
      commentDBWhitCreatorName.update_at
    )

    const likeSQLlite = likes ? 1 : 0


    const likeOrDislike: LikeDislikeDB = {
      user_id: payload.id,
      comment_id: commentId,
      likes: likeSQLlite
    }

    const likeDislikesExits =
      await this.commentDatabase.findDislikeLike(likeOrDislike)

    if (likeDislikesExits === COMMENT_LIKE.ALREDY_LIKED) {
      if (likes) {
        await this.commentDatabase.removeLikeDislike(likeOrDislike)
        comments.removeLike()
      } else {
        await this.commentDatabase.updateLikeDislike(likeOrDislike)
        comments.removeLike()
        comments.addDisLike()

      }
    } else if (likeDislikesExits === COMMENT_LIKE.ALREDY_DISLIKED) {
      if (!likes === false) {
        await this.commentDatabase.removeLikeDislike(likeOrDislike)
        comments.removeDisLike()
      } else {
        await this.commentDatabase.updateLikeDislike(likeOrDislike)
        comments.removeDisLike()
        comments.addLike()
      }
    } else {
      await this.commentDatabase.insertLikeDislike(likeOrDislike)
      likes ? comments.addLike() : comments.addDisLike()
    }

    const updateCommentDB = comments.toDBModel()
    await this.commentDatabase.updateComment(updateCommentDB)

    const output: LikeOrDislikeOuputDTO = undefined
    return output
  }

  public createComment = async (
    input: CreateCommentInputDTO
  ): Promise<CreateCommentOutputDTO> => {
    // const { id, name, price } = input
    const { content, token } = input

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
      throw new UnathorizedError()
    }

    const id = this.idGenerator.generate()

    const comment = new Comment(
      id,
      payload.id,
      0,
      0,
      content,
      new Date().toISOString(),
      new Date().toISOString()
    )

    console.log(comment)
    const commentsDB = comment.toDBModel()
    await this.commentDatabase.insertComment(commentsDB)

    const output: CreateCommentOutputDTO = undefined
    return output


  }
}


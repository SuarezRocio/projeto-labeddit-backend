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
import { LikeDislikeDB } from "../models/Comment"
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
          const commentDB = new Comment (
            CommentDBWhitCreatorName.id,
            CommentDBWhitCreatorName.creator_id,
            CommentDBWhitCreatorName.dislikes,
            CommentDBWhitCreatorName.likes,
            CommentDBWhitCreatorName.content,
            CommentDBWhitCreatorName.created_at,
            CommentDBWhitCreatorName.update_at,
            CommentDBWhitCreatorName.creator_name
          )
          return commentDB.toBusinessModel()
        })
  
      const output: GetCommentOutputDTO = commentsDB
  
      return output
    }
  
  
    public editComment = async (
      input: EditCommentInputDTO
    ): Promise<EditCommentOutputDTO> => {
      const {idToEdit,  token } = input
  
  
      
      const payload = this.tokenManager.getPayload(token)
      
      if(!payload){
        throw new UnathorizedError()
      }
  
      if (payload === null) {
        throw new BadRequestError("Token inválido.")
      }
  
      const CommentDB = await this.commentDatabase.findCommentById(idToEdit)
      console.log(CommentDB)
      if (!CommentDB) {
        throw new NotFoundError("post com esse id nao existe")
      }
  
      if(payload.id !== CommentDB.creator_id){
        throw new ForbiddenError("soamente que crio o post pode editarlo")
      }
  
    
       if(payload.id !== CommentDB.creator_id){
         throw new ForbiddenError("soamente que crio o post pode editarlo")
       }
  
      const comment = new Comment (
        CommentDB.id,
        CommentDB.creator_id,
        CommentDB.dislikes,
        CommentDB.likes,
        CommentDB.content,
        CommentDB.created_at,
        CommentDB.update_at,
        payload.name
      )
  
      const updateCommentDB = comment.CommentModel()
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
  
      if(!payload){
        throw new UnathorizedError()
      }
  
      if (!commentDadosDB) {
        throw new NotFoundError("post com esse id nao existe")
      }
  
      await this.commentDatabase.deleteCommentById(idToDelete)
  
  
      const output: DeleteCommentOutputDTO = undefined
  
      return output
    }
  
  
    public likeOrDislikeComment = async (
      input: LikeOrDislikeInputDTO
    ): Promise<LikeOrDislikeOuputDTO> => {
      const { token, commentId } = input
  
      const payload = this.tokenManager.getPayload(token)
  
      if (payload === null) {
        throw new BadRequestError("Token inválido.")
      }
  
      const commentDadosDB = await this.commentDatabase.findCommentById(token)
  
      if(!payload){
        throw new UnathorizedError()
      }
  
      if (!commentDadosDB) {
        throw new NotFoundError("post com esse id nao existe")
      }
  
       if(payload.id !== commentDadosDB.creator_id){
         throw new ForbiddenError("soamente que crio o post pode editarlo")
       }
  
  
      const commentDBWhitCreatorName =
        await this.commentDatabase.findCommetDBWhitCreatorNameById(commentId)
  
      if (!commentDBWhitCreatorName) {
        throw new NotFoundError("post com essa id nao existe")
      }
  
      const comments = new Comment(
        commentDBWhitCreatorName.id,
        commentDBWhitCreatorName.creator_id,
        commentDBWhitCreatorName.dislikes,
        commentDBWhitCreatorName.likes,
        commentDBWhitCreatorName.content,
        commentDBWhitCreatorName.created_at,
        commentDBWhitCreatorName.update_at,
        commentDBWhitCreatorName.creator_name
      )
     
      const likeSQLlite = LikeOrDislikeCommentSchema ? 1 : 0
  
  
      const likeOrDislike: LikeDislikeDB = {
        user_id: payload.id,
        comment_id: commentId,
        like: likeSQLlite
      }
  
      const likeDislikesExits =
        await this.commentDatabase.findDislikeLike(likeOrDislike)
  
      if (likeDislikesExits === COMMENT_LIKE.ALREDY_LIKED) {
        if (likeOrDislike) {
          await this.commentDatabase.removeLikeDislike(likeOrDislike)
          comments.removeLike()
        } else {
          await this.commentDatabase.updateLikeDislike(likeOrDislike)
          comments.removeLike()
          comments.addDisLike()
  
        }
      } else if (likeDislikesExits === COMMENT_LIKE.ALREDY_DISLIKED) {
        if (!likeOrDislike === false) {
          await this.commentDatabase.removeLikeDislike(likeOrDislike)
          comments.removeDisLike()
        } else {
          await this.commentDatabase.updateLikeDislike(likeOrDislike)
          comments.removeDisLike()
          comments.addLike()
        }
      } else {
        await this.commentDatabase.insertLikeDislike(likeOrDislike)
        likeOrDislike ? comments.addLike() : comments.addDisLike()
      }
  
      const updateCommentDB = comments.CommentModel()
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
  
      if(!payload){
        throw new UnathorizedError()
      }
  
      const id = this.idGenerator.generate()
  
      const comment = new Comment(
        id,
        content,
        0,
        0,
       new Date().toISOString(),
       new Date().toISOString(),
       payload.id,
        payload.content
      )
  
  
      const CommentsDB = comment.CommentModel()
      await this.commentDatabase.insertComment(CommentsDB)
  
      const output : CreateCommentOutputDTO = undefined
      return output
      
  
  }
  }
  
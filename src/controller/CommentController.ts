import { CreateCommentSchema } from "../dtos/comment/createComment"
import { DeleteCommentSchema } from "../dtos/comment/deleteComment"
import { EditCommentSchema } from "../dtos/comment/editComment"
import { GetCommentSchema } from "../dtos/comment/getComment"
import { LikeOrDislikeCommentSchema } from "../dtos/comment/likeOrDislikeComment"
import { Request, Response } from "express"
import { CommentBusiness } from "../business/CommentBusiness"
import { BaseError } from "../errors/BaseError"
import { ZodError } from "zod"
import { GetCommentsByPostIdSchema } from "../dtos/comment/getCommentById"
export class CommentController {
  constructor(
    private commentBusiness: CommentBusiness
  ) { }

  public getComment = async (req: Request, res: Response) => {
    try {
      const input = GetCommentSchema.parse({
        //  name: req.body.name,
        postId: req.params.id,
        token: req.headers.authorization
        // q: req.query.q
      })

      const output = await this.commentBusiness.getComment(input)

      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public createComment = async (req: Request, res: Response) => {
    try {

      const input = CreateCommentSchema.parse({
        // id: req.body.id,
        content: req.body.content,
        postId: req.params.id,
        //token: req.body.token
        token: req.headers.authorization
      })

      const output = await this.commentBusiness.createComment(input)

      res.status(201).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }


  public editComment = async (req: Request, res: Response) => {
    try {

      const input = EditCommentSchema.parse({
        idToEdit: req.params.id,
        content: req.body.content,
        token: req.headers.authorization
      })

      const output = await this.commentBusiness.editComment(input)

      res.status(201).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }


  public deleteComment = async (req: Request, res: Response) => {
    try {

      const input = DeleteCommentSchema.parse({
        idToDelete: req.params.id,
        content: req.body.content,
        token: req.headers.authorization
      })

      const output = await this.commentBusiness.deleteComment(input)

      res.status(201).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }


  public likeOrDislikeComment = async (req: Request, res: Response) => {
    try {

      const input = LikeOrDislikeCommentSchema.parse({
        commentId: req.params.id,
        likes: req.body.likes,
        token: req.headers.authorization
      })

      const output = await this.commentBusiness.likeOrDislikeComment(input)

      res.status(201).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(error.issues)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public getCommentsByPostId = async (req: Request, res: Response) => {
    try {
      const input = GetCommentsByPostIdSchema.parse({
        token: req.headers.authorization,
        postId: req.params.id,
      });

      const output = await this.commentBusiness.getCommentsByPostId(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

}
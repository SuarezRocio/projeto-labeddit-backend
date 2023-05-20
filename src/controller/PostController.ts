import { Request, Response } from "express"
import { PostBusiness } from "../business/PostBusiness"
import { BaseError } from "../errors/BaseError"
import { GetPostSchema } from "../dtos/post/getPost.dto"
import { ZodError } from "zod"
import { CreatePostSchema } from "../dtos/post/createPost.dto"
import { EditPostSchema } from "../dtos/post/editPost.dto"
import { DeletePostSchema } from "../dtos/post/deletePost.dto"
import { LikeOrDislikePostSchema } from "../dtos/post/likeOrDislike.dto"

export class PostController {
  constructor(
    private postBusiness: PostBusiness
  ) { }

  public getPost = async (req: Request, res: Response) => {
    try {
      const input = GetPostSchema.parse({
     //  name: req.body.name,
       token: req.headers.authorization
        // q: req.query.q
      })

      const output = await this.postBusiness.getPost(input)

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

  public createPost = async (req: Request, res: Response) => {
    try {

      const input = CreatePostSchema.parse({
        // id: req.body.id,
        content: req.body.content,
        //token: req.body.token
        token: req.headers.authorization
      })

      const output = await this.postBusiness.createPost(input)

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


  public editPost = async (req: Request, res: Response) => {
    try {

      const input = EditPostSchema.parse({
        idToEdit: req.params.id,
        content: req.body.content,
        token: req.headers.authorization
      })

      const output = await this.postBusiness.editPost(input)

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


  public deletePost = async (req: Request, res: Response) => {
    try {

      const input = DeletePostSchema.parse({
        idToDelete: req.body.id,
        content: req.body.content,
        token: req.headers.authorization
      })

      const output = await this.postBusiness.deletePost(input)

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

  
  public likeOrDislikePost = async (req: Request, res: Response) => {
    try {

      const input = LikeOrDislikePostSchema.parse({
        postId: req.body.id,
        like: req.body.like,
        token: req.headers.authorization
      })

      const output = await this.postBusiness.likeOrDislikePost(input)

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



}
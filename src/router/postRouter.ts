import express from "express"
import { IdGenerator } from "../services/IdGenerator"
import { PostDatabase } from "../database/PostDatabase"
import { PostController } from "../controller/PostController"
import { PostBusiness } from '../business/PostBusiness'
import { TokenManager } from "../services/TokenManager"

export const postRouter = express.Router()

const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager()
    )
)

postRouter.get("/", postController.getPost)
postRouter.post("/", postController.createPost)
postRouter.get("/:id", postController.getPostById)

postRouter.put("/:id", postController.editPost)
postRouter.delete("/:id", postController.deletePost)

postRouter.put("/:id/like", postController.likeOrDislikePost)

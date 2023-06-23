import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { postRouter } from './router/postRouter'
import { userRouter } from './router/userRouter'
import { commentRouter } from './router/commentRouter'
import bodyParser from 'body-parser'
//import { CommentController } from './controller/CommentController'
/**
 * import { CommentController } from './controller/CommentController'
import { CommentBusiness } from './business/CommentBusiness'
import { CommentDatabase } from './database/CommentDatabase'
import { IdGenerator } from './services/IdGenerator'
import { TokenManager } from './services/TokenManager'
*****************/




dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
//app.use(bodyParser.json())


app.listen(Number(process.env.PORT) || 3003, () => {
    console.log(`Servidor rodando na porta ${Number(process.env.PORT)} || 3003`)
})

app.use("/users", userRouter)
app.use("/post", postRouter)
app.use("/comment", commentRouter)
/*
const commentController = new CommentController(
    new CommentBusiness(
        new CommentDatabase(),
        new IdGenerator(),
        new TokenManager()
    )
)


//commentRouter.post("/", commentController.createComment)
app.post("/hola", commentController.createComment)
*/

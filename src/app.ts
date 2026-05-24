import express, { type Application, type Request, type Response } from "express"
import authRouter from "./modules/auth/auth.route"
import issuesRouter from "./modules/issues/issues.route"
import cors from "cors"
import globalErrorHandler from "./middlewares/globalErrorHandler"

const app: Application = express()

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended: true}))

app.get('/', (req: Request, res: Response)=>{
    res.status(200).json({
      message: "DevPulse Server",
      author: "Torufa Toma",
    });
})

app.use("/api/auth", authRouter);
app.use("/api/issues", issuesRouter);
app.use(globalErrorHandler)

export default app
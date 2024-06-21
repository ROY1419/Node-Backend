import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
// import routes
import userRouter from "./routes/user.routes.js"


// routes declaration
// app.get is for get the detals about data and app.use for methods because we erler declaed the route that why we use .use not .get
app.use("/users", userRouter)


// http://localhost:5000/api/v1/users/register
export { app }
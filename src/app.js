import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.js"
import healthRouter from "./routes/healthCheck.js"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser)

app.get("/", (req, res) => {
    console.log("Home route hit");
    res.status(200).json({ message: "Home route working" });
});


app.use("/api/v1/user", userRouter)
app.use("/api/v1/healthCheck", healthRouter)
export default app
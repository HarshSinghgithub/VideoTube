import connectDB from "./db/index.js"
import { configDotenv } from "dotenv"
import app from "./app.js"

configDotenv({path: ".env"})

connectDB()
.then(
    app.listen(process.env.PORT || 9000,
        () => {
            console.log(`App is running on port ${process.env.PORT}`)
        }
     )
)
.catch(
    (error) => {
        console.log(error)
    }
)
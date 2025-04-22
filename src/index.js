import express from "express"
import dotenv  from "dotenv"

dotenv.config({
    path:"./.env"
})

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//routes import

import userRouter from "./routes/auth.routes.js";


//routes declaration
app.use("/api/v1/users", userRouter);


const port = process.env.PORT || 8000

app.listen(port,()=>{
    console.log(`app listening on port ${port} 🔥`);
})




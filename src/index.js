import express from "express"
import dotenv  from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config({
    path:"./.env"
})

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
      origin: "http://localhost:5173", // Match your frontend URL exactly
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Accept"],
      exposedHeaders: ["Set-Cookie", "*"],
  })
  );


//routes import

import userRouter from "./routes/auth.routes.js";
import problemRouter from "./routes/problem.routes.js"
import executionRoute from "./routes/executeCode.routes.js";
import submissionRoute from "./routes/submission.routes.js";
import playlistRoute from "./routes/playlist.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/problems", problemRouter);
app.use("/api/v1/execute-code" , executionRoute)
app.use("/api/v1/submission" , submissionRoute)
app.use("/api/v1/playlist" , playlistRoute)

const port = process.env.PORT || 8000

app.listen(port,()=>{
    console.log(`app listening on port ${port} 🔥`);
})




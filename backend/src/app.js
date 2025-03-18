import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// ------------------------------------------------------------------------------
// to remove cors error

app.use(cors({
    // origin: process.env.CORS_ORIGIN  || process.env.FRONTEND_URL,
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true
  }));

// ---------------------------------------------------------------------------------

app.use(express.json({
    limit: "20kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(cookieParser())

// ---------------------------------------------------------------------------------

import userRouter from "./routes/user.routes.js"

app.use("/api/v1/users", userRouter)

export {app};

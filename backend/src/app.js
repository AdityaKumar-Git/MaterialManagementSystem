import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import dotenv from "dotenv"
// import path from "path"

// dotenv.config({
//     path: path.resolve(process.cwd(), '.env')
// })



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
import adminRouter from "./routes/admin.routes.js"
import producRouter from "./routes/products.routes.js"
// import orderRouter from "./routes/orders.routes.js"
import cartRouter from "./routes/cart.routes.js"
import tenderRouter from "./routes/tender.routes.js"
import bidRouter from "./routes/bid.routes.js"
import storeRouter from "./routes/store.routes.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/admins", adminRouter)
app.use("/api/v1/products", producRouter)
app.use("/api/v1/cart", cartRouter)
app.use("/api/v1/tenders", tenderRouter)
app.use("/api/v1/tenders", bidRouter)
app.use("/api/v1/store", storeRouter)


export {app};

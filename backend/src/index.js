import dotenv from "dotenv";
import connectDB from "./db/index.js";


import path from "path"

dotenv.config({
    path: path.resolve(process.cwd(), '.env')
})

connectDB().then(
    () => {
        console.log("Connected to Database..")
    }
).catch(
    (err) => {
        console.log("MongoDB connection failed in src/index.js", err)
    }
)
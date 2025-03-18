import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

import path from "path"

dotenv.config({
    path: path.resolve(process.cwd(), '.env')
})

connectDB().then(
    () => {
        console.log("Connected to Database..")
        app.listen(process.env.PORT || 8000, () =>{
            console.log(`Server is running on port ${process.env.PORT || 8000}`);
        })
        
    }
).catch(
    (err) => {
        console.log("MongoDB connection failed in src/index.js", err)
    }
)
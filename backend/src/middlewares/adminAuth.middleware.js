import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";   
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(async(req, res, next) => {
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            throw new ApiError(401, "Unauthorized")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken")

        if(!admin){ 
            throw new ApiError(401, "Admin Not Found in verifyJWT.")
        }

        req.admin = admin;
        next();
    }
    catch(err){
        throw new ApiError(401, err?.message || "Invalid access token")
    }
})


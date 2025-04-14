import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Admin } from "../models/admin.model.js";

import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async(adminId) => {
    try{
        const admin = await Admin.findById(adminId);
        if(!admin) {
            throw new ApiError('Admin not found while generating tokens', 404);
        }
        const accessToken = admin.generateAccessToken()
        const refreshToken = admin.generateRefreshToken()
        
        admin.refreshToken = refreshToken
        await admin.save({validateBeforeSave : false})

        return {accessToken, refreshToken}
    }
    catch(error){
        throw new ApiError(500, "Something went wrong while generating Tokens during Login");
    }
}

// const registerAdmin = asyncHandler(async (req, res) => {
//     const {name, email, password, phoneNumber} = req.body
//     console.log("email: ", email);

//     if([name, email, password, phoneNumber].some(
//         (field) => field?.trim() === "" )
//     ){
//         throw new ApiError(400, "All fields are required");
//     }

//     let existedUser = await Admin.findOne({email})

//     if (existedUser) {
//         throw new ApiError(409, "Admin with E-mail already exists");
//     }
    
//     existedUser = await Admin.findOne({phoneNumber})

//     if (existedUser) {
//         throw new ApiError(409, "Admin with E-mail already exists");
//     }

//     const admin = await Admin.create({
//         name, 
//         email, 
//         password,
//         phoneNumber
//     })

//     const createdAdmin = await Admin.findById(admin._id).select(
//         "-password -refreshToken"
//     )

//     if (!createdAdmin){
//         throw new ApiError(404, "Something went wrong while registering the Admin.");
//     }

//     return res.status(201).json(
//         new ApiResponse(200, createdUser, "Admin Registered Successfully")
//     )
// }) 

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password, phoneNumber  } = req.body;

    if(!email && !phoneNumber){
        throw new ApiError(400, "Phone Number or Email is required");
    }

    if(!password){
        throw new ApiError(400, "Password is required");
    }

    console.log(email || phoneNumber);

    let admin = await Admin.findOne({email: email.toLowerCase()})
    if(!admin){
        admin = await Admin.findOne({phoneNumber: phoneNumber.trim()})
    }

    if(!admin){
        throw new ApiError(404, "Admin not found");
    }

    const isPasswordValid = await admin.isPasswordCorrect(password)
    
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid Password");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(admin._id);
    
    if(!accessToken){
        throw new ApiError(500, "Failed to generate access token");
    }
    if(!refreshToken){
        throw new ApiError(500, "Failed to generate refresh token");
    }

    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken")

    const options = {
        // expires: new Date(Date.now() + 30 * 24 * 60 * 60
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                admin: loggedInAdmin, accessToken, refreshToken
            },
            "Admin logged in successfully",
        )
    )
})

// const logoutAdmin = asyncHandler(async (req, res) => {
//     await Admin.findByIdAndUpdate(
//         req.admin._id,
//         {
//             $unset: {
//                 refreshToken: 1   
//             }
//         },
//         {
//             new: true
//         }
//     )

//     const options = {
//         httpOnly: true,
//         secure: true,
//     }

//     return res
//     .status(200)
//     .clearCookie("accessToken", options)
//     .clearCookie("refreshToken", options)
//     .json(new ApiResponse(200, {}, "Admin logged out successfully"))
// })

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError('No refresh token provided', 401);
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const admin = await Admin.findById(decodedToken?._id)
    
        if(!admin){
            throw new ApiError('Admin not found while refreshing token', 404);
        }
        
        if(incomingRefreshToken !== admin?.refreshToken) {
            throw new ApiError('Refresh token is expired', 401);
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(admin._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken: newRefreshToken
                },
                "Refresh token generated successfully",
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

export {
    // registerAdmin,
    loginAdmin,
    // logoutUser,
    refreshAccessToken
} 
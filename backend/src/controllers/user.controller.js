import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { User } from "../models/user.model.js";
import { Cart } from "../models/cart.model.js";

import jwt from "jsonwebtoken";
import mongoose from "mongoose";


const generateAccessAndRefreshTokens = async(userId) => {
    try{
        const user = await User.findById(userId);
        if(!user) {
            throw new ApiError('User not found while generating tokens', 404);
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}
    }
    catch(error){
        throw new ApiError(500, "Something went wrong while generating Tokens during Login");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password, phoneNumber} = req.body
    console.log("email: ", email);

    if([name, email, password, phoneNumber].some(
        (field) => field?.trim() === "" )
    ){
        throw new ApiError(400, "All fields are required");
    }

    // console.log(User.findOne({email}))

    let existedUser = await User.findOne({email})

    if (existedUser) {
        throw new ApiError(409, "User with E-mail already exists");
    }

    existedUser = await User.findOne({phoneNumber})

    if (existedUser) {
        throw new ApiError(409, "User with E-mail already exists");
    }

    const user = await User.create({
        name, 
        email, 
        password,
        phoneNumber
    })
    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    if (!createdUser){
        throw new ApiError(404, "Something went wrong while registering the user.");
    }
    
    const cart = await Cart.create({
        user: createdUser._id,
        products: []
    })
    
    const createdCart = await Cart.findById(cart._id);
    
    if (!createdCart){
        throw new ApiError(400, "Something went wrong while registering the user.");
    }

    const updatedUser = await User.findByIdAndUpdate(
        createdUser._id,
        { 
            $set:{
                cart: createdCart._id,
            } 
        },
        { new: true }
    ).select(
        "-password -refreshToken"
    )

    return res.status(201).json(
        new ApiResponse(200, updatedUser, "User Registered Successfully")
    )
}) 

const loginUser = asyncHandler(async (req, res) => {
    const { email, password, phoneNumber  } = req.body;

    if(!email && !phoneNumber){
        throw new ApiError(400, "Phone Number or Email is required");
    }

    if(!password){
        throw new ApiError(400, "Password is required");
    }

    console.log(email || phoneNumber);

    let user = await User.findOne({email: email.toLowerCase()})
    if(!user){
        user = await User.findOne({phoneNumber: phoneNumber.trim()})
    }

    if(!user){
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid Password");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);
    
    if(!accessToken){
        throw new ApiError(500, "Failed to generate access token");
    }
    if(!refreshToken){
        throw new ApiError(500, "Failed to generate refresh token");
    }

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

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
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully",
        )
    )
})

// const logoutUser = asyncHandler(async (req, res) => {
//     await User.findByIdAndUpdate(
//         req.user._id,
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
//     .json(new ApiResponse(200, {}, "User logged out successfully"))
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
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError('User not found while refreshing token', 404);
        }
        
        if(incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError('Refresh token is expired', 401);
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
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
    registerUser,
    loginUser,
    // logoutUser,
    refreshAccessToken
} 
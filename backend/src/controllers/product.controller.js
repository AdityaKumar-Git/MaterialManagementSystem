import { Product } from "../models/product.model";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

const addProduct = asyncHandler(async(req, res) => {
    const {name, price, description, category, stock, image} = req.body
    console.log("Name: ",name)

    if([name,description,category].some(
        (field) => field.trim() === "")
    ){ throw new ApiError(400, "All fields are required")}
    
    if(price <= 0){ throw new ApiError(400, "Price must be greater than 0")}
    if(stock <= 0){ throw new ApiError(400, "Stock must be greater than 0")}
    
})
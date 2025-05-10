import { Product } from "../models/product.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadProductImageOnCloudinary } from "../utils/cloudinary.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const addProduct = asyncHandler(async(req, res) => {
    const {name, price, description, stock} = req.body
    // console.log("Name: ",name)

    if([name,description].some(
        (field) => field.trim() === "")
    ){ throw new ApiError(400, "All fields are required")}
    
    if(price <= 0){ throw new ApiError(400, "Price must be greater than 0")}
    if(stock <= 0){ throw new ApiError(400, "Stock must be greater than 0")}
    
    const existedProduct = await Product.findOne({name});
    if(existedProduct) throw new ApiError(409, "Product with same name found");

    const productImagePaths = req.files?.images;
    // const productImagePaths = images;
    // console.log("productimagespath")
    // console.log(productImagePaths);
    
    if (!productImagePaths || productImagePaths.length === 0) {
        throw new ApiError(400, "At least one product image is required");
    }
    
    const uploadedImages = [];
    for (const file of productImagePaths) {
        const localFilePath = file.path;
    
        const uploadedImage = await uploadProductImageOnCloudinary(localFilePath);
        if (!uploadedImage) {
            throw new ApiError(400, "Failed to upload one or more product images");
        }
    
        uploadedImages.push(uploadedImage.url); 
    }


    const product = await Product.create({
        name,
        price,
        description,
        stock,
        image: uploadedImages
    })

    const newProduct = await Product.findById(product._id);
    if(!newProduct) throw new ApiError(404, "Something went wrong.");

    console.log("Successfully added product")

    return res.status(201).json(
        new ApiResponse(200, newProduct, "Product Added Successfully")
    )
})

const updateProduct = asyncHandler(async(req, res) => {
    const {name, price, description, category, stock, image} = req.body
    console.log("Name: ",name)

    if([name,description,category].some(
        (field) => field.trim() === "")
    ){ throw new ApiError(400, "All fields are required")}
    
    if(price <= 0){ throw new ApiError(400, "Price must be greater than 0")}
    if(stock <= 0){ throw new ApiError(400, "Stock must be greater than 0")}
    
    let existedProduct = await Product.findOne({name});
    if(!existedProduct) throw new ApiError(404, "Product not found");

    if(image.trim() === "") image = "https://placehold.co/300x200";

    existedProduct.description = description;
    // continued....
})

const allProducts = asyncHandler(async(req, res) => {
    
    const products = await Product.find()

    return res.status(200).json(
        new ApiResponse(200, products, "Products Retrieved Successfully")
    )
})

const productDetail = asyncHandler(async(req, res) => {
    
    const {productId} = req.params;
    console.log(productId)

    // const product = await Product.findById(new mongoose.Types.ObjectId(productId)).populate('reviews')
    const product = await Product.findById(productId).populate('reviews')
    // console.log(product);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
        new ApiResponse(200, product, "Product Details Retrieved Successfully")
    )
})

export {
    addProduct,
    allProducts,
    productDetail
}
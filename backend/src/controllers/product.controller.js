import { Product } from "../models/product.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadProductImageOnCloudinary, deleteImageFromCloudinary } from "../utils/cloudinary.js"
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
    const {name, price, description, stock} = req.body
    const {productId} = req.params
    // console.log("Name: ",name)
    // console.log("Request body: ", req.body);
    // console.log("Request files: ", req.files);

    if([name,description].some(
        (field) => field.trim() === "")
    ){ throw new ApiError(400, "All fields are required")}
    
    if(price <= 0){ throw new ApiError(400, "Price must be greater than 0")}
    if(stock <= 0){ throw new ApiError(400, "Stock must be greater than 0")}
    
    const existedProduct = await Product.findById(productId);
    if(!existedProduct) throw new ApiError(404, "Product not found");

    // Handle existing images - FormData sends multiple fields with same name
    let finalImages = [];
    
    // Check if existingImages is an array (single value) or multiple values
    if (req.body.existingImages) {
        if (Array.isArray(req.body.existingImages)) {
            finalImages = [...req.body.existingImages];
        } else {
            // Single value, convert to array
            finalImages = [req.body.existingImages];
        }
    }

    // console.log("Existing images from form:", req.body.existingImages);
    // console.log("Final images after existing:", finalImages);

    // Handle new uploaded images
    const productImagePaths = req.files?.images;
    // console.log("Product Image Paths: ",productImagePaths);
    
    if (productImagePaths && productImagePaths.length > 0) {
        const uploadedImages = [];
        for (const file of productImagePaths) {
            const localFilePath = file.path;
        
            const uploadedImage = await uploadProductImageOnCloudinary(localFilePath);
            if (!uploadedImage) {
                throw new ApiError(400, "Failed to upload one or more product images");
            }
        
            uploadedImages.push(uploadedImage.url); 
        }
        finalImages = [...finalImages, ...uploadedImages];
    }

    // console.log("Final Images: ", finalImages);

    // Ensure at least one image exists
    if (finalImages.length === 0) {
        throw new ApiError(400, "At least one product image is required");
    }

    // Find images to delete (images that were in the original product but not in finalImages)
    const imagesToDelete = existedProduct.image.filter(
        originalImage => !finalImages.includes(originalImage)
    );

    // Delete removed images from Cloudinary
    if (imagesToDelete.length > 0) {
        console.log("Deleting images from Cloudinary:", imagesToDelete);
        for (const imageUrl of imagesToDelete) {
            await deleteImageFromCloudinary(imageUrl);
        }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                name,
                price,
                description,
                stock,
                image: finalImages,
            },
        },
        { new: true }
    )

    if(!updatedProduct) throw new ApiError(404, "Something went wrong.");

    console.log("Successfully updated product")

    return res.status(200).json(
        new ApiResponse(200, updatedProduct, "Product updated Successfully")
    )
})

// This is for updating the product quantity when admin accepts a tender
const updateProductQuantity = asyncHandler(async(items) => {

    const products = await Product.find();

    const updatePromises = items.map(async (item) => {
        const product = products.find((p) => p.name === item.name);
        if (product) {
        product.stock = (Number(product.stock) + item.quantity).toString();
        return product.save();
        }
    });

    await Promise.all(updatePromises);

    // res.status(200).json({ message: "Product quantities updated successfully." });
})

const allProducts = asyncHandler(async(req, res) => {
    
    const products = await Product.find()

    return res.status(200).json(
        new ApiResponse(200, products, "Products Retrieved Successfully")
    )
})

const productDetail = asyncHandler(async(req, res) => {
    
    const {productId} = req.params;
    // console.log(productId)

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
    updateProduct,
    updateProductQuantity,
    allProducts,
    productDetail
}
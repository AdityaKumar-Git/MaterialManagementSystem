import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const addProduct = asyncHandler (async(req, res) => {
    const {productId, quantity} = req.body
    const user = req.user

    const cart = await Cart.findById(user.cart);
    
    if(!cart) {
        throw new ApiError('Cart not found', 404);
    }
    
    const product = await Product.findById(productId);
    
    if(!product) {
        throw new ApiError('Product not found', 404);
    }

    if(parseInt(product.stock) < quantity) {
        throw new ApiError('Not enough stock available', 400);
    }

    cart.products.push({product: productId, quantity: quantity});
    
    const updatedCart = await cart.save();
    
    return res.status(201).json(
        new ApiResponse(200, updatedCart, "Product Successfully added to the Cart")
    )
})

const removeProduct = asyncHandler(async(req, res) => {
    const {productId} = req.params
    const user = req.user

    const cart = await Cart.findById(user.cart);

    if(!cart) {
        throw new ApiError('Cart not found', 404);
    }
    
    const product = await Product.findById(productId);
    
    if(!product) {
        throw new ApiError('Product not found', 404);
    }

    cart.products = cart.products.filter(p => 
        p.product.toString() !== productId.toString()
    );

    const updatedCart = await cart.save();
    
    return res.status(200).json(
        new ApiResponse(200, updatedCart, "Product Successfully removed from the Cart")
    )
})

const changeQuantity = asyncHandler(async(req, res) => {
    const {productId, quantity} = req.body
    const user = req.user
    console.log(productId);
    const cart = await Cart.findById(user.cart);

    
    if(!cart) {
        throw new ApiError('Cart not found', 404);
    }
    
    const product = await Product.findById(productId);
    
    if(!product) {
        throw new ApiError('Product not found', 404);
    }

    if(parseInt(product.stock) < quantity) {
        throw new ApiError('Not enough stock available', 400);
    }

    const existingProduct = cart.products.find(p =>
        p.product.toString() === productId.toString()
    );
    
    if(!existingProduct) {
        throw new ApiError('Product not available in the cart', 400);
    }

    existingProduct.quantity = quantity;

    const updatedCart = await cart.save();
    
    return res.status(200).json(
        new ApiResponse(200, updatedCart, "Product quantity successfully updated in the cart")
    )
})

const getCart = asyncHandler(async(req, res) => {
    const { cartId } = req.params
    console.log(cartId)
    const cart = await Cart.findById(cartId).populate('products.product');

    if(!cart) {
        throw new ApiError('Cart not found', 404);
    }

    return res.status(200).json(
        new ApiResponse(200, cart, "Product quantity successfully updated in the cart")
    )
})


export{
    addProduct,
    removeProduct,
    changeQuantity,
    getCart
}
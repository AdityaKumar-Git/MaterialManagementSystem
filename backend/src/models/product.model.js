import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    price: { 
        type: Number, 
        required: true 
    },

    description: { 
        type: String, 
        required: true 
    },

    image: [
        {
            type: String, 
            required: true
        }
    ],

    stock: {
        type: String,
        required: true
    },

    netSold: {
        type: Number
    },

    rating: {
        type: Number
    },
    
    reviews: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            comment: {
                type: String,
            },
            rating: {
                type: Number,
                required: true
            }
        }
    ]
});

productSchema.methods.calculateRating = async function() {
    const reviews = this.reviews;
    let sum = 0;
    for (let i = 0; i < reviews.length; i++) {
        sum += reviews[i].rating;
    }
    const average = sum / reviews.length;
    return average;
}

export const Product = mongoose.model("Product", productSchema);
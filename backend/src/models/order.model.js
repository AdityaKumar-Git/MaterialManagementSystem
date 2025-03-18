import mongoose, {Schema} from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    orderTime: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

export const Order = mongoose.model("Order", orderSchema)
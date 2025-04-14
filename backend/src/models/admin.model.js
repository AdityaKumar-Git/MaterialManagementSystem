import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            // unique: true,
        },

        profileImage: {
            type: String,
        },

        password: {
            type: String,
            required: [true, 'Password is Required'],
        },

        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },

        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
);

adminSchema.pre("save", async function (next){
    const admin = this;
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 10);
    }
    next();
})

adminSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
} 

adminSchema.methods.generateAccessToken = function () {
    // console.log(process.env.ACCESS_TOKEN_SECRET);
    return jwt.sign(
        { 
            _id: this._id,
            email: this.email,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        { 
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        },
                
    )
}

adminSchema.methods.generateRefreshToken = function () {
    // console.log(process.env.REFRESH_TOKEN_SECRET);
    return jwt.sign(
        { 
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { 
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        },                
    )
}

export const Admin = mongoose.model("Admin", adminSchema); 
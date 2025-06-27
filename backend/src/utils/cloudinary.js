import {v2 as cloudinary} from "cloudinary"
import fs from "fs" 
import dotenv from "dotenv";
import path from "path"

dotenv.config({
    path: path.resolve(process.cwd(), '.env')
})

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const checkup = () => {
    console.log("Check Up")
}

// console.log("Cloudinary config: ", {
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET ? "✓ present" : "✗ missing"
//   });

// console.log("OUTSIDE", process.env.CLOUDINARY_API_KEY);

const uploadProductImageOnCloudinary = async (localFilePath) => {
    try {
        console.log(process.env.CLOUDINARY_API_KEY);
        if(!localFilePath){
            console.log("cloudinary.js is not recieving file")
            return null
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "materialmanagement/productimage",
        })
        // console.log("File is uploaded on Cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;
    }
    catch (error) {
        fs.unlinkSync(localFilePath)
        console.log(error);
        return null;
    }
}

const uploadProfileImageOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            console.log('No file path provided');
            return null
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "materialmanagement/profileImage",
        })
        // console.log("File is uploaded on Cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;
    }
    catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}

const deleteImageFromCloudinary = async (imageUrl) => {
    try {
        if (!imageUrl) return null;
        
        // Extract public_id from URL
        const urlParts = imageUrl.split('/');
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const publicId = `materialmanagement/productimage/${filenameWithExtension.split('.')[0]}`;
        
        const response = await cloudinary.uploader.destroy(publicId);
        // console.log("Image deleted from Cloudinary:", publicId);
        return response;
    } catch (error) {
        console.log("Error deleting image from Cloudinary:", error);
        return null;
    }
}

export {
    uploadProductImageOnCloudinary,
    uploadProfileImageOnCloudinary,
    deleteImageFromCloudinary
}
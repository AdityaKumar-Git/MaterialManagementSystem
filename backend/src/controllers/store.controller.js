import { Store } from "../models/store.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadProductImageOnCloudinary } from "../utils/cloudinary.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const updateStore = async({storeName, items}) => {

    const store = await Store.findOne({name:storeName});
    
    if(store){
        const itemsList = store.items;
        items.map(async (item) => {
            const product = itemsList.find((p) => p.name === item.name);
            if (product) {
                product.quantity = item.quantity + product.quantity;
            }
            else {
                itemsList.push({name: item.name, quantity: item.quantity})
            }
        });

        // await Promise.all(updatePromises);
        // return store.save();
        store.items = itemsList;
        await store.save();
    }

    else {
        // const itemsNames = ["MCB", "VCB", "Transformers", "Conductors", "Switches", "Insulators", "H-Beams", "Poles", "RS-Joists"];
        const itemsList = []
        items.map((item) => (
            itemsList.push({
                name: item.name,
                quantity: item.quantity
            })
        ))
        const res = await Store.create({
            name:storeName,
            items: itemsList
       })
        // console.log("store.contoller.js")
    }
}

const storeDetail = asyncHandler(async(req, res) => {
    const stores = await Store.find();
    
    if (!stores) {
        throw new ApiError(404, "Store not found");
    }

    return res.status(200).json(
        new ApiResponse(200, stores, "Store Details Retrieved Successfully")
    )

})

export {
    updateStore,
    storeDetail
}
import { Tender } from "../models/tender.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateProductQuantity } from "./product.controller.js";
import { updateStore } from "./store.controller.js";


const createTender = asyncHandler(async (req, res) => {
  const { title, description, items, store } = req.body;

  if (!title || !description || !items || !store) {
    throw new ApiError(400, "Title, description, store and items are required");
  }

  if (!req.admin?._id) {
    throw new ApiError(401, "Admin not authenticated");
  }

  const tender = await Tender.create({
    title,
    description,
    items,
    store,
    createdBy: req.admin._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, tender, "Tender created successfully"));
});

const getAllTenders = asyncHandler(async (req, res) => {
  const tenders = await Tender.find().populate("createdBy", "username email");

  return res
    .status(200)
    .json(new ApiResponse(200, tenders, "Tenders fetched successfully"));
});

const getTenderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tender = await Tender.findById(id).populate("createdBy", "username email");

  if (!tender) {
    throw new ApiError(404, "Tender not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tender, "Tender fetched successfully"));
});

const updateTenderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, items, storeName } = req.body;
  const isCloseRequest = req.path.endsWith('/close');

  // If it's a close request, set status to 'closed'
  const newStatus = isCloseRequest ? 'closed' : status;

  if (!isCloseRequest && !newStatus) {
    throw new ApiError(400, "Status is required");
  }

  // Validate status
  if (!["active", "closed", "awarded"].includes(newStatus)) {
    throw new ApiError(400, "Invalid status. Must be one of: active, closed, awarded");
  }

  if(newStatus === "awarded"){
    updateProductQuantity(items)
    updateStore({storeName, items})
  }

  const tender = await Tender.findByIdAndUpdate(
    id,
    { status: newStatus },
    { new: true }
  ).populate("createdBy", "username email");

  if (!tender) {
    throw new ApiError(404, "Tender not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tender, "Tender status updated successfully"));
});

export { createTender, getAllTenders, getTenderById, updateTenderStatus }; 
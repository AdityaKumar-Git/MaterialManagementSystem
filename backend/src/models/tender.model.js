import mongoose from "mongoose";

const tenderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unit: {
          type: String,
          required: true,
          enum: ["kg", "piece", "meter", "liter", "box"],
        },
      },
    ],
    store: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "closed", "awarded"],
      default: "active",
    },
    deadline: {
      type: Date,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

export const Tender = mongoose.model("Tender", tenderSchema); 
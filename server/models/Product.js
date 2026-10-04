import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a product description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a product price"],
      default: 0.0,
    },
    category: {
      type: String,
      required: [true, "Please provide a product category"],
    },
    stock: {
      type: Number,
      required: [true, "Please provide stock quantity"],
      default: 0,
    },
    image: {
      type: String,
      required: [true, "Please provide a product image URL"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);

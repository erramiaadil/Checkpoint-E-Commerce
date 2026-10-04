import dotenv from "dotenv";
import connectDB from "./config/db.js";
import products from "./data/products.js";
import Product from "./models/Product.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Clear existing products
    await Product.deleteMany();

    // Insert sample products
    await Product.insertMany(products);

    console.log("Products Imported to MongoDB Atlas Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("All Products Removed from Database!");
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// Check command line arguments: "node seeder.js -d" destroys data
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}

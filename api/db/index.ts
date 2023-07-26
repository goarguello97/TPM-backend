import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const DB_URI = process.env.DB_URI;

mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("DB Connected");
  } catch (error) {
    console.log("ERROR", error);
  }
};

export default connectDB;

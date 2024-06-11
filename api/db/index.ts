import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

let DB_URI: string;

if (process.env.NODE_ENV === "test") {
  DB_URI = process.env.DB_URI_TEST as string;
} else {
  DB_URI = process.env.DB_URI as string;
}

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

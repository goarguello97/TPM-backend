import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./db";
import router from "./routes/index.routes";
import { createAvatarDefault, createRoles } from "./config/initialSetup";

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  //update: or "origin: true," if you don't wanna add a specific one
  credentials: true,
  exposedHeaders: ["set-cookie"],
};

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;
connectDB();
createAvatarDefault();
createRoles();

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api", router);

const server = app.listen(PORT, () => {
  return console.log(`Server listenning on port ${PORT}`);
});

export { app, server };

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import router from "./api/routes/index.routes";
import connectDB from "./api/db";
import createRoles from "./api/config/initialSetup";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;
connectDB();
createRoles();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api", router);

app.listen(PORT, () => {
  return console.log(`Server listenning on port ${PORT}`);
});

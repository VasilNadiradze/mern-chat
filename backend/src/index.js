import express from "express";
import dotenv from "dotenv";
import AuthRoutes from "./routes/auth.route.js";
import MessageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

app.use(express.json()); // format to json req.body
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use("/api/auth", AuthRoutes);
app.use("/api/message", MessageRoutes);

app.listen(PORT, () => {
  console.log("სერვერი ამუშავდა პორტზე : " + PORT);
  connectDB();
});

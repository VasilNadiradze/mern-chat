import express from "express";
import dotenv from "dotenv";
import AuthRoutes from "./routes/auth.route.js";
import MessageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(express.json()); // format to json req.body
app.use(cookieParser());
app.use("/api/auth", AuthRoutes);
app.use("/api/message", MessageRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("სერვერი ამუშავდა პორტზე : " + PORT);
  connectDB();
});

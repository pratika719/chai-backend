import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.static("public"));

app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

import userRoutes from "./routes/userroutes.js";

app.use("/api/v1/users", userRoutes);

export {app};

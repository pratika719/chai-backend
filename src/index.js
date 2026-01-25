import mongoose from "mongoose";

import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";

dotenv.config();
const app = express();

connectDB();
app.use(express.json());

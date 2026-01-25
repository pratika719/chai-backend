import mongoose from "mongoose";

import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";

dotenv.config();
const app = express();

connectDB().then(() => {
    console.log("Database connection established, starting the server...");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Failed to connect to the database", error);
});


app.use(express.json());

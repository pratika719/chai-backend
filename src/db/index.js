import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


  const connectDB=async () => {
    try{
       const connectioninstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("Connected to the database");
       
            console.log(" connected to the  mongo server",connectioninstance.connection.host);
        

        
        
    } catch (error) {
        console.error("Error connecting to the database", error);
    }
}

export default connectDB;

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv";
dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary= async (localfilePath, folderName) => {
    try{
        if(!localfilePath) return null;

      const response  = await cloudinary.uploader.upload(localfilePath,{
            resource_type:"auto",

        })
        fs.unlinkSync(localfilePath)
        return response;
    }
    catch(error){
        fs.unlinkSync(localfilePath);

        console.log("error while uploading file to cloudinary",error);
        return null;

    }
}

export {uploadOnCloudinary}




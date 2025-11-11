import mongoose from "mongoose"
import { DB_NAME } from "../constants.js";


const connectDB = async () =>{
    try {

        const db = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}` || "",{})
        console.log("Connected to database",db.connection.host);
        
    } catch (error) {
        console.log("Error connecting to database",error);
        process.exit(1);
    }
}


export default connectDB;
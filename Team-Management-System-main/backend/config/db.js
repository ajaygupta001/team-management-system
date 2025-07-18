import mongoose from "mongoose";

const dbConnect = async()=>{
    try {
         await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb Connected")
        
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default  dbConnect;
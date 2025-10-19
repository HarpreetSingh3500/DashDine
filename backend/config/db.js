import mongoose from "mongoose";

// function that make connection with DB
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB Connected.");
        
    } catch (error) {
        console.log("DB Error!",error);
    }
}

export default connectDb;
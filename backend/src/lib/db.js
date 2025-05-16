import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("დაკავშირება ბაზასთან: " + conn.connection.host);
  } catch (error) {
    console.log("ვერ მოხერხდა ბაზასთან დაკავშირება", error);
  }
};

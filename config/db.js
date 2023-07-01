import mongoose from "mongoose";
const DBURL = process.env.DB_LINK;

//to connect to the database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database connected successfully`);
  } catch (error) {
    console.log("Error while connecting to the database", error.messaeg);
  }
};

export default connectDB;

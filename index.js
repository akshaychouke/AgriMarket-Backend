import express from "express";
import colors from "colors";
import dotenv from "dotenv/config";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
// initialize express app
const app = express();


//middelwares 
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth",authRoutes);





//res api
app.get("/", (req, res) => {
  res.send("Welcome to ecommerce!");
});

//connect to database
connectDB();
//PORT 
const PORT = process.env.PORT || 8080;
//to listen to the port
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})




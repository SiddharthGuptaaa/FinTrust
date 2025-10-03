import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import prisma from "./prismaClient";
import authRoutes from "../routes/authRoutes";
import userRoutes from "../routes/userRoutes";
import accountRoutes from "../routes/accountRoutes";
import transactionRoutes from "../routes/transactionRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json()); // built-in middleware for parsing incoming JSON request bodies into JavaScript objects

app.use(cookieParser()); //makes cookies available via req.cookies

app.use(cors({
  origin: "http://localhost:5173", //frontend url
  credentials: true, //allows cookies to be sent
}));



app.use("/api/auth", authRoutes); //use auth routes
app.use("/api/users", userRoutes); //use user routes
app.use("/api/accounts", accountRoutes); //use account routes
app.use("/api/transactions", transactionRoutes); //use transaction routes
app.get('/', (req: Request, res: Response)=> {
  res.send('Welcome to FinTrust API!');
})





const PORT = process.env.PORT || 5000;
async function connectDB() { //function to connect to mysql db
  try {
    await prisma.$connect();
    console.log("Connected to mysql db");
  }
  catch (error) {
    console.error("Error connecting to mysql db:", error);
    process.exit(1);
  }
}

//server listening on port
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});

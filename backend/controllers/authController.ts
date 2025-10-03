import {Request, Response} from "express";
import prisma from "../src/prismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// REGISTER USER
export const register = async (req: Request, res: Response) => {
  const {email, password, name, address} = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: {email}});
    if(existingUser) return res.status(409).json({error: "User already exists"});

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({ //creating new user in mysql db
      data: {email, password: hashedPassword, name, address },
    })

    //express method to send a JSON response to the frontend
    res.json({message: "User registered successfully", user: {id: newUser.id, email: newUser.email, name: newUser.name}})
  }
  catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

// LOGIN USER 
export const login = async (req: Request, res: Response) => {
  const {email, password} = req.body;
  if(!email || !password) return res.status(400).json({ error: "Email and password are required"}); //Bad request
  try {
    const user = await prisma.user.findUnique({where: {email}}); //if user with given email exists or not
    if(!user) return res.status(401).json({error: "Invalid credentials"}); //401 unauthorized user

    const isMatch = await bcrypt.compare(password, user.password); //comparing hashed password
    if(!isMatch) return res.status(401).json({error: "Invalid credentials"});

    const token = jwt.sign({userId: user.id, role: user.role}, JWT_SECRET, {expiresIn: "1h"}); //jwt token which has payload and signature and valid for 1 hour

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60*60*1000,
    })
    res.json({message: "Login successful", user: {
      id: user.id,
      email: user.email,
      name: user.name
    }});
  }
  catch (error: any) {
    res.status(500).json({error: error.message}); //500 for internal server error
  }
}
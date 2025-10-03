import { Request, Response } from "express";
import prisma from "../src/prismaClient";
import { AuthRequest } from "../middlewares/authMiddleware";
import bcrypt from "bcrypt";

//async handler that gets user profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {id: req.user.userId}, // userId is from the payload of jwt token
      select: {id: true, name: true, email: true, role: true} //only select these fields from user object (exclude password)
    })
    res.json(user); //sends user profile as json response
  }
  catch(error: any) {
    res.status(500).json({error: error.message});
  }
}

//async handler that updates user profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const {name, phone, address} = req.body;

    const updatedUser = await prisma.user.update({
      where: {id: req.user.userId},
      data: { name, phone, address}
    })

    res.json({message: "Profile updated successfully", updatedUser});
  }
  catch(error: any) {
    res.status(500).json({error: error.message});
  }
}

//async handler that changes user password
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword} = req.body;
    const user = await prisma.user.findUnique({where: {id: req.user.userId}})

    if(!user) return res.status(404).json({error: "User not found"});

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if(!isValid) return res.status(401).json({error: "Current password is incorrect"}); //unauthorized 401

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where:{id: req.user.userId},
      data: { password: hashedPassword}
    })

    res.json({message: "Password updated successfully"});

  }
  catch(error: any) {
    res.status(400).json({error: error.message});
  }
}
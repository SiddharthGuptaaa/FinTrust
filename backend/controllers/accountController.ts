import prisma from "../src/prismaClient";
import { Request, Response } from "express";


// creating account 
export const createAccount = async (req: Request, res: Response) => {
  const {type, userId, accountNo} = req.body;

  try {
    const newAccount = await prisma.account.create({
      data: { //contains the data that will be inserted into the accounts table
        type,
        accountNo,
        user: {
          connect: { id: userId } //helps to link the account to the existing user
        }
      }
    })
    res.status(201).json(newAccount); //201 stands for created
  } catch (error) {
    res.status(500).json({ error: "Failed to create account" }); //500 stands for server error
  }
}

// get account details
export const getAccountDetails = async (req: Request, res: Response) => {
  const {userId} = req.params;

  try {
    const accounts = await prisma.account.findMany({
      where: {userId: Number(userId)}, //finds all accounts that belong to the user with the specified userId
    })
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve account details" }); //500 stands for server error
  }
}
import {Request, Response} from 'express';
import prisma from '../src/prismaClient';


//creating a transaction
export const createTransaction = async (req: Request, res:Response) => {
  const {amount, type, accountId} = req.body;

  try {
    const updatedAccount = await prisma.account.update({
      where: {id: accountId},
      data: {
        balance: {
          increment: type === 'credit' ? amount : -amount,
        },
      },
    })

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        accountId,
      }
    })
    res.status(201).json({transaction, updatedAccount});
  } catch (error) {
    res.status(500).json({ error: "Failed to create transaction" }); //res.json converts JS object to JSON string, set Content-Type to application/json and sends JSON response to client
  }
}

//Get transaction history
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve transactions" });
  }
}
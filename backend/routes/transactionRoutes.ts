import {Router} from "express";
import { createTransaction, getTransactions } from "../controllers/transactionController";

const router = Router();

router.post("/", createTransaction);
router.get("/", getTransactions);

export default router;
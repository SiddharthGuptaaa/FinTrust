import {Router} from "express";
import {createAccount, getAccountDetails} from "../controllers/accountController";

const router = Router();

router.post("/", createAccount);
router.get("/:userId", getAccountDetails);

export default router;

import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

//secret key to verify JWT token
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export interface AuthRequest extends Request {
  user?: any; //custom-type property to attach the decoded token payload to req.user
}

//middleware to verify jwt token its used to protect routes 
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token  //read from cookie

  if(!token) return res.status(401).json({error: "Access denied. No token provided."}); //unauthorized

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if(err) return res.status(403).json({error: "Invalid token"}); //Forbidden

      req.user = decoded; //attach decoded payload to req.user
  
      next();
});
};

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const userAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    console.log(req.session.username);
    
    // check that user is logged in
    if (req.session.username) {
        console.log("user authentication successful");
        next();
    } else {
        console.log("user authentication failed");
        return res.status(500).json({ error: "you're not logged in..." });
    }
}


export default userAuthMiddleware;

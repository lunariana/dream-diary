import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const username = req.body.username;
    const password = req.body.password;

    ////////////////////////////////////////////////////////////////////////////////// should check length of username and password

    const user = await prisma.users.findUnique({
        where: {
            username: username,
        },
    });
    console.log("auth middleware:", user);

    // check whether username exists in database
    if (user === null) {
        return res.status(500).json({ error: "User does not exist" });
    }

    // check whether username and password match
    if (password !== user.password) {
        return res.status(500).json({ error: "Wrong password" });
    }

    next();
}


export default authMiddleware;

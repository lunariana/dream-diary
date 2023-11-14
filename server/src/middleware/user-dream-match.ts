import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const userDreamMiddleware = async (req: Request, res: Response, next:NextFunction) => {

    const dreamID = Number(req.params.dreamID);
    const username = req.body.username;

    const dream = await prisma.dreams.findUnique({
        where: {
            dreamID: dreamID,
        },
    });
    console.log("user dream match middleware:", dream);

    // check that dream exists
    if (dream === null) {
        return res.status(500).json({ error: "Dream does not exist" });
    }

    // check that username and dreamid match
    if (username !== dream.username) {
        return res.status(500).json({ error: "You do not have permission to view this dream" });
    }

    next();
}


export default userDreamMiddleware;

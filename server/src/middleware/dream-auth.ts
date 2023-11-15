import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const dreamAuthMiddleware = async (req: Request, res: Response, next:NextFunction) => {

    // user authentication should already have been done
    // check that user is authorized to view this dream

    const dreamID = Number(req.params.dreamID);
    const username = req.session.username;

    const dream = await prisma.dreams.findUnique({
        where: {
            dreamID: dreamID,
        },
    });
    console.log("dream auth middleware:", dream);

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


export default dreamAuthMiddleware;

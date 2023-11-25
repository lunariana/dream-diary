import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const dreamAuthMiddleware = async (req: Request, res: Response, next:NextFunction) => {

    // user authentication should already have been done
    // check that user is authorized to view this dream
    
    const username = req.session.username;
    const dreamID = Number(req.params.dreamID);

    // check that dreamID is a number
    if (Number.isNaN(dreamID)) {
        return res.status(500).json({ error: "you must have the wrong link..." });
    }

    const dream = await prisma.dreams.findUnique({
        where: {
            dreamID: dreamID,
        },
    });
    console.log("dream auth middleware:", dream);

    // check that dream exists
    if (dream === null) {
        return res.status(500).json({ error: "uh oh! this dream doesn't seem to exist :(" });
    }

    // check that username and dreamid match
    if (username !== dream.username) {
        return res.status(500).json({ error: "hmm, looks like you've stumbled upon someone else's dream..." });
    }

    next();
}


export default dreamAuthMiddleware;

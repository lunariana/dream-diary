import express, { Request, Response } from 'express';
import userDreamMatchMiddleware from '../middleware/user-dream-match';

const router = express.Router();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

router.use(express.json());

// // authentication middleware function gets executed before every api function call to router
// router.use(authMiddleware);

router.post('/newDream', async (req: Request, res: Response) => {

    // test in git bash terminal:
    // curl.exe -X POST http://localhost:8000/dream/newDream -H "Content-Type: application/json" -d '{"dreamID": 2, "title": "title2", "content": "conntennttt", "username": "lunaria"}'

    console.log("new dream:", req.body);
    const { dreamID, title, content, username } = req.body;
    const dateCreated = new Date();

    // check that dreamID does not already exist in database
    const dreamIDExists = await prisma.dreams.findUnique({
        where: {
            dreamID: dreamID,
        },
    });
    if (dreamIDExists) {
        return res.status(500).json({ error: "Dream ID must be unique" });
    }

    //////////////////////////////////////////////////////////////////////////////// should check length of title and content

    const createdDream = await prisma.dreams.create({
        data: {
            dreamID: dreamID,
            title: title,
            content: content,
            dateCreated: dateCreated,
            username: username,
        },
    });
    console.log(createdDream);

    return res.status(200).json(createdDream);
});

router.post('/:dreamID/getDream', userDreamMatchMiddleware, async (req: Request, res: Response) => {

    // test in git bash terminal:
    // curl.exe -X POST http://localhost:8000/dream/1/getDream -H "Content-Type: application/json" -d '{"username": "lunaria"}'

    console.log("get dream:", req.body);
    const dreamID = Number(req.params.dreamID);
    const { username } = req.body;

    const dreamResult = await prisma.dreams.findUnique({
        select: {
            title: true,
            content: true,
            dateCreated: true,
        },
        where: {
            dreamID: dreamID,
        },
    });
    console.log(dreamResult)

    return res.status(200).json(dreamResult);
});

router.post('/:dreamID/editDream', userDreamMatchMiddleware, async (req: Request, res: Response) => {
    
    // test in git bash terminal:
    // curl.exe -X POST http://localhost:8000/dream/1/editDream -H "Content-Type: application/json" -d '{"title": "newtitle", "content": "blablablablah", "username": "lunaria"}'

    console.log("edit dream:", req.body);
    const dreamID = Number(req.params.dreamID);
    const { title, content, username } = req.body;
    const dateEdited = new Date();

    ////////////////////////////////////////////////////////////////////////////////////////// should check length of title and content

    const updatedDream = await prisma.dreams.update({
        where: {
            dreamID: dreamID,
        },
        data: {
            title: title,
            content: content,
            dateEdited: dateEdited,
        },
    });
    console.log(updatedDream);

    return res.status(200).json(updatedDream);
});

router.post('/:dreamID/deleteDream', userDreamMatchMiddleware, async (req: Request, res: Response) => {

    // test in git bash terminal:
    // curl.exe -X POST http://localhost:8000/dream/3/deleteDream -H "Content-Type: application/json" -d '{"username": "lunaria"}'

    console.log("delete dream:", req.body);
    const dreamID = Number(req.params.dreamID);
    const { username } = req.body;

    const deletedDream = await prisma.dreams.delete({
        where: {
            dreamID: dreamID,
        },
    });
    console.log(deletedDream);

    return res.status(200).json(deletedDream);
});


export default router;

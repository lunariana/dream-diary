import express, { Request, Response } from 'express';
import dreamAuthMiddleware from '../middleware/dream-auth';
import userAuthMiddleware from '../middleware/user-auth';

const router = express.Router();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

router.use(express.json());

// authentication middleware function gets executed before every api function call to router
router.use(userAuthMiddleware);

router.post('/newDream', async (req: Request, res: Response) => {

    // create new dream for user using given info

    // (outdated) test in git bash terminal:
    // curl.exe -X POST http://localhost:8000/dream/newDream -H "Content-Type: application/json" -d '{"dreamID": 2, "title": "title2", "content": "conntennttt"}'

    console.log("new dream:", req.body);
    const { dreamID, title, content } = req.body;
    const username = req.session.username ? req.session.username : "";    // sets username to req.session.username if it is truthy; otherwise sets username to ""; probably won't happen but need this to resolve type error
    const dateCreated = new Date();
    console.log(dateCreated.toString());

    // check that dreamID does not already exist in database
    const dreamIDExists = await prisma.dreams.findUnique({
        where: {
            dreamID: dreamID,
        },
    });
    if (dreamIDExists) {
        return res.status(500).json({ error: "dream id must be unique" });
    }

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

router.post('/getDreams', async (req: Request, res: Response) => {

    // return list of user's dreams
    
    console.log("get dreams");
    const username = req.session.username;

    const dreamsResult = await prisma.dreams.findMany({
        where: {
            username: username,
        },
        orderBy: [
            { dateCreated: 'desc' },
            { dreamID: 'desc' },
        ],
    });
    console.log(dreamsResult);

    return res.status(200).json(dreamsResult);
});

router.post('/:dreamID/getDream', dreamAuthMiddleware, async (req: Request, res: Response) => {

    // get dream with given dream id

    // (outdated) test in git bash terminal:
    // curl.exe -X POST http://localhost:8000/dream/1/getDream -H "Content-Type: application/json"

    console.log("get dream:", req.body);    // req.body probably doesn't need to contain anything at this point
    const dreamID = Number(req.params.dreamID);

    const dreamResult = await prisma.dreams.findUnique({
        where: {
            dreamID: dreamID,
        },
    });
    console.log(dreamResult)

    return res.status(200).json(dreamResult);
});

router.post('/:dreamID/editDream', dreamAuthMiddleware, async (req: Request, res: Response) => {
    
    // update dream with given dream id using given info

    // (outdated) test in git bash terminal:
    // curl.exe -X POST http://localhost:8000/dream/1/editDream -H "Content-Type: application/json" -d '{"title": "newtitle", "content": "blablablablah"}'

    console.log("edit dream:", req.body);
    const dreamID = Number(req.params.dreamID);
    const { title, content } = req.body;
    const dateEdited = new Date();
    console.log(dateEdited.toString());

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

router.post('/:dreamID/deleteDream', dreamAuthMiddleware, async (req: Request, res: Response) => {

    // delete dream with given dream id

    // (outdated) test in git bash terminal:
    // curl.exe -X POST http://localhost:8000/dream/3/deleteDream -H "Content-Type: application/json"

    console.log("delete dream:", req.body);    // req.body probably doesn't contain anything rn
    const dreamID = Number(req.params.dreamID);

    const deletedDream = await prisma.dreams.delete({
        where: {
            dreamID: dreamID,
        },
    });
    console.log(deletedDream);

    return res.status(200).json(deletedDream);
});

router.get('/nextDreamID', async (req: Request, res: Response) => {
    
    // return id of next dream to be inserted into database

    console.log("next dream id");

    const nextDreamID = await prisma.dreams.findFirst({
        orderBy: {
            dreamID: 'desc',
        },
    });
    console.log(nextDreamID);

    if (!nextDreamID) {
        // if dream database is empty, start from id 1
        return res.status(200).send('1');
    } else {
        // return 1 + largest dream id in database
        return res.status(200).send((nextDreamID.dreamID + 1).toString());
    }
});


export default router;

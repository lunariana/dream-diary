import express, { Request, Response } from 'express';
import authMiddleware from '../middleware/auth';

const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.use(express.json());

router.post('/signup', async (req: Request, res: Response) => {

    // test in git bash terminal:
    // curl.exe -X POST http://localhost:8000/user/signup -H "Content-Type: application/json" -d '{"username": "benn", "password": "pass", "firstName": "Ben", "lastName": null}'

    console.log("user signup:", req.body);
    const { username, password, firstName, lastName } = req.body;

    /////////////////////////////////////////////////////////////////////////////// should check length of username, password, first & last name

    // check that the username is unique
    const usernameExists = await prisma.users.findUnique({
        where: {
            username: username,
        },
    });
    if (usernameExists) {
        return res.status(500).json({ error: "Username is already taken" });
    }

    // add new user to database
    const createdUser = await prisma.users.create({
        select: {
            username: true,
            firstName: true,
            lastName: true,
        },
        data: {
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName,
        },
    });
    console.log(createdUser);
    
    return res.status(200).json(createdUser);
});

router.post('/login', authMiddleware, async (req: Request, res: Response) => {

    // test in git bash terminal:
    // curl.exe -X POST http://localhost:8000/user/login -H "Content-Type: application/json" -d '{"username": "lunaria", "password": "password"}'

    console.log("user login:", req.body);
    const { username, password } = req.body;

    const user = await prisma.users.findUnique({
        select: {
            username: true,
            firstName: true,
            lastName: true,
        },
        where: {
            username: username,
        },
    });
    console.log(user);

    // auth middleware has already verified the user credentials
    return res.status(200).json(user);
});

router.post('/getName', async (req: Request, res: Response) => {

});

router.post('/changeName', async (req: Request, res: Response) => {

});

router.post('/changePassword', async (req: Request, res: Response) => {

});

router.post('/deleteUser', async (req: Request, res: Response) => {

});


export default router;

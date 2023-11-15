import express, { Request, Response } from 'express';
import userAuthMiddleware from '../middleware/user-auth';

const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.use(express.json());

router.post('/signup', async (req: Request, res: Response) => {

    // test in git bash terminal:
    // curl.exe -X POST http://localhost:8000/user/signup -H "Content-Type: application/json" -d '{"username": "benn", "password": "pass", "firstName": "Ben", "lastName": null}'

    console.log("user signup:", req.body);
    const { username, password, firstName, lastName } = req.body;

    /////////////////////////////////////////////////////////////////////////////// should check length of username, password, first & last name  -- maybe do this in client?

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

    // regenerate the session, which is good practice to help guard against forms of session fixation
    req.session.regenerate(function (err) {
        if (err) {
            return res.status(500).json({ error: err });
        }
        // store user information in session
        req.session.username = req.body.username
    });
    
    return res.status(200).json(createdUser);
});

router.post('/login', async (req: Request, res: Response) => {

    // test in git bash terminal:
    // curl.exe -X POST http://localhost:8000/user/login -H "Content-Type: application/json" -d '{"username": "lunaria", "password": "password"}'

    console.log("user login:", req.body);
    const { username, password } = req.body;

    ////////////////////////////////////////////////////////////////////////////////// should check length of username and password -- maybe in client

    const user = await prisma.users.findUnique({
        where: {
            username: username,
        },
    });
    console.log(user);

    // check whether username exists in database
    if (user === null) {
        return res.status(500).json({ error: "User does not exist" });
    }

    // check whether username and password match
    if (password !== user.password) {
        return res.status(500).json({ error: "Wrong password" });
    }

    // regenerate the session, which is good practice to help guard against forms of session fixation
    req.session.regenerate((err) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        // store user information in session
        req.session.username = username;
    });

    const userInfo = await prisma.users.findUnique({
        select: {
            username: true,
            firstName: true,
            lastName: true,
        },
        where: {
            username: username,
        },
    });

    return res.status(200).json(userInfo);
});

router.post('/logout', async (req: Request, res: Response) => {
    
    console.log("user logout");

    // clear the user from the session object
    req.session.username = "";
    // save session; this will ensure that re-using the old session id does not have a logged in user
    req.session.save((err) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        // regenerate the session, which is good practice to help guard against forms of session fixation
        req.session.regenerate(function (err) {
            if (err) {
                return res.status(500).json({ error: err });
            }
        })
    });

    return res.status(200).json({ message: "Successfully logged out" });
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

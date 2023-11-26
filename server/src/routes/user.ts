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

    // check that the username is unique
    const usernameExists = await prisma.users.findUnique({
        where: {
            username: username,
        },
    });
    if (usernameExists) {
        return res.status(500).json({ error: "sorry, this username is already taken :(" });
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

    // signup automatically logs user in
    // regenerate the session, which is good practice to help guard against forms of session fixation
    req.session.regenerate(function (err) {
        if (err) {
            return res.status(500).json({ error: err });
        }
        // store user information in session
        req.session.username = username;
        console.log(req.session.username);

        return res.status(200).json(createdUser);    // this needs to be inside the callback function b/c req.session.regenerate is asynchronous
    });
});

router.post('/login', async (req: Request, res: Response) => {

    // test in git bash terminal:
    // curl.exe -X POST http://localhost:8000/user/login -H "Content-Type: application/json" -d '{"username": "lunaria", "password": "password"}'

    console.log("user login:", req.body);
    const { username, password } = req.body;

    const user = await prisma.users.findUnique({
        where: {
            username: username,
        },
    });
    console.log(user);

    // check whether username exists in database
    if (user === null) {
        return res.status(500).json({ error: "are you sure this is the right username?\n if you don't have a dream diary yet, sign up!" });
    }

    // check whether username and password match
    if (password !== user.password) {
        return res.status(500).json({ error: "wrong password!" });
    }

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

    // regenerate the session, which is good practice to help guard against forms of session fixation
    req.session.regenerate((err) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        // store user information in session
        req.session.username = username;
        console.log(req.session.username);

        return res.status(200).json(userInfo);    // this needs to be inside the callback function b/c req.session.regenerate is asynchronous
    });
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

            return res.status(200).json({ message: "successfully logged out!" });    // this needs to be inside the callback function b/c req.session.regenerate is asynchronous
        });
    });
});

router.post('/getAuthStatus', async (req: Request, res: Response) => {
    
    // check whether user is logged in or not
    if (req.session.username) {
        res.status(200).send(true);
    } else {
        res.status(200).send(false);
    }
});

router.post('/getName', userAuthMiddleware, async (req: Request, res: Response) => {

    // get user's name
    console.log("user get name");
    const username = req.session.username;
    
    const name = await prisma.users.findUnique({
        select: {
            firstName: true,
            lastName: true,
        },
        where: {
            username: username,
        },
    });
    console.log(name);

    return res.status(200).json(name);
});

router.post('/changeName', async (req: Request, res: Response) => {

});

router.post('/changePassword', async (req: Request, res: Response) => {

});

router.post('/deleteUser', async (req: Request, res: Response) => {

});


export default router;

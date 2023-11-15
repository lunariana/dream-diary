import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import dreamRouter from './routes/dream';
import userRouter from  './routes/user';

const app = express();
dotenv.config();    // what does this do????
const port = process.env.PORT || 8000;

// app.use(express.json());  // do we need this here? probably not since there aren't any actual endpoints in this file

// only allow clients in whitelist to access server
const whitelist = ['http://localhost:3000'];
const options: cors.CorsOptions = {
    origin: whitelist
};
app.use(cors(options));

// declaration merging; define additional properties on session object
// resolves typescript error about existence of username property
declare module 'express-session' {
    interface SessionData {
        username: string;
    }
}

// session middleware
app.use(session({
    secret: "thisismysuperdupersecretkeynoonewilleverbeabletoguessthisextremelylongandcomplicatedstringhahaha",
    saveUninitialized: true,
    resave: false,
    cookie: {},
}));

// cookie parser middleware
app.use(cookieParser());

// routers
app.use('/dream', dreamRouter);
app.use('/user', userRouter);

app.listen(port, () => {
   console.log(`Express server listening on port ${ port }`);
});

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import dreamRouter from './routes/dream';
import userRouter from  './routes/user';

const app = express();
dotenv.config();
const port = process.env.PORT || 8000;
// const port = 8000;

// app.use(express.json());  // do we need this here?

const whitelist = ['http://localhost:3000'];
const options: cors.CorsOptions = {
    origin: whitelist
};

app.use(cors(options));

app.use('/dream', dreamRouter);
app.use('/user', userRouter);

app.listen(port, () => {
   console.log(`Express server listening on port ${ port }`);
});

const express = require('express');
const cors = require('cors');
// require('dotenv').config();  // what does this do?

const dreamRouter = require('./routes/dream');

const app = express();
// const port = process.env.PORT;
const port = 8080;

// app.use(express.json());  // do we need this here?

const whitelist = ['http://localhost:3000'];
const corsOptions = {
    origin: (origin, callback) => {
        console.log('[REQUEST-CORS] Request from origin: ', origin);
        if (!origin || whitelist.indexOf(origin) !== -1) callback(null, true)
        else callback(new Error('Not Allowed by CORS'));
    },
    credentials: true,
}

app.use(cors(corsOptions));

app.use('/dream', dreamRouter);

app.listen(port, () => {
   console.log(`Listening to requests at http://localhost:${ port }`);
});

const express = require('express');
// const authMiddleware = require('../middleware/auth');
const userDreamMatchMiddleware = require('../middleware/user-dream-match');

const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.use(express.json());

// // authentication middleware function gets executed before every api function call to router
// router.use(authMiddleware);

router.post('/new', async (req, res) => {

});

router.post('/view', userDreamMatchMiddleware, async (req, res) => {

});

router.post('/edit', userDreamMatchMiddleware, async (req, res) => {

});

router.post('/delete', userDreamMatchMiddleware, async (req, res) => {

});


module.exports = router;
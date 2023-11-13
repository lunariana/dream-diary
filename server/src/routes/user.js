const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.use(express.json());

router.post('/signup', async (req, res) => {
    // check that username is unique
    // add new record to user table in database
});

router.post('/login', authMiddleware, async (req, res) => {
    // 
});


module.exports = router;
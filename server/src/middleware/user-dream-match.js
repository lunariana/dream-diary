const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authMiddleware = (req, res, next) => {

    // check that username and dreamid match
}

module.exports = authMiddleware;

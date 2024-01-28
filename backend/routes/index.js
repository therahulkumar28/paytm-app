const express = require('express');

const userRouter = require('./user');
const router = express.Router();
const accountRouter = require('./account');

// Define routes using router methods like get, post, etc.
router.use("/user", userRouter);
router.use("/account", accountRouter);

// More routes can be added as needed

// Error handling
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

module.exports = router;

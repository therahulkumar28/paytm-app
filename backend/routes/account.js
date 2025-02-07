const mongoose = require('mongoose')
const express = require('express');
const { authMiddleware } = require('../middleware/middleware');
const { Account } = require('../models/Usermodel');

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {

    
    const account = await Account.findOne({
     
        userId: req.userId

    });
    
    res.json({
        balance: account.balance
    })
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const { to, amount } = req.body;
           
        // Validate amount
        if ( !amount || amount <= 0) {
            throw new Error("Invalid amount");
        }

        // Fetch the sender's account within the transaction
        const senderAccount = await Account.findOne({ userId: req.userId }).session(session);

        // Check if the sender's account exists and has sufficient balance
        if (!senderAccount || senderAccount.balance < amount) {
            throw new Error("Insufficient balance");
        }

        // Fetch the recipient's account within the transaction
        const recipientAccount = await Account.findOne({ userId: to }).session(session);

        // Check if the recipient's account exists
        if (!recipientAccount) {
            throw new Error("Invalid recipient account");
        }

        // Perform the transfer
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        // Commit the transaction
        await session.commitTransaction();

        res.json({
            message: "Transfer successful"
        });
    } catch (error) {
        // Handle errors and abort the transaction
        await session.abortTransaction();
        console.error(error);
        res.status(400).json({
            message: error.message || "Transaction failed"
        });
    } finally {
        // End the session
        session.endSession();
    }
});

module.exports = router;
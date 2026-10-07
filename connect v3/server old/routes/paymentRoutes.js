const express = require('express');
const router = express.Router();
const BankAccount = require('../models/BankAccount');
const PaymentHistory = require('../models/PaymentHistory');

router.post('/pay', async (req, res) => {
  const { userId, pin, upiId } = req.body;
  const amount = Number(req.body.amount);

  if (!userId || !pin || !upiId || !amount) {
    console.log("2");
    return res.status(400).json({ success: false, message: 'Missing parameters' });
  }

  try {
    const sender = await BankAccount.findOne({ userId });
    if (!sender || sender.pin !== pin) {
        console.log("2");
      return res.status(401).json({ success: false, message: 'Invalid PIN or sender not found' });
    }

    if (sender.balance < amount) {
      console.log("3");
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    const username = upiId;
    const receiver = await BankAccount.findOne({ upiUsername: username });
    if (!receiver) {
        console.log("Receiver not found");
        return res.status(404).json({ success: false, message: 'Receiver not found' });
      }

      console.log("Sender: ", sender.upiUsername);
      console.log("Receiver: ", receiver.upiUsername);
      
      if (sender.upiUsername === receiver.upiUsername) {
        console.log("Attempt to pay self");
        return res.status(400).json({ success: false, message: 'Cannot pay yourself' });
      }
      

    sender.balance -= amount;
    receiver.balance += amount;

    console.log("Sender's balance: ", sender.balance);
    console.log("Receiver's balance: ", receiver.balance);

    await Promise.all([sender.save(), receiver.save()]);

    await PaymentHistory.create({
      senderId: sender._id,
      receiverId: receiver._id,
      amount
    });

    return res.json({ success: true, message: 'Payment completed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/addBankAccount', async (req, res) => {
    const { userId, upiUsername, pin } = req.body;
  
    if (!userId || !upiUsername || !pin || pin.length !== 6) {
      return res.status(400).json({ message: 'Invalid input. userId, upiUsername, and a 6-digit pin are required.' });
    }
  
    try {
      const existing = await BankAccount.findOne({
        $or: [{ userId }, { upiUsername }],
      });
  
      if (existing) {
        return res.status(409).json({ message: 'Bank account already exists for this user or UPI ID.' });
      }
  
      const newAccount = new BankAccount({
        userId,
        upiUsername,
        pin,
        balance: 1000,
      });
  
      await newAccount.save();
  
      res.status(201).json({ message: 'Bank account created successfully', account: newAccount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
  

module.exports = router;

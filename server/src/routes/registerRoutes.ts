import express from 'express';
import bcrypt from 'bcrypt';
import User from "../models/User";
import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

router.post('/Register', async (req: Request, res: Response, next: NextFunction) => {
  console.log('POST /Register accepted!');
  try {
    const { username, password, egn, phone } = req.body;

    //returns object if exists or null if not
    const existingUser = await User.findOne({
      $or: [{ egn }, { phone }]
    });
    if (existingUser) {
      return res.status(400).json({ errorKey: 'errors.existingEGNPhone' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ errorKey: 'errors.existingUsername' });
    }

    const saltRounds = 13;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userData = req.body;// Takes the data sent from the client (for example from the registration form)
    //{ ...userData, password: hashedPassword }-spread operator- creates new object with the same fields but replaces the password
    const user = new User({ role: "user", ...userData, password: hashedPassword });// Creates a new document (user) with these data, based on the mongoose model User
    await user.save();// Writes the new user to the database (MongoDB)

    console.log('The user is saved successfully.');
    return res.status(201).json({ messageKey: 'success.regSuccess' });
  }
  catch (error) {
    next(error);
  }
});

export default router;
import express, { Request, Response } from 'express';//web server
import mongoose from 'mongoose';//ORM library for database 
import cors from 'cors';//Cross-Origin Resource Sharing -allows or deny http requests from different domains
import bodyParser from 'body-parser';//parses json queries
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { NextFunction } from 'express';
import dotenv from 'dotenv';
import { isDate } from 'util/types';
dotenv.config();//loads environment variables from .env file	

const app = express();//creates server
const PORT = 5000;

// Middleware-function, which stands "between" the incoming HTTP request and the response,
// and processes the request before it reaches the final logic
app.use(cors());
app.use(bodyParser.json());//parse json queries

//Connection with MongoDB
mongoose.connect(process.env.MONGO_URI || '')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,//15 minutes 
  max: 5,//5 attempts per 15 minutes
  message: { errorKey: 'errors.tooManyAttempts' }
});

const userSchema = new mongoose.Schema({
  role: String,
  egn: String,
  passport: String,
  nameCyrillic: String,
  nameLatin: String,
  email: String,
  phone: String,
  address: String,
  username: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

const cardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cardNumber: Number,
  type: String,
  currency: String,
  balance: String,
  liabilities: String,
  minPayment: String,
  repaymentDate: Date,
  ThreeDSecurity: { type: Boolean, default: false }
});
const Card = mongoose.model('Card', cardSchema);

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  accountNumber: String,
  currency: String,
  avaiability: String,
  openingBalance: String,
  currentBalance: String,
  feesDue: String
});
const Account = mongoose.model('Account', accountSchema)

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentType: String,
  remmiterName: String,
  remmiterBankAccount: String,
  beneficiaryName: String,
  beneficiaryBankAccount: String,
  amount: String,
  currency: String
});
const Payment = mongoose.model('Payment', paymentSchema);

//middleware function which is executed before some route
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  //reads the authorization header
  const authHeader = req.headers['authorization'];
  //splits the authorization header into an array[0] - Bearer, [1] - token and takes the token
  const token = authHeader?.split(' ')[1];

  //if no exist a token
  if (!token) {
    return res.status(401).json({ errorKey: 'errors.noToken' });
  }

  try {
    //compares the token's signature with the secret key
    //if the token is valid in decoded will be saved the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    //saves the payload in the req.user so we can use it in the routes
    (req as any).user = decoded;
    //if everything is ok, continue to the next middleware function or route
    next();
  }
  catch (error) {
    return res.status(403).json({ errorKey: 'errors.invalidToken' });
  }
};

//Test route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from backend!');
});

//GET route for dashboard
//verifyToken is a middleware function which is executed before the route- the defense of the route
//req and res are handler functions which are executed after the middleware function
app.get('/Dashboard', verifyToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const accounts = await Account.find({ userId: user.userId }).select('-__v');

    if (accounts.length === 0) {
      return res.status(404).json({ message: 'No accounts for this user.' });
    }

    const cleanedAccounts = accounts.map(account => ({
      id: account._id.toString(),
      type: account.type,
      accountNumber: account.accountNumber,
      currency: account.currency ?? "0",
      avaiability: account.avaiability ?? "0",
      openingBalance: account.openingBalance ?? "0",
      currentBalance: account.currentBalance ?? "0",
      feesDue: account.feesDue
    }));

    // Fetch cards for the authenticated user, excluding __v
    const cards = await Card.find({ userId: user.userId }).select('-__v');

    if (cards.length === 0) {
      return res.status(404).json({ message: 'No cards for this user.' });
    }

    const cleanedCards = cards.map(card => ({
      id: card._id.toString(),
      cardNumber: card.cardNumber,
      type: card.type,
      currency: card.currency,
      balance: card.balance ?? "0",// keep as string
      liabilities: card.liabilities ?? "0",
      minPayment: card.minPayment ?? "0",
      repaymentDate: card.repaymentDate ? card.repaymentDate.toISOString().split('T')[0] : "",                             // keep formatted date string only
      ThreeDSecurity: card.ThreeDSecurity
    }));

    return res.status(200).json({
      message: `Cards for ${user.username}`,
      userId: user.userId,
      accounts: cleanedAccounts,
      cards: cleanedCards
    });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//POST route for user registration
app.post('/Register', async (req: Request, res: Response) => {
  console.log('POST /Register получена!');
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
    console.error(error);
    return res.status(500).json({ errorKey: 'errors.regFail' });
  }
});

app.post('/Dashboard', async (req: Request, res: Response) => {
  try {
    const paymentData = req.body;
    const payment = new Payment(paymentData);
    await payment.save();
    return res.status(201).json({ success: 'New payment!', payment });
  }
  catch (error) {
    console.error('Error saving payment:', error);
    return res.status(500).json({ error: 'Could not save payment' });
  }
  /*try {
    const accountData = req.body;
    const account = new Account(accountData);
    await account.save();
    return res.status(201).json({ success: 'New card!', account });
  }
  catch (error) {
    console.error('Error saving card:', error);
    return res.status(500).json({ error: 'Could not save account' });
  }*/
  /*try {
    const cardData = req.body;
    const card = new Card(cardData);
    await card.save();
    return res.status(201).json({ success: 'New card!', card });
  }
  catch (error) {
    console.error('Error saving card:', error);
    return res.status(500).json({ error: 'Could not save card' });
  }*/
});

//POST route for checking login
app.post('/Login', loginLimiter, async (req: Request, res: Response) => {
  console.log('POST /Login received!');
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ errorKey: 'errors.wrongUsername' });
    }

    /*if (typeof user.password !== 'string') {
      return res.status(500).json({ error: 'Невалидна парола!' });
    }*/
    //user.password have to be string but the compiler doesn't know that and we have to check the type
    //as string means i am sure that the password is a string
    const passwordMatch = await bcrypt.compare(password, user.password as string);

    if (!passwordMatch) {
      return res.status(401).json({ errorKey: 'errors.wrongPassword' });
    }

    //generate JWT token
    const SECRET_KEY = process.env.JWT_SECRET as string;
    //header default
    const token = jwt.sign(
      { userId: user._id, username: username },//payload
      SECRET_KEY,//signature
      { expiresIn: '0.5h' }
    );

    console.log(`Успешен вход за потребител: ${username}`);
    //send token to client
    return res.status(200).json({ messageKey: 'success.login', token });

  } catch (error) {
    console.error('Login mistake:', error);
    return res.status(500).json({ errorKey: 'errors.other' });
  }
});

//Starts the server and listens for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
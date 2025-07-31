import express, { Request, Response } from 'express';//web server
import mongoose from 'mongoose';//ORM library for database 
import cors from 'cors';//Cross-Origin Resource Sharing -allows or deny http requests from different domains
import bodyParser from 'body-parser';//parses json queries
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();//loads environment variables from .env file	

const app = express();//creates server
const PORT = 5000;

// Middleware-function, which stands "between" the incoming HTTP request (request) and the response,
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

//Creating user schema 
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
  const user = (req as any).user;

  return res.status(200).json({
    message: `Hello, ${user.username}`,
    userId: user.userId
  });
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
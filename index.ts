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
// and processes the request before it reaches the final logic- 
app.use(cors());
app.use(bodyParser.json());//parse json queries

//Connection with MongoDB
mongoose.connect(process.env.MONGO_URI || '')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,//15 minutes 
  max: 5,//5 attempts per 15 minutes
  message: { error: "Твърде много опити. Опитайте отново по-късно." }
});

//Creating user schema 
const userSchema = new mongoose.Schema({
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

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Липсва токен за достъп!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    next();
  }
  catch (error) {
    return res.status(403).json({ error: "Невалиден или изтекъл токен!" });
  }
};

//Test route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from backend!');
});

app.get('/Dashboard', verifyToken, async (req: Request, res: Response) => {
  const user = (req as any).user;

  return res.status(200).json({
    message: `Здравей, ${user.username}`,
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
      return res.status(400).json({ error: "Съществува потребител с това ЕГН или с този телефон!" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Това потребителско име е заето!" });
    }

    const saltRounds = 13;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userData = req.body;// Takes the data sent from the client (for example from the registration form)
    //{ ...userData, password: hashedPassword }-spread operator- creates new object with the same fields but replaces the password
    const user = new User({ ...userData, password: hashedPassword });// Creates a new document (user) with these data, based on the mongoose model User
    await user.save();// Writes the new user to the database (MongoDB)
    console.log('Потребителят е запазен успешно');
    return res.status(201).json({ message: 'User registered successfully' });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

//POST route for checking login
app.post('/Login', loginLimiter, async (req: Request, res: Response) => {

  console.log('POST /Login получена!');
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Невалидно потребителско име!' });
    }

    /*if (typeof user.password !== 'string') {
      return res.status(500).json({ error: 'Невалидна парола!' });
    }*/
    //user.password have to be string but the compiler doesn't know that and we have to check the type
    //as string means i am sure that the password is a string
    const passwordMatch = await bcrypt.compare(password, user.password as string);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Грешна парола!' });
    }

    //generate JWT token
    const SECRET_KEY = process.env.JWT_SECRET as string;
    //header default
    const token = jwt.sign(
      { userId: user._id, username: username },//payload
      SECRET_KEY,//gignature
      { expiresIn: '0.004h' }
    );

    console.log(`Успешен вход за потребител: ${username}`);
    //send token to client
    return res.status(200).json({ message: 'Входът е успешен!', token });

  } catch (error) {
    console.error('Login грешка:', error);
    return res.status(500).json({ error: 'Възникна грешка при вход.' });
  }
});

//Starts the server and listens for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
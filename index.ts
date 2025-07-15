import express from 'express';//web server
import mongoose from 'mongoose';//ORM library for database 
import cors from 'cors';//Cross-Origin Resource Sharing -allows or deny http requests from different domains
import bodyParser from 'body-parser';//parses json queries
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

const User = mongoose.model('User', userSchema)

//Test route
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

//POST route for user registration
app.post('/Register', async (req, res) => {
  console.log('POST /Register получена!');
  try {
    const userData = req.body;// Takes the data sent from the client (for example from the registration form)
    const user = new User(userData);// Creates a new document (user) with these data, based on the mongoose model User
    await user.save();// Writes the new user to the database (MongoDB)
    console.log('Потребителят е запазен успешно');
    res.status(201).json({ message: 'User registered successfully' });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

//POST route for checking login
app.post('/Login', async (req, res) => {
  console.log('POST /Login получена!');
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      res.status(401).json({ error: 'Невалидно потребителско име!' });
    }

    if (user?.password !== password) {
      res.status(401).json({ error: 'Грешна парола!' });
    }

    console.log(`Успешен вход за потребител: ${username}`);
    res.status(200).json({ message: 'Входът е успешен!' });

  } catch (error) {
    console.error('Login грешка:', error);
    res.status(500).json({ error: 'Възникна грешка при вход.' });
  }
});

//Starts the server and listens for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
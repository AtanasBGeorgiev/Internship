import express, { Request, Response } from 'express';//web server
import mongoose from 'mongoose';//ORM library for database 
import cors from 'cors';//Cross-Origin Resource Sharing -allows or deny http requests from different domains
import dotenv from 'dotenv';
import liabilityRoutes from './routes/liabilityRoutes';

import loginRoutes from './routes/loginRoutes';
import registerRoutes from './routes/registerRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import accountRoutes from './routes/accountRoutes';
import paymentRoutes from './routes/paymentRoutes';
import cardRoutes from './routes/cardRoutes';
import { errorHandler } from './middleware/errorHandler';
import verifyToken from './middleware/verifyToken';
import sidebarRoutes from './routes/sidebarRoutes';
import currencyRoutes from './routes/currencyRoutes';
import transactionRoutes from './routes/transactionRoutes';
import creditRoutes from './routes/creditRoutes';
import depositRoutes from './routes/depositRoutes';
import preferencesRoutes from './routes/preferencesRoutes';
import businessClientRoutes from './routes/bussinesClientRoutes';
import notificationRoutes from './routes/notificationRoutes';
import adminDashRoutes from './routes/adminDashRoutes';
import tableRoutes from './routes/tableRoutes';

dotenv.config();//loads environment variables from .env file	

const app = express();//creates server
const PORT = 5000;

// Middleware-function, which stands "between" the incoming HTTP request and the response,
// and processes the request before it reaches the final logic
app.use(cors());
app.use(express.json());//parse json queries

//Connection with MongoDB
mongoose.connect(process.env.MONGO_URI || '')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

//api.use redirects all queries(/api/dashboard) to dashboardRoutes
app.use('/register', registerRoutes);

app.use('/login', loginRoutes);

const protectedRoutes = express.Router();

protectedRoutes.use('/dashboard', dashboardRoutes);

protectedRoutes.use('/sidebar', sidebarRoutes);

protectedRoutes.use('/transaction', transactionRoutes);

protectedRoutes.use('/credit', creditRoutes);

protectedRoutes.use('/deposit', depositRoutes);

protectedRoutes.use('/account', accountRoutes);

protectedRoutes.use('/payment', paymentRoutes);

protectedRoutes.use('/card', cardRoutes);

protectedRoutes.use('/currency', currencyRoutes);

protectedRoutes.use('/liability', liabilityRoutes);

protectedRoutes.use('/table', tableRoutes);

protectedRoutes.use('/businessClient', businessClientRoutes);

protectedRoutes.use('/notification', notificationRoutes);

protectedRoutes.use('/preferences', preferencesRoutes);

protectedRoutes.use('/admin', adminDashRoutes);

app.use('/api', verifyToken, protectedRoutes);

//Mandatory after all routes
app.use(errorHandler);

//Starts the server and listens for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
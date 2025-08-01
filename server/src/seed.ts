import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';

import User from './models/User';
import Account from './models/Account';
import Card from './models/Card';
import Payment from './models/Payment';

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
    try {
        await mongoose.connect(MONGO_URI as string);
        console.log('Connected to MongoDB for seeding.')

        //deletes all existing 
        await User.deleteMany({});
        await Account.deleteMany({});
        await Card.deleteMany({});
        await Payment.deleteMany({});

        const saltRounds = 13;
        const hashedPassword = await bcrypt.hash("1234567f", saltRounds);
        const users = [
            new User({
                "role": "user",
                "egn": "0505050505",
                "passport": "",
                "nameCyrillic": "Петър Петров",
                "nameLatin": "Petar Petrov",
                "email": "petar@gmail.com",
                "phone": "0893344556",
                "address": "гр.Пловдив Тракия",
                "username": "petar",
                "password": hashedPassword
            }),
            new User({
                "role": "user",
                "egn": "0101010101",
                "passport": "",
                "nameCyrillic": "Иван Иванов",
                "nameLatin": "Ivan Ivanov",
                "email": "ivan@gmail.com",
                "phone": "0894123456",
                "address": "гр.Пловдив Тракия",
                "username": "ivan",
                "password": hashedPassword
            }),
            new User({
                "role": "user",
                "egn": "9843697394",
                "passport": "",
                "nameCyrillic": "Иван Иванов",
                "nameLatin": "Ivan Ivanov",
                "email": "atanasgeorgiev19b@gmail.com",
                "phone": "0234567890",
                "address": "София",
                "username": "ivan2",
                "password": hashedPassword
            }),
            new User({
                "role": "user",
                "egn": "1212121212",
                "passport": "",
                "nameCyrillic": "Атанас Атанасов",
                "nameLatin": "Atanas Atanasov",
                "email": "atanasgeorgiev2307@gmail.com",
                "phone": "0894436262",
                "address": "гр.Пловдив Тракия",
                "username": "atanas",
                "password": hashedPassword
            })
        ];

        await User.insertMany(users);

        const cards = [
            new Card({
                "userId": "688cabd3ed3c6b3bc577b1d0",
                "cardNumber": "1111222233334444",
                "type": "MasterCard Standard",
                "currency": "BGN",
                "balance": "17500.00",
                "liabilities": "12000.00",
                "minPayment": "2000.00",
                "repaymentDate": "2025-08-05T00:00:00.000+00:00",
                "ThreeDSecurity": true
            }),
            new Card({
                "userId": "688cabd3ed3c6b3bc577b1d0",
                "cardNumber": "2222333344445555",
                "type": "Visa Electron",
                "currency": "EUR",
                "balance": "3000.00",
                "liabilities": "2000.00",
                "minPayment": "200.00",
                "repaymentDate": "2025-08-04T22:00:00.000+00:00",
                "ThreeDSecurity": false
            }),
            new Card({
                "userId": "688cabd3ed3c6b3bc577b1d3",
                "cardNumber": "8888777766665555",
                "type": "MasterCard Standard",
                "currency": "BGN",
                "balance": "13267.58",
                "liabilities": "1000.00",
                "minPayment": "500.00",
                "repaymentDate": "2025-08-05T00:00:00.000+00:00",
                "ThreeDSecurity": false
            }),
            new Card({
                "userId": "688cabd3ed3c6b3bc577b1d0",
                "cardNumber": "333444455556666",
                "type": "MasterCard Standard",
                "currency": "USD",
                "balance": "10.01",
                "liabilities": "20.00",
                "minPayment": "2.50",
                "repaymentDate": "2025-08-05T00:00:00.000+00:00",
                "ThreeDSecurity": false
            }),
        ];

        await Card.insertMany(cards);

        const accounts = [
            new Account({
                "userId": users[0]._id,
                "type": "personal",
                "accountNumber": "915010BGNOVWVT",
                "currency": "BGN",
                "avaiability": "50150000.00",
                "openingBalance": "49620000.00",
                "currentBalance": "50150000.00",
                "feesDue": "2.33"
            }),
            new Account({
                "userId": users[0]._id,
                "type": "unrestricted",
                "accountNumber": "915010BGNOWQDF",
                "currency": "BGN",
                "avaiability": "25000.00",
                "openingBalance": "28000.00",
                "currentBalance": "25000.00",
                "feesDue": "3.5"
            }),
            new Account({
                "userId": users[0]._id,
                "type": "personal",
                "accountNumber": "915010045924AB",
                "currency": "BGN",
                "avaiability": "13420.85",
                "openingBalance": "10000.00",
                "currentBalance": "13420.85",
                "feesDue": "4.4"
            }),
            new Account({
                "userId": users[1]._id,
                "type": "personal",
                "accountNumber": "91501004592444",
                "currency": "USD",
                "avaiability": "0.01",
                "openingBalance": "100.00",
                "currentBalance": "0.01",
                "feesDue": "2.74"
            })
        ];

        await Account.insertMany(accounts);

        const payments = [
            new Payment({
                "userId": users[0]._id,
                "paymentType": "internal",
                "remmiterName": "Петър Петров",
                "remmiterBankAccount": "915010BGNOVWVT",
                "beneficiaryName": "Бортис ООД",
                "beneficiaryBankAccount": "BG19FIN91501015849744",
                "amount": "1500.00",
                "currency": "BGN"
            }),
            new Payment({
                "userId": users[0]._id,
                "paymentType": "credit",
                "remmiterName": "Петър Петров",
                "remmiterBankAccount": "915010BGNOVWVT",
                "beneficiaryName": "Нимбус ООД",
                "beneficiaryBankAccount": "BG23UNCR70001521769897",
                "amount": "500.00",
                "currency": "BGN"
            }),

            new Payment({
                "userId": users[0]._id,
                "paymentType": "own",
                "remmiterName": "Петър Петров",
                "remmiterBankAccount": "915010BGNOVWVT",
                "beneficiaryName": "УИЗ ООД",
                "beneficiaryBankAccount": "BG44FINV91501004592444",
                "amount": "200.00",
                "currency": "USD"
            })
        ];

        await Payment.insertMany(payments);

        console.log('Seed data inserted successfully!');
        await mongoose.disconnect();
    }
    catch (error) {
        console.error('Seeding error:', error);
    }
};

seed();
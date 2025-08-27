# Internship Project

 1.Description  
 The cuurent web app is from the banking sector. It's functionalities include:  
 - Register page  
 - Login page  
   * both pages have data validation
 - Defended Dashboard page using token  
   * Dashboard is role based  
   * Contains fetched data from DB related to the user
     /Accounts
     /Cards
     /Deposits and more
   * The user can change their preferences regarding the displayed data

 2.Technologies
 -	Frontend	Framework:	React.js	(with	TypeScript)
 -	Styling:	Tailwind	CSS	-	Routing:	React	Router	v7
 -	API	Communication:	Axios	-	Build	Tool:	Vite
 -	Backend:	Node.js	with	Express
 -	Database:	MongoDB

3.Folder structure
client/ #Frontent
server/ #Backend
README.md #Project documentation

4.Prerequisites  
- Node.js (version 16 or higher)  
- MongoDB (local installation or MongoDB Atlas)  
- npm or yarn  

4.Setup and run the project   

### 1. Clone the Project

```bash
git clone <repository-url>
cd internship-project
```

### 2. Backend Setup

#### 2.1. Install Dependencies

```bash
cd server
npm install
```

#### 2.2. Create .env File

Create a `.env` file in the `server/` directory with the following content:

```env
MONGO_URI=mongodb://localhost:27017/internship-project
JWT_SECRET=your-super-secret-jwt-key-here
```

**Note**: Replace `your-super-secret-jwt-key-here` with a strong secret key.

#### 2.3. Start MongoDB

Make sure MongoDB is running on your system.

#### 2.4. Run Seed (Populate Database)

```bash
npm run seed
```

This will populate the database with test data.

#### 2.5. Start Backend Server

```bash
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

#### 3.1. Install Dependencies

Open a new terminal and navigate to the client directory:

```bash
cd client
npm install
```

#### 3.2. Start Frontend Application

```bash
npm run dev
```

The frontend application will start on `http://localhost:5173`

## Accessing the Application

After both servers are running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Test Users

After running the seed, you can use the following test accounts:

- **Administrator**: 
  - Username: adminSasho
  - Password: 1234567f

- **Regular User**:
  - Email: petar 
  - Password: 1234567f

## Important Notes

1. **Order is critical**: Always start backend before frontend
2. **MongoDB must be running**: Make sure MongoDB is started before running the backend
3. **Seed must be executed**: Without seed there will be no data in the database
4. **Environment variables**: Without properly configured .env variables, backend won't work

## Development Commands

### Backend Commands:
```bash
cd server
npm run dev      # Start in development mode
npm run build    # Compile TypeScript
npm run start    # Start compiled version
npm run seed     # Populate database
```

### Frontend Commands:
```bash
cd client
npm run dev      # Start in development mode
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Code quality check
```

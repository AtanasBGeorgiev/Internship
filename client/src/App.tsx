import { Routes, Route } from "react-router-dom";
import './App.css';
import { RegisterForm } from './Register';
import { LoginForm, LoginFooter } from './Login';
import { Header } from './Components/Header';
import { Footer } from './Components/Footer';
import { Dashboard} from './Dashboard';

const App: React.FC = () => {
  return (
    <>
      <Routes>
        {/*The login form is displayed first when the app is started. */}
        <Route path="/" element={
          <>
            <Header />
            <LoginForm />
            <LoginFooter />
          </>
        } />
        <Route path="/Login" element={
          <>
            <Header />
            <LoginForm />
            <LoginFooter />
          </>
        } />
        <Route path="/Register" element={
          <>
            <Header />
            <RegisterForm />
          </>
        } />
        <Route path="/Dashboard" element={
          <>
            <Dashboard />
          </>
        } />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
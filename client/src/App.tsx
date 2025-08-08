import { Routes, Route } from "react-router-dom";
import './App.css';
import { RegisterForm } from './Register';
import { LoginForm, LoginFooter } from './Login';
import { Header } from './Components/Header';
import { Footer } from './Components/Footer';
import { Dashboard } from './Dashboard';
import { ErrorProvider, useError } from './context/ErrorContext';
import { registerErrorHandler } from './utils/errorHandler';
import { useEffect } from "react";

const GlobalErrorBanner = () => {
  const { error, setError } = useError();

  if (!error) return null;

  return (
    <div className="bg-red-500 text-white p-3">
      {error}
      <button onClick={() => setError(null)} className="ml-3">X</button>
    </div>
  );
}

const AppRoutes = () => {
  const { setError } = useError();

  useEffect(() => {
    registerErrorHandler(setError);
  }, [setError]);

  return (
    <>
      <GlobalErrorBanner />
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
  )
}

const App: React.FC = () => {
  return (
    <ErrorProvider>
      <AppRoutes />
    </ErrorProvider>
  );
}

export default App;
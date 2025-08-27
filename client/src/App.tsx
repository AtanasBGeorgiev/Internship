import { Routes, Route } from "react-router-dom";
import './App.css';
import { RegisterForm } from './Register';
import { LoginForm, LoginFooter } from './Login';
import { Header } from './Components/Header';
import { Footer } from './Components/Footer';
import { Dashboard } from './Dashboard';
import { ErrorProvider, useError } from './context/ErrorContext';
import { ClientProvider } from './context/ClientContext';
import { PositionProvider } from './context/PositionContext';
import { ScreenHeightProvider } from './context/ScreenHeightContext';
import { getIsAuthErrorActive, registerErrorHandler } from './utils/errorHandler';
import { useEffect } from "react";

const GlobalErrorBanner = () => {
  //access the error and setError functions from the context
  const { error, setError } = useError();

  if (!error) return null;

  return (
    <div className="bg-red-500 text-white p-3 text-center">
      {error}
      <button onClick={() => setError(null)} className="ml-3">X</button>
    </div>
  );
}

//if there is an error,the content of protected page is hidden
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthErrorActive = getIsAuthErrorActive();

  if (isAuthErrorActive) {
    return;
  }

  return children;
};

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
          <ProtectedRoute>
            <ClientProvider>
              <PositionProvider>
                <ScreenHeightProvider>
                  <Dashboard />
                </ScreenHeightProvider>
              </PositionProvider>
            </ClientProvider>
          </ProtectedRoute>
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
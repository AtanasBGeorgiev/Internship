import { Routes, Route } from "react-router-dom";
import { useState } from 'react';
import './App.css';
import { RegisterForm } from './Register';
import { LoginForm, LoginFooter } from './Login';
import { Header, Footer } from './HeaderAndFooter';
import { Dashboard } from './Dashboard';

const App: React.FC = () => {
  return (
    <>
 <Header />
      <Routes>
        {/*The login form is displayed first when the app is started. */}
        <Route path="/" element={
          <>
            <LoginForm />
            <LoginFooter />
          </>
        } />
        <Route path="/Login" element={
          <>
            <LoginForm />
            <LoginFooter />
          </>
        } />
        <Route path="/Register" element={
          <>
            <RegisterForm />
          </>
        } />
        <Route path="/Dashboard" element={
          <Dashboard/>
        } />
      </Routes>
      <Footer />

    </>
  );
}

export default App;
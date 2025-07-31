import { useState } from 'react';
import './App.css';
import { RegisterForm } from './Register';
import { LoginForm } from './Login';
import { LoginFooter } from './Login';
import { Header } from './HeaderAndFooter';
import { Footer } from './HeaderAndFooter';

const App: React.FC = () => {
  return (
    <>
      <Header/>
      <LoginForm/>
      <LoginFooter/>
      <Footer/>
    </>
  );
}

export default App;
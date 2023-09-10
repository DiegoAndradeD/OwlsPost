import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';
import SignupForm from './components/SignupForm';


const App: React.FC = () => {


  return (
    <Router>
      <Navbar/> 
      <Routes>
        <Route path='Signup' element={<SignupForm/>} />
        <Route path='/' element/>
        <Route path='login' element={<LoginForm />}/>
      </Routes>
    </Router>
  )
}

export default App

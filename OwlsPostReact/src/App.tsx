import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Navbar from './components/Navbar';
import SignupForm from './components/SignupForm';

function App() {


  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path='Signup' element={<SignupForm/>} />
        <Route path='/' element/>
      </Routes>
    </Router>
  )
}

export default App

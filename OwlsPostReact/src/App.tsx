import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import SignupForm from './components/SignupForm';

function App() {


  return (
    <Router>
      <Routes>
        <Route path='Signup' element={<SignupForm/>} />
      </Routes>
    </Router>
  )
}

export default App

import React, {useState} from 'react';
import DOMPurify from 'dompurify';
import axios from 'axios';
import PasswordChecklist from 'react-password-checklist'
import '../styles/Signup.css'
import { useNavigate } from 'react-router-dom';

interface SignupFormState {
    username: string;
    email: string;
    password: string;
    passwordAgain: string;
    message: string;
}

const SignupForm: React.FC = () => {
    const [state, setState] = useState<SignupFormState>({
        username: '',
        email: '',
        password: '',
        passwordAgain: '',
        message: '',
    });

    const navigate = useNavigate();

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if(!isPasswordStrong(state.password)) {
            setState({...state, message: 'The password does not match the minimum criteria'});
            return;
        }

        const cleanedUsername = DOMPurify.sanitize(state.username);
        const cleanedEmail = DOMPurify.sanitize(state.email);

        const formData = new FormData();
        formData.append('username', cleanedUsername);
        formData.append('email', cleanedEmail);
        formData.append('password', state.password);
        
        try {
          
            await axios.post('http://localhost:3000/user/Signup', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setState({...state, message: 'User Registered'});
            navigate('/login');  
        } catch (error) {
            setState({...state, message: 'Error ' + error});
        }

    }

    const isPasswordStrong = (password: string) => {
        return password.length >= 5 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password) && password === state.passwordAgain;
      };

    return (
      <div className="container" id='signupContainer'>
      <div className="row justify-content-center">
      <div className="col-md-6" id='wrapperSignup'>
          <form onSubmit={handleFormSubmit}>
          <h2 className='mb-5'>Signup</h2>
          <div className="mb-4">
              <input
              type="text"
              id="username"
              placeholder='User Name'
              value={state.username}
              onChange={(e) => setState({ ...state, username: e.target.value })}
              />
          </div>

          <div className="mb-4">
            <input
              type="email"
              id="email"
              placeholder='Email'
              value={state.email}
              onChange={(e) => setState({...state, email: e.target.value})}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              id="password"
              placeholder='Password'
              className="mb-4"
              value={state.password}
              onChange={(e) => setState({...state, password: e.target.value})}
              required
            />
            <input
              type="password"
              id="passwordAgain"
              placeholder='Password Again'
              value={state.passwordAgain}
              onChange={(e) => setState({...state, passwordAgain: e.target.value})}
              required
            />

            <PasswordChecklist className="mt-4"
              rules={["minLength", "specialChar", "number", "capital", "match"]}
              minLength={5}
              value={state.password}
              valueAgain={state.passwordAgain}
              onChange={(isValid: boolean) => {if (isValid) {
                setState({...state, message: 'Strong Password'});
              } else {
                setState({...state, message: "Weak Password"});
              }}}
            />
          </div>

          <button type="submit" className="btn btn-primary" id='submitBtn'>
              Signup
          </button>
          </form>
          {state.message && <p className="alert alert-info mt-5">{state.message}</p>}
      </div>
      </div>
  </div>

      
    );
  };
 
export default SignupForm
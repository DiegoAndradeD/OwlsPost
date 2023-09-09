import React, {useState} from 'react';
import DOMPurify from 'dompurify';
import axios from 'axios';
import PasswordChecklist from 'react-password-checklist'

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
            await axios.post('#', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setState({...state, message: 'User Registered'})  ;   
        } catch (error) {
            setState({...state, message: 'Error ' + error});
        }

    }

    const isPasswordStrong = (password: string) => {
        return password.length >= 5 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password) && password === state.passwordAgain;
      };

    return (
        <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title">User Registration</h2>
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      User Name
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="form-control"
                      value={state.username}
                      onChange={(e) => setState({...state, username: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      value={state.email}
                      onChange={(e) => setState({...state, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password:
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      value={state.password}
                      onChange={(e) => setState({...state, password: e.target.value})}
                      required
                    />
                    <label htmlFor="password" className="form-label">
                      Password Again:
                    </label>
                    <input
                      type="password"
                      id="passwordAgain"
                      className="form-control"
                      value={state.passwordAgain}
                      onChange={(e) => setState({...state, passwordAgain: e.target.value})}
                      required
                    />
  
                    <PasswordChecklist
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
                  <div className="mb-3">
                    <button type="submit" className="btn btn-primary">
                      Register
                    </button>
                  </div>
                </form>
                {state.message && <p className="alert alert-info">{state.message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
 
export default SignupForm
import DOMPurify from 'dompurify';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Cookies from "universal-cookie";

import '../styles/Login.css'
import { useNavigate } from 'react-router-dom';

interface LoginFormState {
    username: string;
    password: string;
    message: string;
}

const LoginForm: React.FC = () => {
    const [state, setState] = useState<LoginFormState>({
        username: '',
        password: '',
        message: '',
    });

    const navigate = useNavigate();

    const cookies = new Cookies();

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const cleanedUsername = DOMPurify.sanitize(state.username);

        const formData = new FormData();
        formData.append('username', cleanedUsername);
        formData.append('password', state.password);
        
        try {
            console.log(cleanedUsername)
            console.log(state.password);
            const response = await axios.post('http://localhost:3000/auth/login', 
            formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const { access_token: token, username } = response.data;
            const cookieData = {
                access_token: token,
                username: username,
            };
            console.log(response.data);
            
            cookies.set('accessToken', JSON.stringify(cookieData), { path: '/' });
            console.log(cookies)
            setState({ ...state, message: 'User Logged In' });
            navigate('/');
            window.location.reload(); 
        } catch (error) {
            setState({...state, message: "Error " + error});
        }
    };

    return (
        <div className="container" id='loginContainer'>
            <div className="row justify-content-center">
            <div className="col-md-6" id='wrapper'>
                <form onSubmit={handleFormSubmit}>
                <h2 className='mb-5'>Login</h2>
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
                    type="password"
                    id="password"
                    placeholder='Password'
                    value={state.password}
                    onChange={(e) => setState({ ...state, password: e.target.value })}
                    />
                </div>  

                <button type="submit" className="btn btn-primary" id='submitBtn'>
                    Login
                </button>
                </form>
                {state.message && <p className="alert alert-info">{state.message}</p>}
            </div>
            </div>
        </div>
        );
};

export default LoginForm

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import owlIcon from '../assets/owlIcon.png';
import '../styles/Navbar.css';
import Cookies from 'universal-cookie';


interface NavbarState {
    isLoggedIn: boolean;
    username: string;
}

const Navbar: React.FC = ({}) => {
  const navigate = useNavigate();
  const cookieInstance = new Cookies();
  const accessToken = cookieInstance.get('accessToken');

  const [state, setState] = useState<NavbarState>({
    isLoggedIn: false,
    username: '',
  });

  useEffect(() => {
    

    const checkUserCookie = () => {
      if (accessToken) {
        const cookieUsername = accessToken.username;
        const cookieToken = accessToken.access_token;

        if (cookieUsername != null && cookieToken != null) {
          setState({ isLoggedIn: true, username: cookieUsername });
        }
      }
    };

    const isUserRegistered = async () =>  {
      const cookies = new Cookies();
      const accessToken = cookies.get('accessToken');
      if(accessToken) {
        const id = accessToken.id;
        const username = accessToken.username;
        try {
          const response = await axios.post('http://localhost:3000/auth/check_user', { id, username });
          console.log(response.data);
          setState({ isLoggedIn: true, username: accessToken.username });
        } catch (error) {
          console.error(error);
          setState({ isLoggedIn: false, username: '' });
        }
      } 
 
    }

    checkUserCookie(),
    isUserRegistered();
  }, []);
   


  const Logout = async () => {
    try {
      await axios.post("http://localhost:3000/auth/logout");
      

      const cookies = new Cookies();
      cookies.remove('accessToken', { path: '/' });
 
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

    
    
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" id="navbar">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/" id='HeaderTitle'><img id="owlIcon" src={owlIcon} alt="owlIcon" /></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/" id='navText'>Explore</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="addStory" id='navText'>Write</Link>
              </li>
              {state.isLoggedIn ? (
                <li className="nav-link dropdown">
                  <button
                        className="dropdown-toggle"
                        role="button"
                        id="navText"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {state.username}
                      </button>
                  <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/favorites" id="navText">Favorites</Link>
                    </li>
                    <li>
                      <button className="dropdown-item" id="navText" onClick={Logout}>Logout</button>
                    </li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" id='navText'  to="/signup">Signup</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" id='navText' to="/login">Login</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    )
}

export default Navbar;
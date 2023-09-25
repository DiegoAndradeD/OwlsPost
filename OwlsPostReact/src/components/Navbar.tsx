import { faBookOpen, faFilePen, faGear, faHeart, faMoon, faRightFromBracket, faSun, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import owlIcon from '../assets/owlIcon.png';
import '../styles/Navbar.css';
import { useTheme } from './ThemeContext';


interface NavbarState {
  isLoggedIn: boolean;
  username: string;
}

const UserMenu: React.FC<{ username: string; onLogout: () => void }> = ({ username, onLogout }) => {
  return (
    <li className="nav-link dropdown" id='navText'>
      <button
        className="dropdown-toggle"
        role="button"
        id="navText"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {username}
      </button>
      <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end" id="menuDrop">
        <li>
          <Link to={'user_stories'} className="dropdown-item">
            <FontAwesomeIcon id="user_menu_icons" icon={faBookOpen} /> <h3>My Stories</h3>
          </Link>
        </li>
        <li>
          <Link to="/addStory" className="dropdown-item">
          <FontAwesomeIcon id="user_menu_icons" icon={faFilePen} /> <h3>Create Story</h3>
          </Link>
        </li>
        <li>
          <Link to={'getFollowedUsers'} className="dropdown-item">
          <FontAwesomeIcon id="user_menu_icons" icon={faUsers} /> <h3>Following</h3>
          </Link>
        </li>
        <li>
          <Link to={'/getUserFavorites'} className="dropdown-item">
          <FontAwesomeIcon id="user_menu_icons" icon={faHeart} /> <h3>Favorites</h3>
          </Link>
        </li>
        <li>
          <Link to={'/settings'} className="dropdown-item">
          <FontAwesomeIcon id="user_menu_icons" icon={faGear} /> <h3>Settings</h3>
          </Link>
        </li>
        <li>
          <a href="#" className="dropdown-item" onClick={onLogout}>
          <FontAwesomeIcon id="user_menu_icons" icon={faRightFromBracket} /> <h3>LogOut</h3>
          </a>
        </li>
      </ul>
    </li>
  );
};

const Navbar: React.FC = () => {
  const cookieInstance = new Cookies();
  const accessToken = cookieInstance.get('accessToken');

  const [state, setState] = useState<NavbarState>({
    isLoggedIn: false,
    username: '',
  });
  const { darkMode, toggleTheme } = useTheme();

  const navigate = useNavigate();

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

    const isUserRegistered = async () => {
      const accessToken = cookieInstance.get('accessToken');
      if (accessToken) {
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
    };

    checkUserCookie();
    isUserRegistered();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/auth/logout");

      cookieInstance.remove('accessToken', { path: '/' });
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="navbar_mainContainer">
      <nav className="navbar navbar-expand-lg navbar-dark" id="navbar">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/" id='HeaderTitle'><img id="owlIcon" src={owlIcon} alt="owlIcon" /></Link>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
            <button onClick={toggleTheme} id='toggleColorBtn'>
              {darkMode ? (
                <>
                  <FontAwesomeIcon icon={faSun} /> 
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faMoon} /> 
                </>
              )}
            </button>
              <li className="nav-item">
                <Link className="nav-link" to="/" id='navText'>Explore</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={state.isLoggedIn ? "/addStory" : "login"} id='navText'>{state.isLoggedIn ? "Write" : "Write"}</Link>
              </li>
              {state.isLoggedIn ? (
                <UserMenu username={state.username} onLogout={handleLogout} />
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" id='navText' to="/signup">Signup</Link>
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
    </div>
  );
};

export default Navbar;

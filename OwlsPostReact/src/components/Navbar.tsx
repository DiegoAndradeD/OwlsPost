
import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import owlIcon from '../assets/owlIcon.png'
import '../styles/Navbar.css'

interface NavbarState {
    isLoggedIn: boolean;
    userName: string;
    typeUser: string[]
}

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const [state, setState] = useState<NavbarState>({
        isLoggedIn: false,
        userName: '',
        typeUser: []

    });

    const Logout = async () => {
        try {
            await axios.post("#", { withCredentials: true });
            navigate("/")
            window.location.reload(); 
        } catch(error) {
            console.error(error);
        }
    }
    
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/" id='HeaderTitle'><img id="owlIcon" src={owlIcon} alt="owlIcon" /></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/" id='HeaderText'>Explore</Link>
              </li>
              {state.isLoggedIn ? (
                <li className="nav-link dropdown">
                  <button
                        className="dropdown-toggle"
                        ref="#"
                        role="button"
                        id="userMenu"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {state.userName}
                      </button>
                  <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/favorites">Favorites</Link>
                    </li>
                    {state.typeUser.includes("ROLE_ADMIN") && (
                      <li>
                        <Link className="dropdown-item" to="/add-game">AddGame</Link>
                      </li>
                    )}
                    <li>
                      <button className="dropdown-item" onClick={Logout}>Logout</button>
                    </li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" id='HeaderText'  to="/signup">Signup</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" id='HeaderText' to="/login">Login</Link>
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
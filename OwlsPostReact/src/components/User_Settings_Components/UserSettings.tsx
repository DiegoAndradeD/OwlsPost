import React, { useState } from 'react';
import '../../styles/UserSettings_Styles/Settings_Styles/Settings.css';
import UserAccount_Settings from './Settings_Components/UserAccount_Settings';
import UserProfile_Settings from './Settings_Components/UserProfile_Settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faUser } from '@fortawesome/free-solid-svg-icons';

const UserSettings: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const handleClick = (componentName: string) => {
    setSelectedComponent(componentName);
  };

  return (
    <div className='UserSettingsMainContainer'>
    <nav className="navbar navbar-expand-lg navbar-light" id='settings_navbar'>
      <div className='container' id='settings_navbar_container'>
        <a className="navbar-brand" id='navbar_header_title' href="#">Settings: </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className={`nav-item ${selectedComponent === 'UserAccount_Settings' ? 'active' : ''}`} id='Settings_acountText'>
              <a className="nav-link" href="#" onClick={() => handleClick('UserAccount_Settings')}>
                <FontAwesomeIcon className='sidebar_icon' icon={faUser}/> Account
              </a>
            </li>
            <li className={`nav-item ${selectedComponent === 'UserProfile_Settings' ? 'active' : ''}`} id='Settings_profileText'>
              <a className="nav-link" href="#" onClick={() => handleClick('UserProfile_Settings')}>
                <FontAwesomeIcon className='sidebar_icon' icon={faAddressCard} /> Profile
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
        <div className="col-9 content">
          {selectedComponent === 'UserAccount_Settings' && <UserAccount_Settings />}
          {selectedComponent === 'UserProfile_Settings' && <UserProfile_Settings />}
        </div>
    </div>
  );
};

export default UserSettings;

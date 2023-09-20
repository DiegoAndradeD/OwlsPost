import React, { useState } from 'react';
import '../../styles/Settings_Styles/Settings.css';
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
    <div className='UserSettings_mainContainer'>
        <div className="col-3 sidebar">
          <button
            className={`btn btn-sidebar ${selectedComponent === 'UserAccount_Settings' ? 'active' : ''}`}
            onClick={() => handleClick('UserAccount_Settings')}
          >
            <FontAwesomeIcon icon={faAddressCard} /> User Account
          </button>
          <button
            className={`btn btn-sidebar ${selectedComponent === 'UserProfile_Settings' ? 'active' : ''}`}
            onClick={() => handleClick('UserProfile_Settings')}
          >
            <FontAwesomeIcon icon={faUser} /> User Profile
          </button>
        </div>
        <div className="col-9 content">
          {selectedComponent === 'UserAccount_Settings' && <UserAccount_Settings />}
          {selectedComponent === 'UserProfile_Settings' && <UserProfile_Settings />}
        </div>
    </div>
  );
};

export default UserSettings;

import React, { useState } from 'react';
import '../../styles/Settings_Styles/Settings.css';
import UserProfile_Settings from './Settings_Components/UserProfile_Settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';

const UserSettings: React.FC = () => {

  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const handleClick = (componentName: string) => {

    setSelectedComponent(componentName);
  };

  return (
    <div className="settings-container">

      <div className="sidebar">
        <h1 className='sidebar_Title'>Settings</h1>
        <div className='sidebar_options'>

          <i className='sidebar_item'>
            <button onClick={() => handleClick('UserProfile_Settings')}>
              <FontAwesomeIcon className='sidebar_icon' icon={faAddressCard}/>Acount
            </button>
          </i>

          <i className='sidebar_item'>
            <button className='sidebar_btn' onClick={() => handleClick('Placeholder')}>
              <FontAwesomeIcon className='sidebar_icon' icon={faAddressCard} /> Placeholder
            </button>
          </i>

          <i className='sidebar_item'>
            
            <button className='sidebar_btn' onClick={() => handleClick('Placeholder')}>
              <FontAwesomeIcon className='sidebar_icon' icon={faAddressCard} /> Placeholder
            </button>
          </i>

          <i className='sidebar_item'>
            
            <button className='sidebar_btn' onClick={() => handleClick('Placeholder')}>
              <FontAwesomeIcon className='sidebar_icon' icon={faAddressCard} /> Placeholder
            </button>
          </i>

          <i className='sidebar_item'>
            
            <button className='sidebar_btn' onClick={() => handleClick('Placeholder')}>
              <FontAwesomeIcon className='sidebar_icon' icon={faAddressCard} /> Placeholder
            </button>
          </i>

          <i className='sidebar_item'>
            
            <button className='sidebar_btn' onClick={() => handleClick('Placeholder')}>
              <FontAwesomeIcon className='sidebar_icon' icon={faAddressCard} /> Placeholder
            </button>
          </i>
        </div>
      </div>

      <div className="main-content">
        {selectedComponent === 'UserProfile_Settings' && <UserProfile_Settings />}
      </div>
    </div>
  );
};

export default UserSettings;

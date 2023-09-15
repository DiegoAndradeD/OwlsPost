import React, { useState } from 'react';
import '../../styles/Settings_Styles/Settings.css';
import UserProfile_Settings from './Settings_Components/UserProfile_Settings';

const UserSettings: React.FC = () => {

  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const handleClick = (componentName: string) => {

    setSelectedComponent(componentName);
  };

  return (
    <div className="settings-container">

      <div className="sidebar">
        <button onClick={() => handleClick('UserProfile_Settings')}>Profile</button>

      </div>

      {/* Conteúdo principal */}
      <div className="main-content">

        {selectedComponent === 'UserProfile_Settings' && <UserProfile_Settings />}

      </div>
    </div>
  );
};

export default UserSettings;

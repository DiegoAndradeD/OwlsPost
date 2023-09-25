import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PasswordChecklist from 'react-password-checklist';
import '../../../styles/UserSettings_Styles/UserAccount_Settings.css';
import Cookies from "universal-cookie";

// Define TypeScript interfaces for the component's state. Getting the logged user data.
interface UserProfileStates {
  profile_user_id: number;
  username: string;
  email: string;
  created_at: Date;
  followers_count: number;
}

//Interface for the updated data of the user
interface UpdateUserState {
  updatedUsername: string;
  updatedEmail: string;
  updatedPassword: string;
  updatedPasswordAgain: string;
  fieldToEdit: string | null;
}

//Main Component
const UserAccount_Settings: React.FC = () => {
  const { userid } = useParams<{ userid: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  //States to handle the visibility of each form
  const [isUsernameFormVisible, setUsernameFormVisible] = useState(false);
  const [isEmailFormVisible, setEmailFormVisible] = useState(false);
  const [isPasswordFormVisible, setPasswordFormVisible] = useState(false);

  //States for logged user data
  const [user, setUser] = useState<UserProfileStates>({
    profile_user_id: 0,
    username: "",
    email: "",
    created_at: new Date(),
    followers_count: 0,
  });
  
  //States for the updated information
  const [updateUser, setUpdateUser] = useState<UpdateUserState>({
    updatedUsername: '',
    updatedEmail: '',
    updatedPassword: '',
    updatedPasswordAgain: '',
    fieldToEdit: null,
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);

  //Getting the user token from cookies
  const cookies = new Cookies();
  const accessToken = cookies.get('accessToken');

  //Get the logged user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user/getUserById/${accessToken.id}`,
          {
            headers: {
              'Content-Type': 'application/json'
            },
          }
        );
        setUser({
          profile_user_id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          created_at: response.data.created_at,
          followers_count: response.data.followers_count,
        });
      } catch (error) {
        setError('Error fetching user data');
      }
    };

    fetchUserData();
  }, [userid, user.profile_user_id]);


  const isPasswordStrong = (password: string) => {
    const isValid =
      password.length >= 5 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password) &&
      password === updateUser.updatedPasswordAgain;

    if (!isValid) {
      setPasswordError('Password does not match minimal criteria');
    } else {
      setPasswordError(null); 
    }

    return isValid;
  };

  //Function to logout after an update
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/auth/logout");

      cookies.remove('accessToken', { path: '/' });
      navigate('/');
      window.location.reload();
    } catch (error) {
      setError('Error logging out');

    }
  };

  //Function responsible to handle the request to the API
  const sendRequest = async (url: string, data: object, successCallback: (responseData: any) => void) => {
    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        successCallback(response.data);
      }
    } catch (error) {
      setError('Error sedding request to: ' + url);

    }
  };
  
  //Function to update the user's username
  const handleUsernameUpdate = async () => {
    const url = `http://localhost:3000/auth/change-username`;
    const data = {
      userid: user.profile_user_id,
      newUsername: updateUser.updatedUsername,
    };
  
    sendRequest(url, data, (responseData) => {
      setUser({ ...user, username: updateUser.updatedUsername });
      alert('Username Updated Successfully');
      handleLogout();
    });
  };

  //Function to update the user's email
  const handleEmailUpdate = async () => {
    const url = `http://localhost:3000/auth/change-email`;
    const data = {
      userid: user.profile_user_id,
      newEmail: updateUser.updatedEmail,
    };
  
    sendRequest(url, data, (responseData) => {
      setUser({ ...user, email: updateUser.updatedEmail });
      alert('Email Updated Successfully');
      handleLogout();
    });
  };

  const handlePasswordUpdate = async () => {
    const url = `http://localhost:3000/auth/change-password`;
    const data = {
      userid: user.profile_user_id,
      newPassword: updateUser.updatedPassword,
    };
  
    sendRequest(url, data, (responseData) => {
      setUser({ ...user, email: updateUser.updatedPassword });
      alert('Password Updated Successfully');
      handleLogout();
    });
  };
  

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUsernameFormVisible) {
      handleUsernameUpdate();
    } else if (isEmailFormVisible) {
      handleEmailUpdate();
    } else if (isPasswordFormVisible) {
      handlePasswordUpdate();
    }
  };


  const handleUsernameFormToogle = () => {
    setUsernameFormVisible(!isUsernameFormVisible);
    setEmailFormVisible(false);
    setPasswordFormVisible(false);

  }

  const handleEmailFormToogle = () => {
    setEmailFormVisible(!isEmailFormVisible);
    setUsernameFormVisible(false);
    setPasswordFormVisible(false);
  }

  const handlePasswordFormToogle = () => {
    setPasswordFormVisible(!isEmailFormVisible);
    setUsernameFormVisible(false);
    setEmailFormVisible(false);
  }

  const renderUsernameForm = () => {
    return (
      <div>
        <h1 id="update_username_title">Update Username</h1>
        <p>You will need to login again after changing your username</p>
        <button id="update_username_btn" onClick={handleUsernameFormToogle}>
          Change Username
        </button>
  
        {isUsernameFormVisible && (
          <form className="form-inline" id="update_form_container">
            <div className="form-group " >
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                className='form-control'
                type='text'
                id="username"
                placeholder="Username"
                value={updateUser.updatedUsername}
                onChange={(e) => setUpdateUser({ ...updateUser, updatedUsername: e.target.value })}                
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mb-2" id="update_username_btn_submit" onClick={handleUpdateSubmit}>Update</button>
          </form>
        )}
      </div>
    );
  };

  const renderEmailForm = () => {
    return (
      <div>
        <h1 id="update_email_title">Update Email</h1>
        <p>You will need to login again after changing your email</p>
        <button id="update_email_btn" onClick={handleEmailFormToogle}>
          Change Email
        </button>
  
        {isEmailFormVisible && (
          <form className="form-inline" id="update_form_container">
            <div className="form-group " >
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                className='form-control'
                type='text'
                id="email"
                placeholder="Email"
                value={updateUser.updatedEmail}
                onChange={(e) => setUpdateUser({ ...updateUser, updatedEmail: e.target.value })}                
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mb-2" id="update_username_btn_submit" onClick={handleUpdateSubmit}>Update</button>
          </form>
        )}
      </div>
    );
  };

  const renderPasswordForm = () => {
    return (
      <div>
        <h1 id="update_password_title">Update Password</h1>
        <p>You will need to login again after changing your email</p>
        <button id="update_password_btn" onClick={handlePasswordFormToogle}>
          Change Password
        </button>
  
        {isPasswordFormVisible && (
          <form className="form-inline" id="update_form_container">
            <div className="form-group " >
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                className='form-control'
                type='text'
                id="password"
                placeholder="Password"
                value={updateUser.updatedPassword}
                onChange={(e) => setUpdateUser({ ...updateUser, updatedPassword: e.target.value })}                
                required
              />
              <PasswordChecklist
              className="mt-4"
              rules={['minLength', 'specialChar', 'number', 'capital']}
              minLength={5}
              value={updateUser.updatedPassword}
              valueAgain={updateUser.updatedPasswordAgain}
            />
            </div>
            <button type="submit" className="btn btn-primary mb-2" id="update_username_btn_submit" onClick={handleUpdateSubmit}>Update</button>
          </form>
        )}
      </div>
    );
  };


  return (
    <div className="acount_settings_container">
      <div className="acount_settings_wrapper">
      {renderUsernameForm()}
      {renderEmailForm()}
      {renderPasswordForm()}
      </div>
    </div>
  );
};


export default UserAccount_Settings;

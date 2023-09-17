import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PasswordChecklist from 'react-password-checklist';
import '../../../styles/UserSettings_Styles/UserProfile_Settings.css';
import Cookies from "universal-cookie";

interface UserProfileStates {
  profile_user_id: number;
  username: string;
  email: string;
  created_at: Date;
  followers_count: number;
}

interface UpdateUserState {
  updatedUsername: string;
  updatedEmail: string;
  updatedPassword: string;
  updatedPasswordAgain: string;
  fieldToEdit: string | null;
}


const UserProfile_Settings: React.FC = () => {
  const { userid } = useParams<{ userid: string }>();
  const navigate = useNavigate();

  const [isUsernameFormVisible, setUsernameFormVisible] = useState(false);
  const [isEmailFormVisible, setEmailFormVisible] = useState(false);

  const [user, setUser] = useState<UserProfileStates>({
    profile_user_id: 0,
    username: "",
    email: "",
    created_at: new Date(),
    followers_count: 0,
  });

  const [updateUser, setUpdateUser] = useState<UpdateUserState>({
    updatedUsername: '',
    updatedEmail: '',
    updatedPassword: '',
    updatedPasswordAgain: '',
    fieldToEdit: null,
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);

  const cookies = new Cookies();
  const accessToken = cookies.get('accessToken');

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
        console.log(error);
      }
    };

    fetchUserData();
  }, [userid, user.profile_user_id]);

  const formattedDate = new Date(user.created_at)
    .toLocaleString()
    .replace(',', ' |');

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

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/auth/logout");

      cookies.remove('accessToken', { path: '/' });
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('here')
      console.log(user.profile_user_id)
      const response = await axios.post(
        `http://localhost:3000/auth/change-username`,
        {
          userid: user.profile_user_id,
          newUsername: updateUser.updatedUsername, 
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken.access_token}`, 
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data)

      if (response.status === 200) {
        setUser({ ...user, username: updateUser.updatedUsername });
        handleLogout();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const FormField: React.FC<{
    id: string;
    placeholder: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
  }> = ({ id, placeholder, label, value, onChange, type = 'text', required = false }) => {
    return (
      <div className="form-group " >
        <form className="form-inline" id="update_form_container">
          <div className="form-group " >
            <label htmlFor={id} className="sr-only">{label}</label>
            <input
              className='form-control'
              type={type}
              id={id}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              required={required}
            />
          </div>
          <button type="submit" className="btn btn-primary mb-2" id="update_username_btn_submit" onClick={handleUpdateSubmit}>Update</button>
        </form>
      </div>
    );
  };

  const handleUsernameFormToogle = () => {
    setUsernameFormVisible(!isUsernameFormVisible);
    setEmailFormVisible(false);
  }

  const handleEmailFormToogle = () => {
    setEmailFormVisible(!isEmailFormVisible);
    setUsernameFormVisible(false);
  }


  return (
    <div className="acount_settings_container">
      <div className="acount_settings_wrapper">
        <div id="update_username_container">
          <h1 id="update_username_title">Update Username</h1>
          <p>You will need to login again after changing your username</p>
          <button
            id="update_username_btn"
            onClick={handleUsernameFormToogle}
          >
            Change Username
          </button>
          {isUsernameFormVisible && (
            <FormField
              id="username"
              placeholder="Username"
              label="Username"
              value={updateUser.updatedUsername}
              onChange={(value) =>
                setUpdateUser({ ...updateUser, updatedUsername: value })
              }
            />
          )}
        </div>
        <div id="update_email_container">
          <h1 id="update_email_title">Update Email</h1>
          <p>You will need to login again after changing your email</p>
          <button
            id="update_email_btn"
            onClick={handleEmailFormToogle}
          >
            Change Email
          </button>
          {isEmailFormVisible && (
            <FormField
              id="email"
              placeholder="Email"
              label="Email"
              value={updateUser.updatedEmail}
              onChange={(value) =>
                setUpdateUser({ ...updateUser, updatedEmail: value })
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};


export default UserProfile_Settings;

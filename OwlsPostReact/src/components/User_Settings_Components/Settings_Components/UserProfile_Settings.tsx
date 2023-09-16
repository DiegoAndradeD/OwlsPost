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

const InputField: React.FC<{
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}> = ({ id, placeholder, value, onChange, type = 'text', required = false }) => {
  return (
    <div className="mb-4">
      <input
        className='profile-input'
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
};

const UserProfile_Settings: React.FC = () => {
  const { userid } = useParams<{ userid: string }>();
  const navigate = useNavigate();

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

  const handleEditClick = (field: string) => {
    setUpdateUser({ ...updateUser, fieldToEdit: field });
  };

  const handleCancelEdit = () => {
    setUpdateUser({ ...updateUser, fieldToEdit: null });
  };

  return (
    <div>
      <div className="container">
        <div className="profile_wrapper">
          <div className="profile_usernameContainer mb-4">
            <h1 className="profile_h1_text">{user.username}</h1>
          </div>
          <div className="profile_created_atContainer">
            <h1 className="profile_h1_text">Member Since: {formattedDate}</h1>
          </div>
          <div className="profile_followersCount_container">
            <h1 className="profile_h1_text">Followers: {user.followers_count}</h1>
          </div>
          <div className="profile_created_atContainer">
            <h1 className="profile_h1_text">Email: {user.email}</h1>
          </div>

          <div className="container p-0" id="updateForm_Container">
            {updateUser.fieldToEdit ? (
              <form onSubmit={handleUpdateSubmit} className="profile-form-container">
                {updateUser.fieldToEdit === 'username' && (
                  <InputField
                    id="username"
                    placeholder="Username"
                    value={updateUser.updatedUsername}
                    onChange={(value) => setUpdateUser({ ...updateUser, updatedUsername: value })}
                  />
                )}
                {updateUser.fieldToEdit === 'email' && (
                  <InputField
                    id="email"
                    placeholder="Email"
                    value={updateUser.updatedEmail}
                    onChange={(value) => setUpdateUser({ ...updateUser, updatedEmail: value })}
                    type="email"
                    required
                  />
                )}
                {updateUser.fieldToEdit === 'password' && (
                  <>
                    <InputField
                      id="password"
                      placeholder="Password"
                      value={updateUser.updatedPassword}
                      onChange={(value) => setUpdateUser({ ...updateUser, updatedPassword: value })}
                      type="password"
                      required
                    />
                    <InputField
                      id="passwordAgain"
                      placeholder="Password Again"
                      value={updateUser.updatedPasswordAgain}
                      onChange={(value) => setUpdateUser({ ...updateUser, updatedPasswordAgain: value })}
                      type="password"
                      required
                    />
                    <PasswordChecklist
                      className="mt-4"
                      rules={['minLength', 'specialChar', 'number', 'capital', 'match']}
                      minLength={5}
                      value={updateUser.updatedPassword}
                      valueAgain={updateUser.updatedPassword}
                      onChange={(isValid: boolean) => {
                        if (isValid) {
                          setPasswordError('Strong Password');
                        } else {
                          setPasswordError('Weak Password');
                        }
                      }}
                    />
                    {passwordError && <p className="alert alert-info mt-2">{passwordError}</p>}
                  </>
                )}
                <div className="button-container">
                  <button type="submit" className="profile-submit-button">
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary profile-cancel-button"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-data-container">
                <div className="button-container" >
                  <button
                    className="updateBtn"
                    onClick={() => handleEditClick('username')}
                  >
                    Edit Username
                  </button>
                  <button
                    className="updateBtn"
                    onClick={() => handleEditClick('email')}
                  >
                    Edit Email
                  </button>
                  <button
                    className="updateBtn"
                    onClick={() => handleEditClick('password')}
                  >
                    Edit Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile_Settings;

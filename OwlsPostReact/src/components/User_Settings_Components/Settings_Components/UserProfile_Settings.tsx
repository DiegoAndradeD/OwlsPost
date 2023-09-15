import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../../../styles/User_Styles/UserProfile.css';
import Cookies from "universal-cookie";

interface UserProfileStates {
  profile_user_id: number;
  username: string;
  email: string;
  created_at: Date;
  followers_count: number;
}

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
        </div>
      </div>
    </div>
  );
};

export default UserProfile_Settings;

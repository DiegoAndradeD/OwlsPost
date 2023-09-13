import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../styles/UserProfile.css';
import Cookies from "universal-cookie";

interface UserProfileStates {
  id: number;
  username: string;
  email: string;
  created_at: Date;
  followers_count: number;
}

interface Story {
  id: number;
  title: string;
  description: string;
  userid: number;
}

interface UserStoriesStates {
  userAuthorId: number;
  stories: Story[];
  invertedColors: boolean;
}

const UserProfile: React.FC = () => {
  const { userid } = useParams<{ userid: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfileStates>({
    id: 0,
    username: "",
    email: "",
    created_at: new Date(),
    followers_count: 0,
  });

  const [state, setState] = useState<UserStoriesStates>({
    userAuthorId: 0,
    stories: [],
    invertedColors: false,
  });

  const cookies = new Cookies();
  const accessToken = cookies.get('accessToken');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user/getUserById/${userid}`,
          {
            headers: {
              'Content-Type': 'application/json'
            },
          }
        );
        setUser({
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          created_at: response.data.created_at,
          followers_count: response.data.followers_count,
        });
        
        const fetchUserStories = async () => {
          try {
            const storyResponse = await axios.get(
              `http://localhost:3000/story/get_user_stories/${response.data.id}`,
              {
                headers: { 'Content-Type': 'application/json' },
              }
            );
            setState(prevState => ({
              ...prevState,
              userAuthorId: response.data.id,
              stories: storyResponse.data,
            }));
          } catch (error) {
            console.log(error);
          }
        };
        fetchUserStories();
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, [userid]);

  const handleFollowSubmit = async () => {
    if(accessToken) {
      try {
        const response = await axios.post(`http://localhost:3000/follower/user/${user.id}/followUser/${accessToken.id}`, 
        {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate('login');
    }
    
  }


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
            <button className="profile_follow_btn" onClick={handleFollowSubmit}>Follow</button>
          </div>
          <h2 className="profile_h2_text">User Stories: </h2>
          <div>
            <ul>
              {state.stories.map((story) => (
                <li className="profile_storiesContainer" key={story.id}>
                  <h2 className="profile_h2_text_title">{story.title}</h2>
                  <p>{story.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

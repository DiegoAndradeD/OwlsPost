import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../styles/UserProfile.css';

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
  userId: number;
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
    userId: 0,
    stories: [],
    invertedColors: false,
  });

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
            setState({
              ...state,
              userId: response.data.id,
              stories: storyResponse.data,
            });
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
  }, [userid, state]);

  const formattedDate = new Date(user.created_at)
    .toLocaleString()
    .replace(',', ' |');

  return (
    <div>
      <div className="container">
        <div className="profile_wrapper">
          <div className="profile_usernameContainer">
            <h1 className="profile_h1_text">{user.username}</h1>
          </div>
          <div className="profile_created_atContainer">
            <h1 className="profile_h1_text">Member Since: {formattedDate}</h1>
          </div>
          <h2 className="profile_h2_text">User Stories: </h2>
          <div>
            <ul>
              {state.stories.map((story) => (
                <li className="profile_storiesContainer" key={story.id}>
                    {/* Make the Story Title a link to the story */}
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

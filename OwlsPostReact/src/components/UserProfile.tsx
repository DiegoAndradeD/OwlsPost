import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../styles/UserProfile.css';
import Cookies from "universal-cookie";

interface UserProfileStates {
  profile_user_id: number;
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
  profile_user_id: number;
  stories: Story[];
  invertedColors: boolean;
  isFollowed: number,
}

const UserProfile: React.FC = () => {

  const { userid } = useParams<{ userid: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfileStates>({
    profile_user_id: 0,
    username: "",
    email: "",
    created_at: new Date(),
    followers_count: 0,
  });

  const [state, setState] = useState<UserStoriesStates>({
    profile_user_id: 0,
    stories: [],
    invertedColors: false,
    isFollowed: 0
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
          profile_user_id: response.data.id,
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
              profile_user_id: response.data.id,
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

    const getIsUserFollowing = async () => {
      if (user.profile_user_id && accessToken) {
      try {
        const response = await axios.get(`http://localhost:3000/follower/isUserFollowing/userid/${accessToken.id}/to_follow_userid/${user.profile_user_id}`, 
        {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log(response.data)
        setState({...state, isFollowed: response.data})
      } catch (error) {
        console.log(error);
      }
    };
  };
    getIsUserFollowing();
    fetchUserData();
  }, [userid, user.profile_user_id]);
  
  

      

  const handleFollowSubmit = async () => {
    if (accessToken) {
      console.log(accessToken.id) 
      console.log(user.profile_user_id) 
      try {
        const response = await axios.post(
          `http://localhost:3000/follower/userid/${accessToken.id}/to_follow_userid/${user.profile_user_id}`,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        console.log(response);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate('login');
    }
  };

  const handleUnfollowSubmit = async () => {
    if (accessToken) {
      console.log(accessToken.id) 
      console.log(user.profile_user_id) 
      try {
        const response = await axios.delete(
          `http://localhost:3000/follower/userid/${accessToken.id}/to_unfollow_userid/${user.profile_user_id}`,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        console.log(response);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate('login');
    }
  };


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
            <button className="profile_follow_btn" onClick={state.isFollowed === 0 ? handleFollowSubmit : handleUnfollowSubmit}>
              {state.isFollowed === 0 ? 'Follow' : 'Unfollow'}
            </button>

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

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../../styles/User_Styles/UserProfile.css';
import Cookies from "universal-cookie";
import { useTheme } from '../ThemeContext'; 

//Todo - block user to follow himself

interface UserProfileStates {
  profile_user_id: number;
  username: string;
  email: string;
  created_at: Date;
  followers_count: number;
  description: string;
}

interface Story {
  id: number;
  title: string;
  description: string;
  userid: number;
  tags: string[];
}

interface UserStoriesStates {
  profile_user_id: number;
  stories: Story[];
  invertedColors: boolean;
  isFollowed: number,
}

const UserProfile: React.FC = () => {
  const { darkMode } = useTheme();

  const { userid } = useParams<{ userid: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfileStates>({
    profile_user_id: 0,
    username: "",
    email: "",
    created_at: new Date(),
    followers_count: 0,
    description: '',
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
        console.log(response.data)
        setUser({
          profile_user_id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          created_at: response.data.created_at,
          followers_count: response.data.followers_count,
          description: response.data.description,
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

    const UserProfile_mainContainerClass = darkMode ? 'dark-mode' : '';

  return (
    <div className={`UserProfile_mainDiv ${UserProfile_mainContainerClass}`}>
      <div className="">
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
          <div className="userSettings_profile_settings_description_container">
                <h1 className="userSettings_profile_h1_text">
                  Description:{" "}
                  <div
                    id="userDescription"
                    className="user-description-rich-text"
                    dangerouslySetInnerHTML={{ __html: user.description }}
                  />
                </h1>
              </div>
          <h2 className="profile_h2_text">User Stories: </h2>
          <div>
            <ul>
              {state.stories.map((story) => (
                <li className="profile_storiesContainer" key={story.id}>
                  <Link to={`/story/${story.id}/author/${story.userid}`} id='UserProfile_storyLink'>
                    <h2 className="profile_h2_text_title">{story.title}</h2>
                  </Link>
                  <p id="profile_h2_text_description">{story.description}</p>
                  <p id="profile_h2_text_tags">Tags: {story.tags ? story.tags.join(', ') : ''} </p>
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../../styles/UserSettings_Styles/UserProfile_Settings.css';

interface UserStates {
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
  isFollowed: number;
}

const UserProfile_Settings: React.FC = () => {
  const cookies = new Cookies();
  const accessToken = cookies.get('accessToken');

  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState('');
  const [originalDescription, setOriginalDescription] = useState('');

  const [textareaHeight, setTextareaHeight] = useState('auto'); // Estado para controlar a altura da textarea

  const [user, setUser] = useState<UserStates>({
    profile_user_id: 0,
    username: '',
    email: '',
    created_at: new Date(),
    followers_count: 0,
    description: '',
  });

  const [story, setStory] = useState<UserStoriesStates>({
    profile_user_id: 0,
    stories: [],
    invertedColors: false,
    isFollowed: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user/getUserById/${accessToken.id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
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
                headers: { "Content-Type": "application/json" },
              }
            );
            setStory((prevState: any) => ({
              ...prevState,
              profile_user_id: response.data.id,
              stories: storyResponse.data,
            }));
          } catch (error) {
            setError('Error fetching user stories');
          }
        };
        fetchUserStories();
      } catch (error) {
        setError('Error fetching user data');

      }
    };

    fetchUserData();
  }, [accessToken.id]);

  const formattedDate = new Date(user.created_at)
    .toLocaleString()
    .replace(',', ' |');

  const adjustTextareaHeight = () => {
    const textarea = document.getElementById('user-description-textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`; 
      setTextareaHeight(`${textarea.scrollHeight}px`);
    }
  };

  const handleDescriptionUpdate = async () => {
    const formData = new FormData();
    formData.append('newDescription', description);
    formData.append('userid', accessToken.id);

    try {
      const response = await axios.post(
        `http://localhost:3000/user/userid/${accessToken.id}/changeDescriptionTo`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setOriginalDescription(description);
      setIsEditingDescription(false);
    } catch (error) {
      setError('Error updating user description');
    }
  };

  return (
    <div>
      <div className="profile_settings_container">
        <div className="profile_settings_wrapper">
          <div className="">
            <div className="userSettings_profile_wrapper">
              <div className="userSettings_profile_usernameContainer mb-4">
                <h1 className="userSettings_profile_h1_text">
                  {user.username}
                </h1>
              </div>
              <div className="userSettings_profile_created_atContainer">
                <h1 className="userSettings_profile_h1_text">
                  Member Since: {formattedDate}
                </h1>
              </div>
              <div className="userSettings_profile_followersCount_container">
                <h1 className="userSettings_profile_h1_text">
                  Followers: {user.followers_count}
                </h1>
              </div>
              <div className="userSettings_profile_settings_description_container">
                <h1 className="userSettings_profile_h1_text">
                  Description:{' '}
                  {isEditingDescription ? (
                    <textarea
                      id="user-description-textarea"
                      className="user-description-textarea"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        adjustTextareaHeight(); 
                      }}
                      style={{ height: textareaHeight }} 
                    />
                  ) : (
                    <div
                      id="userDescription"
                      className="user-description-rich-text"
                      dangerouslySetInnerHTML={{ __html: originalDescription }}
                    />
                  )}
                </h1>
                {isEditingDescription ? (
                  <button
                    className="btn btn-primary"
                    id="update_description_btn_submit"
                    onClick={handleDescriptionUpdate}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    id="userSettings_update_description_btn"
                    onClick={() => setIsEditingDescription(true)}
                  >
                    Edit Description
                  </button>
                )}
              </div>

              <h2 className="userSettings_profile_h2_text">User Stories:</h2>
              <div className="AllStoriesContainer">
                <ul>
                  {story.stories.map((story) => (
                    <li className="profile_storiesContainer" key={story.id}>
                      <Link
                        to={`/story/${story.id}/author/${story.userid}`}
                        id="storyLink"
                      >
                        <h2 className="profile_h2_text_UserProfileSettings_title">
                          {story.title}
                        </h2>
                      </Link>
                      <p className="profile_h2_text_UserProfileSettings_description">
                        {story.description}
                      </p>
                      <p className="profile_h2_text_UserProfileSettings_tags">
                        Tags: {story.tags ? story.tags.join(', ') : ''}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile_Settings;

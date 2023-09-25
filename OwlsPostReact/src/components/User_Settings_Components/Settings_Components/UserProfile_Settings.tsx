import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import "react-quill/dist/quill.snow.css"; 
import "../../../styles/UserSettings_Styles/UserProfile_Settings.css";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill"; 

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
  const accessToken = cookies.get("accessToken");

  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const [description, setDescription] = useState(""); // Use description for rich text content
  const [isUpdateDescriptionFormVisible, setIsUpdateDescriptionFormVisible] =
    useState(false);

  const [user, setUser] = useState<UserStates>({
    profile_user_id: 0,
    username: "",
    email: "",
    created_at: new Date(),
    followers_count: 0,
    description: "",
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
    .replace(",", " |");

  // Function to update the user's username
  const handleDescriptionUpdate = async () => {
    const formData = new FormData();
    formData.append("newDescription", description);
    formData.append("userid", accessToken.id);
    console.log(description);
    try {
      const response = await axios.post(
        `http://localhost:3000/user/userid/${accessToken.id}/changeDescriptionTo`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      window.location.reload();
    } catch (error) {
      setError('Error updating user description');

    }
  };

  const updateDesciptionForm = () => {
    return (
      <div>
        <button
          id="userSettings_update_description_btn"
          onClick={() =>
            setIsUpdateDescriptionFormVisible(!isUpdateDescriptionFormVisible)
          }
        >
          Change Description
        </button>
        {isUpdateDescriptionFormVisible && (
          <div className="quill-editor-container">
            <ReactQuill
              className="quill-editor"
              value={description}
              onChange={(value) => setDescription(value)}
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }],
                  ["bold", "italic", "underline", "strike"],
                  [{ align: [] }],
                  ["link"],
                  ["clean"],
                ],
              }}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "align",
                "link",
              ]}
            />
            <button
              type="button"
              className="btn btn-primary"
              id="update_description_btn_submit"
              onClick={handleDescriptionUpdate}
            >
              Update
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="profile_settings_container">
        <div className="profile_settings_wrapper">
          <div className="">
            <div className="userSettings_profile_wrapper">
              <div className="userSettings_profile_usernameContainer mb-4">
                <h1 className="userSettings_profile_h1_text">{user.username}</h1>
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
                  Description:{" "}
                  <div
                    id="userDescription"
                    className="user-description-rich-text"
                    dangerouslySetInnerHTML={{ __html: user.description }}
                  />
                </h1>
                {updateDesciptionForm()}
              </div>

              <h2 className="userSettings_profile_h2_text">User Stories: </h2>
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
                        Tags: {story.tags ? story.tags.join(", ") : ""}
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

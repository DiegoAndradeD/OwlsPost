import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import '../../styles//User_Styles/FollowedUsers.css';
import { useTheme } from '../ThemeContext';

interface FollowedUsers {
    usernames: {following_username: string, userid: number}[]
}

const FollowedUsers: React.FC = () => {

    const { darkMode } = useTheme();
    const [error, setError] = useState<string | null>(null);

    const [followedUsers, setFollowedUsers] = useState<FollowedUsers> ({
        usernames: []
    })

    const cookies = new Cookies();
    const accessToken = cookies.get('accessToken');
    console.log(accessToken.id)

    useEffect(() => {
        const fetchFollowedUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/follower/getFollowingUsers/${accessToken.id}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setFollowedUsers({
                    usernames: response.data,
                  });
            } catch (error) {
                setError('Error Fetching Followed Users');
            }
        }

        fetchFollowedUsers()
    },[accessToken.id])


    const FollowedUsersContainer = darkMode ? 'dark-mode' : '';

    return (
        <div className={`FollowedUsers_mainDiv ${FollowedUsersContainer}`}>
            <div className="">
                <div className="FollowedUser_wrapper">
                    <h1 className="FollowedUser_h1">Following: </h1>
                    <div className="followedUsersContainer">
                        {followedUsers.usernames.map((user, index) => (
                        <Link to={`/getUserProfile/${user.userid}`} key={index}>
                            <div className="user-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>
                            {user.following_username}
                            </div>
                        </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FollowedUsers
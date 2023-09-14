import axios from "axios";
import { useEffect, useState } from "react"
import Cookies from "universal-cookie"
import '../styles/FollowedUsers.css'
import { Link } from "react-router-dom";
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Exemplo de ícone


interface FollowedUsers {
    usernames: {following_username: string, userid: number}[]
}

interface FollowedUser {
    username: string;
}

const FollowedUsers: React.FC = () => {

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
                console.log(response.data)
            } catch (error) {
                console.log(error);
            }
        }

        fetchFollowedUsers()
    },[accessToken.id])

    return (
        <div>
            <div className="container">
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
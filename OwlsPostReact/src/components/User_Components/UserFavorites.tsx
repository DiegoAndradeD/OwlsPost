import axios from "axios";
import { useEffect, useState } from "react"
import Cookies from "universal-cookie"
import '../../styles/User_Styles/FollowedUsers.css'
import { Link } from "react-router-dom";
import '../../styles/User_Styles/UserFavorites.css';


interface favoriteStories {
    stories: {story_title: string, storyid: number, story_description: string, author_id: number}[]
}

interface favoriteStory {
    title: string;
    id: number;
    description: string;
    author_id: number
}


const UserFavorites: React.FC = () => {

    const [favoriteStories, setFavoriteStories] = useState<favoriteStories> ({
        stories: []
    })

    const cookies = new Cookies();
    const accessToken = cookies.get('accessToken');

    useEffect(() => {
        const fetchFollowedUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/favorite/get_user/${accessToken.id}/favoriteStories`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setFavoriteStories({
                    stories: response.data,
                  });
            } catch (error) {
                console.log(error);
            }
        }

        fetchFollowedUsers()
    },[accessToken.id])

    return (
        <div>
            <div className="container">
                <div className="UserFavorites_wrapper">
                    <h1 className="UserFavorites_h1">Favorites: </h1>
                    <div className="favoriteStoriesContainer">
                        {favoriteStories.stories.map((story, index) => (
                        <div className="favoriteStory" key={story.storyid}>
                            <Link to={`/story/${story.storyid}/author/${story.author_id}`}>
                                <h1> {story.story_title} </h1>
                            </Link>
                            <p>{story.story_description}</p>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserFavorites
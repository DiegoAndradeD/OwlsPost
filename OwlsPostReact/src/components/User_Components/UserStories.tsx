import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Cookies from 'universal-cookie';
import '../../styles/User_Styles/UserStories.css'
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext'; 

interface Story {
    id: number;
    title: string;
    description: string;
    userid: number;
    tags: string[];
}

interface UserStoriesStates {
    userId: number;
    stories: Story[];
    invertedColors: boolean;
}



const StoryContainer: React.FC<{ story: Story; invertedColors: boolean }> = ({ story, invertedColors }) => {
    const h1Class = invertedColors ? 'invertedColors' : '';
    const pClass = invertedColors ? 'invertedColors' : '';

    const capitalizeFirstLetter = (str: string) => {
        return str.split(' ').map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1)).join(' ');
    }

    return (
        <div className='' id='storyContainer'>
            <Link to={`/story/${story.id}/author/${story.userid}`} id='storyLink'>
                <h1 id='UserStories_title' className={h1Class}>{capitalizeFirstLetter(story.title)}</h1>
            </Link>
            <p className={pClass}>{story.description}</p>
            <p className={pClass} >Tags: {story.tags ? story.tags.join(', ') : ''} </p>
        </div>
    );
};

const UserStories: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const cookies = new Cookies();
    const accessToken = cookies.get('accessToken');
    const [state, setState] = useState<UserStoriesStates>({
        userId: 0,
        stories: [],
        invertedColors: false,
    });

    const { darkMode } = useTheme();

    useEffect(() => {
        if (accessToken) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/story/get_user_stories/${accessToken.id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    setState({
                        ...state,
                        userId: accessToken.id,
                        stories: response.data,
                    });
                } catch (error) {
                    setError('Error fetching user stories');
                }
            };

            fetchData();
        }
    }, []);

    const userStories_mainContainerClass = darkMode ? 'dark-mode' : '';

    return (
        <div className={`UserStories_mainDiv ${userStories_mainContainerClass}`}>
        <div className={userStories_mainContainerClass} id='userStories_mainContainerClass'>
                    {state.stories.map(story => (
                        <StoryContainer
                            key={story.id}
                            story={story}
                            invertedColors={state.invertedColors}
                        />
                    ))}
                </div>
            </div>
    )
}

export default UserStories;

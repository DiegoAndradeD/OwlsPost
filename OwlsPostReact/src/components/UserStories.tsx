import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Cookies from 'universal-cookie';
import '../styles/UserStories.css'
import { Link } from 'react-router-dom';

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

const ToggleColorsButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <button onClick={onClick} id='toggleColorBtn'>
            <i className="fa-solid fa-eye-dropper"></i> Change Colors
        </button>
    );
};

const StoryContainer: React.FC<{ story: Story; invertedColors: boolean }> = ({ story, invertedColors }) => {
    const h1Class = invertedColors ? 'invertedColors' : '';
    const pClass = invertedColors ? 'invertedColors' : '';

    const capitalizeFirstLetter = (str: string) => {
        return str.split(' ').map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1)).join(' ');
    }

    return (
        <div className='container' id='storyContainer'>
            <Link to={`/story/${story.id}/author/${story.userid}`} id='storyLink'>
                <h1 className={h1Class}>{capitalizeFirstLetter(story.title)}</h1>
            </Link>
            <p className={pClass}>{story.description}</p>
        </div>
    );
};

const UserStories: React.FC = () => {
    const [state, setState] = useState<UserStoriesStates>({
        userId: 0,
        stories: [],
        invertedColors: false,
    });

    useEffect(() => {
        const cookies = new Cookies();
        const accessToken = cookies.get('accessToken');

        if (accessToken) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/story/get_user_stories/${accessToken.id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    console.log(response.data);
                    setState({
                        ...state,
                        userId: accessToken.id,
                        stories: response.data,
                    });
                } catch (error) {
                    console.log(error);
                }
            };

            fetchData();
        }
    }, []);

    const toggleColors = () => {
        setState({ ...state, invertedColors: !state.invertedColors });
    };

    const mainContainerClass = state.invertedColors
        ? 'container invertedColors'
        : 'container';

    return (
        <div>
            <ToggleColorsButton onClick={toggleColors} />
            <div className={mainContainerClass} id='mainStoriesContainer'>
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

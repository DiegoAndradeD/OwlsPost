import React, {useState, useEffect} from 'react'
import axios from 'axios';
import Cookies from 'universal-cookie';
import '../styles/UserStories.css'
import { Link } from 'react-router-dom';

interface Story {
    id: number;
    title: string;
    description: string;
}

interface UserStoriesStates {
    userId: number;
    stories: Story[],
    invertedColors: boolean,
}

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
        setState({...state, invertedColors: !state.invertedColors});
    };

    const capitalizeFirstLetter = (str: string) => {
        return str.split(' ').map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1)).join(' ');
    }

    const mainContainerClass = state.invertedColors
    ? 'container invertedColors'
    : 'container';

    const h1Class = state.invertedColors ? 'invertedColors' : '';
    const pClass = state.invertedColors ? 'invertedColors' : '';


    return (
        <div>
            <button onClick={toggleColors} id='toggleColorBtn'><i className="fa-solid fa-eye-dropper"></i>Change Colors</button>
            <div className={mainContainerClass} id='mainStoriesContainer'>
            {state.stories.map(story => {
                return (
                    <div key={story.id} className='container' id='storyContainer'>
                    <Link to={`/story/${story.id}`} id='storyLink'>
                      <h1 className={h1Class}>{capitalizeFirstLetter(story.title)}</h1>
                    </Link>
                    <p className={pClass}>{story.description}</p>
                  </div>
                );
            })}
            </div>
        </div>
    )
}

export default UserStories
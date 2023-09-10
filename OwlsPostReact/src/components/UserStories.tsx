import React, {useState, useEffect} from 'react'
import axios from 'axios';
import Cookies from 'universal-cookie';

interface Story {
    id: number;
    title: string;
    description: string;
}

interface UserStoriesStates {
    userId: number;
    stories: Story[]
}

const UserStories: React.FC = () => {
    const [state, setState] = useState<UserStoriesStates>({
        userId: 0,
        stories: [],
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



    return (
        <div>

        </div>
    )
}

export default UserStories
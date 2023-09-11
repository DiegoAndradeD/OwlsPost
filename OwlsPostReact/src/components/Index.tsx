import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import owlIcon from '../assets/owlIcon.png';
import '../styles/Index.css'
import searchIcon from '../assets/lupa.png'
import Cookies from "universal-cookie";



interface Story {
    id: number;
    title: string;
    description: string;
}

interface UserStoriesStates {
    search: string;
    userId: number;
    stories: Story[],
    invertedColors: boolean,
}

const Index: React.FC = () => {
    const navigate = useNavigate();

    const [state, setState] = useState<UserStoriesStates>({
        search: '',
        userId: 0,
        stories: [],
        invertedColors: false,
    });


    useEffect(() => {
        const cookies = new Cookies();
        const accessToken = cookies.get('accessToken');
        
            const fetchData = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/story/all`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    console.log(response.data);
                    setState({
                        ...state,
                        stories: response.data,
                    });
                } catch (error) {
                    console.log(error);
                }
            };
            
            fetchData(); 
        
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
        <div className="mainDiv">
            <div id="welcomeText">
                <h2>Welcome to OwlsPost. Where Stories Come to Life!</h2>
                <p>
                    Are you ready to embark on a journey through the captivating world
                    of storytelling?
                </p>
            </div>
                <div className="searchContainer">
                    <form action="" method="get" className="searchBar">
                        <input 
                            type="text" 
                            name="search" 
                            id="search"
                            placeholder="Search"
                            value={state.search} 
                            onChange={(e) => setState({...state, search: e.target.value})}/>

                        <button type="submit"><img src={searchIcon} alt="searchIcon" id="searchIcon" /></button>
                    </form>
                </div>
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

export default Index;
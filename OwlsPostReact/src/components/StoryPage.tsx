import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import '../styles/UserStories.css';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import '../styles/StoryPage.css'

interface StoryStates {
  userId: number;
  id: number;
  title: string;
  description: string;
  invertedColors: boolean;
  created_at: Date
}

const StoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [state, setState] = useState<StoryStates>({
    userId: 0,
    id: 0,
    title: '',
    description: '',
    invertedColors: false,
    created_at: new Date(),
  });

  useEffect(() => {
    const cookies = new Cookies();
    const accessToken = cookies.get('accessToken');

    if (accessToken) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/story/user/${accessToken.id}/get_story/${id}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log(response.data);
          setState({
            ...state,
            userId: accessToken.id,
            id: Number(id), 
            title: response.data.title,
            description: response.data.description,
            created_at: response.data.created_at,
          });
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }
  }, [id]);

  //TODO - TREAT ERRORS: Navigate to another page after delete
  const handleStoryDelete =async () => {
    try {
        const response = await axios.delete(`http://localhost:3000/story/user/${state.userId}/delete_story/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        }); 
    }
    catch(error) {
        console.log(error);
    }
  }

  const toggleColors = () => {
    setState({ ...state, invertedColors: !state.invertedColors });
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1)).join(' ');
  };

  const createdAtString = state.created_at.toString();
  const dateParts = createdAtString.split('T'); 
  const date = dateParts[0]; 
  const time = dateParts[1].slice(0, 5); 

const formattedDate = `${date} | ${time}h`;

  const mainContainerClass = state.invertedColors
    ? 'container invertedColors'
    : 'container';

  const h1Class = state.invertedColors ? 'invertedColors' : '';
  const pClass = state.invertedColors ? 'invertedColors' : '';

  return (
    <div>
      <button onClick={toggleColors} id='toggleColorBtn'><i className="fa-solid fa-eye-dropper"></i>Change Colors</button>
      <div className={mainContainerClass} id='mainStoriesContainer'>
        <div key={state.id} className='container' id='storyContainer'>
          <Link to={'/'} id='storyLink'>
            <h1 className={h1Class}>{capitalizeFirstLetter(state.title)}</h1>
          </Link>
          <p className={pClass}>{state.description}</p>
          <p className={pClass}>Created At: {formattedDate}</p>
          <button id='deleteBtn' onClick={handleStoryDelete}>Delete Story</button>
        </div>
      </div>
    </div>
  );
}

export default StoryPage;

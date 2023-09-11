import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import '../styles/UserStories.css';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import '../styles/StoryPage.css';

interface StoryStates {
  userId: number;
  id: number;
  title: string;
  description: string;
  invertedColors: boolean;
  created_at: Date;
}

interface Chapter {
  id: number;
  title: string;
  content: string;
}

const StoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [story, setStory] = useState<StoryStates>({
    userId: 0,
    id: 0,
    title: '',
    description: '',
    invertedColors: false,
    created_at: new Date(),
  });

  const [chapters, setChapters] = useState<Chapter[]>([]);

  const cookies = new Cookies();
  const accessToken = cookies.get('accessToken');
  console.log(accessToken)

  useEffect(() => {
    
  
    const fetchData = async () => {
      try {
        if (accessToken) {
          const storyResponse = await axios.get(
            `http://localhost:3000/story/user/${accessToken.id}/get_story/${id}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log(storyResponse.data);
          setStory({
            ...story,
            userId: accessToken.id,
            id: Number(id),
            title: storyResponse.data.title,
            description: storyResponse.data.description,
            created_at: storyResponse.data.created_at,
          });
        } else {
          const storyResponse = await axios.get(
            `http://localhost:3000/story/get_story/${id}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log(storyResponse.data);
          setStory({
            ...story,
            id: Number(id),
            title: storyResponse.data.title,
            description: storyResponse.data.description,
            created_at: storyResponse.data.created_at,
          });
        }
  
        const chaptersResponse = await axios.get(
          `http://localhost:3000/chapter/getStory/${id}/chapters`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        setChapters(chaptersResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, [id]);
  

  //TODO - TREAT ERRORS: Navigate to another page after delete
  //TODO - Put confirmation before deleting
  //TODO - ADD backend validation to both delete and add chapter buttons
  const handleStoryDelete =async () => {
    try {
        const response = await axios.delete(/*`http://localhost:3000/story/user/${story.userId}/delete_story/${id}`*/ '', {
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
    setStory({ ...story, invertedColors: !story.invertedColors });
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1)).join(' ');
  };

  const createdAtString = story.created_at.toString();
  const dateParts = createdAtString.split('T'); 
  const date = dateParts[0]; 
  const time = dateParts[1].slice(0, 5); 

const formattedDate = `${date} | ${time}h`;

  const mainContainerClass = story.invertedColors
    ? 'container invertedColors'
    : 'container';

  const h1Class = story.invertedColors ? 'invertedColors' : '';
  const pClass = story.invertedColors ? 'invertedColors' : '';

  return (
    <div>
    <button onClick={toggleColors} id='toggleColorBtn'><i className="fa-solid fa-eye-dropper"></i>Change Colors</button>
    <div className={mainContainerClass} id="mainStoriesContainer">
      <div key={story.id} className="container" id="storyContainer">
        <Link to={'/'} id="storyLink">
          <h1 className={h1Class}>
            {capitalizeFirstLetter(story.title)}
          </h1>
        </Link>
        <p className={pClass}>{story.description}</p>
        <p className={pClass}>Created At: {formattedDate}</p>
        {accessToken && (
          <div className='buttonsContainer'>
            <button id="deleteBtn" onClick={handleStoryDelete}>
              Delete Story
            </button>
            <Link to={`/add-chapter/${id}`} id="addChapterLink">
              Add Chapter
            </Link>
          </div>
        )}
        <div>
          <h2>Chapters</h2>
          <ul className='chaptersList'>
            {chapters.map((chapter, index) => (
              <li key={chapter.id}>
                <Link className={h1Class} to={`/chapter/${chapter.id}`}>Chapter {index + 1}: {chapter.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
  );
}

export default StoryPage;

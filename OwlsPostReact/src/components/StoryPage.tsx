import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../styles/UserStories.css';
import '../styles/StoryPage.css';

interface StoryStates {
  userId: number;
  authorId: number;
  username: string;
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
  const navigate = useNavigate();
  const { id, userid } = useParams<{ id: string; userid: string }>();
  const [story, setStory] = useState<StoryStates>({
    userId: 0,
    username: '',
    authorId: 0,
    id: 0,
    title: '',
    description: '',
    invertedColors: false,
    created_at: new Date(),
  });
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [accessToken, setAccessToken] = useState<any>(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = new Cookies().get('accessToken'); 
        setAccessToken(token); 

        const storyResponse = await axios.get(
          token && token.id === userid
            ? `http://localhost:3000/story/user/${token.id}/get_story/${id}`
            : `http://localhost:3000/story/get_story/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(storyResponse.data.userid)

        setStory((prevStory) => ({
          ...prevStory,
          userId: token ? token.id : 0,
          authorId: storyResponse.data.userid,
          username: storyResponse.data.username,
          id: Number(id),
          title: storyResponse.data.title,
          description: storyResponse.data.description,
          created_at: storyResponse.data.created_at,
        }));
        console.log(story.userId);

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
  }, [id, userid]);

  const handleStoryDelete = async () => {
    if (confirm('Are you sure you want to delete this story?')) {
      try {
        await axios.delete(
          `http://localhost:3000/story/user/${userid}/delete_story/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        navigate('/user_stories');
      } catch (error) {
        console.log(error);
      }
    }
  };

  const toggleColors = () => {
    setStory({ ...story, invertedColors: !story.invertedColors });
  };

  const capitalizeFirstLetter = (str: string) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toLocaleUpperCase() + word.slice(1))
      .join(' ');
  };

  const formattedDate = new Date(story.created_at)
    .toLocaleString()
    .replace(',', ' |');

  const mainContainerClass = story.invertedColors
    ? 'container invertedColors'
    : 'container';

  const h1Class = story.invertedColors ? 'invertedColors' : '';
  const pClass = story.invertedColors ? 'invertedColors' : '';

  const renderButtons = () => {
    if (accessToken && accessToken.id === Number(userid)) {
      return (
        <div className='buttonsContainer'>
          <button id='deleteBtn' onClick={handleStoryDelete}>
            Delete Story
          </button>
          <Link to={`/add-chapter/${id}`} id='addChapterLink'>
            Add Chapter
          </Link>
        </div>
      );
    }
    return null;
  };

  const renderChapters = () => {
    return (
      <div>
        <h2 className={h1Class}>Chapters</h2>
        <ul className='chaptersList'>
          {chapters.map((chapter, index) => (
            <li key={chapter.id} className={h1Class}>
              <Link id='chaptersLink' to={`/chapter/${chapter.id}`}>
                Chapter {index + 1}: {chapter.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <button onClick={toggleColors} id='toggleColorBtn'>
        <i className='fa-solid fa-eye-dropper'></i>Change Colors
      </button>
      <div className={mainContainerClass} id='mainStoriesContainer'>
        <div key={story.id} className='container' id='storyContainer'>
          <Link to={'/'} id='storyLink'>
            <h1 className={h1Class}>
              {capitalizeFirstLetter(story.title)}
            </h1>
          </Link>
          <Link to={`/getUserProfile/${story.authorId}`}>
            <h3 className="h1Class" id='authorUsername'>
            Author: {capitalizeFirstLetter(story.username)};
            </h3>
          </Link>
          <p className={pClass}>{story.description}</p>
          <p className={pClass}>Created At: {formattedDate}</p>
          {renderButtons()}
          {renderChapters()}
        </div>
      </div>
    </div>
  );
};

export default StoryPage;

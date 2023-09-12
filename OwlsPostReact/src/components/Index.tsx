import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import owlIcon from '../assets/owlIcon.png';
import '../styles/Index.css'
import searchIcon from '../assets/lupa.png'
import Cookies from "universal-cookie";
import DOMPurify from "dompurify";

interface Story {
  id: number;
  title: string;
  description: string;
  userid: number;
}

interface UserStoriesStates {
  search: string;
  userid: number;
  stories: Story[],
  invertedColors: boolean,
}

const WelcomeText: React.FC<{ invertedColors: boolean }> = ({ invertedColors }) => {
  return (
    <div id="welcomeText">
      <h2 className={invertedColors ? 'invertedColors' : ''}>Welcome to OwlsPost. Where Stories Come to Life!</h2>
      <p className={invertedColors ? 'invertedColors' : ''}>
        Are you ready to embark on a journey through the captivating world
        of storytelling?
      </p>
    </div>
  );
};

const SearchBar: React.FC<{ search: string; onSearchChange: (value: string) => void; onSubmit: (e: React.FormEvent) => void }> = ({ search, onSearchChange, onSubmit }) => {
  return (
    <div className="searchContainer">
      <form onSubmit={onSubmit} className="searchBar">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button type="submit"><img src={searchIcon} alt="searchIcon" id="searchIcon" /></button>
      </form>
    </div>
  );
};

const StoryContainer: React.FC<{ story: Story; invertedColors: boolean }> = ({ story, invertedColors }) => {
  const capitalizeFirstLetter = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  const h1Class = invertedColors ? 'invertedColors' : '';
  const pClass = invertedColors ? 'invertedColors' : '';

  return (
    <div className='container' id='storyContainer'>
      <Link to={`/story/${story.id}/author/${story.userid}`} id='storyLink'>
        <h1 className={h1Class}>{capitalizeFirstLetter(story.title)}</h1>
      </Link>
      <p className={pClass}>{story.description}</p>
    </div>
  );
};

const Index: React.FC = () => {
  const navigate = useNavigate();

  const [state, setState] = useState<UserStoriesStates>({
    search: '',
    userid: 0,
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
    setState({ ...state, invertedColors: !state.invertedColors });
  };

  const onSearchChange = (value: string) => {
    setState({ ...state, search: value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    state.search = DOMPurify.sanitize(state.search);
    if (state.search.trim() === '') {
      window.location.reload();
    }
    try {
      const response = await axios.get(`http://localhost:3000/story/getStorySearched/${state.search}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setState({
        ...state,
        stories: response.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const mainContainerClass = state.invertedColors
    ? 'container invertedColors'
    : 'container';

  return (
    <div className="mainDiv">
      <WelcomeText invertedColors={state.invertedColors} />
      <SearchBar search={state.search} onSearchChange={onSearchChange} onSubmit={onSubmit} />
      <div className={mainContainerClass} id='mainStoriesContainer'>
        {state.stories.map(story => (
          <StoryContainer key={story.id} story={story} invertedColors={state.invertedColors} />
        ))}
      </div>
    </div>
  )
}

export default Index;

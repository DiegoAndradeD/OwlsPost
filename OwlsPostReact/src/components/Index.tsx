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
  tags: string[];
}

interface UserStoriesStates {
  search: string;
  userid: number;
  stories: Story[];
  invertedColors: boolean;
  filter: string;
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

const SearchBar: React.FC<{
  search: string;
  onSearchChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  filter: string;
  onFilterChange: (value: string) => void;
}> = ({ search, onSearchChange, onSubmit, filter, onFilterChange }) => {
  return (
    <div className="searchContainer mb-4 container">
      <form onSubmit={onSubmit} className="searchBar">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button type="submit">
          <img src={searchIcon} alt="searchIcon" id="searchIcon" />
        </button>
      </form>
      <form onSubmit={onSubmit} className="searchBar">
      <input
          type="text"
          name="filter"
          id="filter"
          placeholder="Filter by tags (e.g., Fantasy)"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
        />
        <button type="submit">
          <img src={searchIcon} alt="searchIcon" id="searchIcon" />
        </button>
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
      <p className={pClass} id="index_story_description">{story.description}</p>
      <div  id='storyTags'>
        <p className={pClass} >Tags: {story.tags ? story.tags.join(', ') : ''} </p>
      </div>
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
    filter: '', 
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

  const onFilterChange = (value: string) => {
    setState({ ...state, filter: value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    state.search = DOMPurify.sanitize(state.search);
  
    const filterTags = state.filter.split(/[,\s]+/).filter(Boolean);
  
    if (state.search.trim() === '' && filterTags.length === 0) {
      window.location.reload();
    }
  
    try {
      let response;
      if (state.search.trim() !== '') {
        response = await axios.get(`http://localhost:3000/story/getStoryByTitle/${state.search}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else if (filterTags.length > 0) {
        response = await axios.get(`http://localhost:3000/story/getStoriesByTags`, {
          params: { tags: filterTags.join(',') }, 
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
  
      if (response) {
        setState({
          ...state,
          stories: response.data,
          search: '',
        filter: '',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  

  const ToggleColorsButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
      <button onClick={onClick} id='toggleColorBtn'>
        <i className="fa-solid fa-eye-dropper"></i> Change Colors
      </button>
    );
  };

  const mainContainerClass = state.invertedColors
    ? 'container invertedColors'
    : 'container';

  return (
    <div className="mainDiv">
      <ToggleColorsButton onClick={toggleColors} />
      <WelcomeText invertedColors={state.invertedColors} />
      <SearchBar
        search={state.search}
        onSearchChange={onSearchChange}
        onSubmit={onSubmit}
        filter={state.filter}
        onFilterChange={onFilterChange}
      />
      <div className={mainContainerClass} id='mainStoriesContainer'>
        {state.stories.map((story) => (
          <StoryContainer key={story.id} story={story} invertedColors={state.invertedColors} />
        ))}
      </div>
    </div>
  )
}

export default Index;

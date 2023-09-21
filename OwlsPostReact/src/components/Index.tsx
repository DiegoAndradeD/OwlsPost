import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import owlIcon from '../assets/owlIcon.png';
import '../styles/Index.css'
import searchIcon from '../assets/lupa.png'
import Cookies from "universal-cookie";
import DOMPurify from "dompurify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

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

const WelcomeText: React.FC<{ }> = ({ }) => {
  return (
    <div id="welcomeText">
      <h2 >Welcome to OwlsPost. Where Stories Come to Life!</h2>
      <p >
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

const StoryContainer: React.FC<{ story: Story;}> = ({ story }) => {
  const capitalizeFirstLetter = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }



  return (
    <div className='' id='index_storyContainer'>
      <Link to={`/story/${story.id}/author/${story.userid}`} id='index_storyLink'>
        <h1 className="index_story_title" >{capitalizeFirstLetter(story.title)}</h1>
      </Link>
      <p  id="index_story_description">{story.description}</p>
      <div  id='storyTags'>
        <p  >Tags: {story.tags ? story.tags.join(', ') : ''} </p>
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
    invertedColors: document.documentElement.classList.contains('dark-mode'),
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
    const root = document.documentElement;
    root.classList.toggle('dark-mode');
    setState((prevState) => ({
      ...prevState,
      invertedColors: !prevState.invertedColors,
    }));

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
        {state.invertedColors ? (
          <>
          <FontAwesomeIcon icon={faSun} /> Change to Bright Mode
            
          </>
        ) : (
          <>
          <FontAwesomeIcon icon={faMoon} /> Change to Dark Mode
            
          </>
        )}
      </button>
    );
  };
  

  const mainContainerClass = state.invertedColors
    ? 'invertedColors'
    : '';

  return (
    <div className="mainDiv">
      <ToggleColorsButton onClick={toggleColors} />
      <WelcomeText />
      <SearchBar
        search={state.search}
        onSearchChange={onSearchChange}
        onSubmit={onSubmit}
        filter={state.filter}
        onFilterChange={onFilterChange}
      />
      <div className={mainContainerClass} id='mainStoriesContainer'>
        {state.stories.map((story) => (
          <StoryContainer key={story.id} story={story}  />
        ))}
      </div>
    </div>
  )
}

export default Index;

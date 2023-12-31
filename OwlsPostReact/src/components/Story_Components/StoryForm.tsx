import React, { useState, useEffect } from "react";
import Cookies from 'universal-cookie';
import axios from "axios";
import DOMPurify from "dompurify";
import '../../styles/Story_Styles/StoryForm.css'
import { useNavigate } from "react-router-dom";
import { useTheme } from '../ThemeContext';

interface StoryFormState {
  title: string;
  description: string;
  userId: number;
  username: string;
  remainingChars: number;
  tagInput: string; 
  tags: string[];   
}

const CharacterCounter: React.FC<{ remainingChars: number }> = ({ remainingChars }) => {
  return <p id="storyForm_CharsCounter">Description Max Length: <span>{remainingChars}</span></p>;
};

const TextInputField: React.FC<{
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ id, placeholder, value, onChange }) => {
  return (
    <div className="mb-3 row">
      <div className="">
        <input
          type="text"
          className="form-control"
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

const TextAreaField: React.FC<{
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  remainingChars: number;
}> = ({ id, placeholder, value, onChange, remainingChars }) => {
  return (
    <div className="mb-3 row">
      <div className="">
        <textarea
          className="form-control"
          id={id}
          placeholder={placeholder}
          rows={10}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        ></textarea>
        <CharacterCounter remainingChars={remainingChars} />
      </div>
    </div>
  );
};

const StoryForm: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [error, setError] = useState<string | null>(null);


  const [state, setState] = useState<StoryFormState>({
    title: '',
    description: '',
    userId: 0,
    username: '',
    remainingChars: 2000,
    tagInput: '', 
    tags: [],    
  });

  const maxLenght = 2000;

  const handleDescription = (newDescription: string) => {
    const currentLength = newDescription.length;
    const remaining = maxLenght - currentLength;

    if (remaining >= 0) {
      setState({ ...state, description: newDescription, remainingChars: remaining });
    }
  }

  const handleAddTag = () => {
    const newTagInput = state.tagInput.trim();

    if (newTagInput !== '' && !state.tags.includes(newTagInput)) {
      const updatedTags = [...state.tags, newTagInput];
      setState({ ...state, tags: updatedTags, tagInput: '' });
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    const updatedTags = state.tags.filter((_, index) => index !== indexToRemove);
    setState({ ...state, tags: updatedTags });
  };

  useEffect(() => {
    const cookies = new Cookies();
    const accessToken = cookies.get('accessToken');
    if (accessToken) {
      setState({ ...state, userId: accessToken.id, username: accessToken.username });
    }
  }, [])

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData();
    const cleanedTitle = DOMPurify.sanitize(state.title);
    const cleanedDescription = DOMPurify.sanitize(state.description);

    formData.append('title', cleanedTitle);
    formData.append('description', cleanedDescription);
    formData.append('userid', String(state.userId));
    formData.append('username', state.username);

    state.tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    try {
      const cookies = new Cookies();
      const accessToken = cookies.get('accessToken');;
      const response = await axios.post('http://localhost:3000/story/add_story',
        formData, {
        headers: {
          'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken.access_token}`,
        },
      });
      if (response.status === 201) { 
        navigate('/user_stories');
      } else {
        setError('Failed to register the story');
      }
    } catch (error: any) {
      if(error.response) {
        if(error.response.status === 401) {
          setError('Unauthorized. Please log in');
          navigate('/login');
        } else {
          setError('An error occurred. Please try again later');
        }
      } else {
        setError('Network error. Please check your internet connection');
      }
    }
    navigate('/user_stories');
  }

  const storyFormContainer = darkMode ? 'dark-mode' : '';

  return (
    <div className={`StoryForm_mainDiv ${storyFormContainer}`}>
        <div className="col-md-6" id="storyFormWrapper">
          <form onSubmit={handleFormSubmit}>
            <h2 className="mb-4" id="storyFormTitles">New Story</h2>
            <TextInputField
              id="title"
              placeholder="Title"
              value={state.title}
              onChange={(value) => setState({ ...state, title: value })}
            />
            <TextAreaField
              id="description"
              placeholder="Story Description"
              value={state.description}
              onChange={handleDescription}
              remainingChars={state.remainingChars}
            />
            <div className="mb-3 row">
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="tags"
                  placeholder="Add tags (1 at a time)"
                  value={state.tagInput}
                  onChange={(e) => setState({ ...state, tagInput: e.target.value })}
                />
              </div>
              <div className="col-sm-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddTag}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="mb-3 row">
              <div className=""></div>
              <div className="">
                <div className="tags-container">
                  {state.tags.map((tag, index) => (
                    <span key={index} className="tagText">
                      {tag}
                      <button
                        type="button"
                        className="removeTagBtn"
                        onClick={() => handleRemoveTag(index)}
                      >X</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button type="submit" className="storyForm_submit_btn">Submit</button>
          </form>
        </div>
    </div>
  );
}

export default StoryForm;

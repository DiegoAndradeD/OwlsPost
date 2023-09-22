import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/Chapter_Styles/ChapterForm.css';
import { useTheme } from '../ThemeContext';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';

const AddChapterPage: React.FC = () => {
  const { darkMode } = useTheme();

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState({
    title: '',
    content: '',
    storyid: id,
  });

  const handleChange = (name: string, value: string) => {
    setChapter({
      ...chapter,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log(chapter);
      const response = await axios.post(
        `http://localhost:3000/chapter/${id}/add-chapter`,
        chapter,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      navigate('/user_stories');
    } catch (error) {
      console.error(error);
    }
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <h2 className="mb-4 text-center">New Chapter</h2>
        <div className="mb-3" id="dataContainer">
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="title"
              placeholder="Title"
              name="title"
              value={chapter.title}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </div>
        </div>
        <div className="mb-3 row" id="dataContainer">
          <div className="col-sm-10">
            <ReactQuill
              value={chapter.content}
              onChange={(value) => handleChange('content', value)}
              placeholder="Story Description"
            />
          </div>
        </div>
        <button type="submit" className="ChapterForm_submitBtn">
          Submit
        </button>
      </form>
    );
  };

  const ChapterFormContainer = darkMode ? 'dark-mode' : '';

  return (
    <div className={`ChapterForm_mainDiv ${ChapterFormContainer}`}>
      <div className="" id="chapterFormContainer">
        <div className="col-md-6" id="chapterFormWrapper">
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

export default AddChapterPage;

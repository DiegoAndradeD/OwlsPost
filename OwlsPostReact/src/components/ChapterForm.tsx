import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ChapterForm.css';

const AddChapterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState({
    title: '',
    content: '',
    storyid: id,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setChapter({
      ...chapter,
      [name]: value,
    });
    if (e.target instanceof HTMLTextAreaElement) {
        autoExpandTextarea(e.target);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log(chapter);
      const response = await axios.post(`http://localhost:3000/chapter/${id}/add-chapter`, chapter, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data)
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };


  const autoExpandTextarea = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
  };

  return (
    <div className="" id="chapterFormContainer">
      <div className="col-md-6" id="chapterFormWrapper">
        <form onSubmit={handleSubmit}>
          <h2 className="mb-4">New Chapter</h2>
          <div className="mb-3" id="dataContainer">
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="title"
                placeholder="Title"
                name="title"
                value={chapter.title}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-3 row" id="dataContainer">
            <div className="col-sm-10">
              <textarea
                className="form-control"
                id="description"
                placeholder="Story Description"
                rows={8} 
                name="content"
                value={chapter.content}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <button type="submit" className="">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddChapterPage;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/Chapter_Styles/ChapterPage.css';
import { useTheme } from '../ThemeContext';
import axios from 'axios';
import Cookies from 'universal-cookie';

interface Chapter {
  id: number;
  title: string;
  content: string;
  storyid: number;
}

const ChapterPage: React.FC = () => {
  const { darkMode } = useTheme();
  const { chapterId, authorid } = useParams<{ chapterId: string, authorid: string }>();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [storyId, setStoryId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedChapter, setEditedChapter] = useState<Chapter | null>(null);

  const cookies = new Cookies();
  const accessToken = cookies.get('accessToken');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/chapter/getChapter/${chapterId}`);
        setStoryId(response.data.storyid);
        setChapter(response.data);
      } catch (error) {
        setError('Error fetching chapter');
      }
    };

    fetchChapter();
  }, [chapterId]);

  useEffect(() => {
    if (storyId !== null) {
      const fetchChapters = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/chapter/getStory/${storyId}/chapters`);
          setChapters(response.data);
        } catch (error) {
          setError('Error fetching chapters');
        }
      };

      fetchChapters();
    }
  }, [storyId]);

  const handleEditButtonClick = () => {
    setIsEditing(true);
    setEditedChapter(chapter);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: "title" | "content"
  ) => {
    if (editedChapter) {
      setEditedChapter({
        ...editedChapter,
        [field]: e.target.value,
      });
    }
  };

  const handleChapterUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedChapter) {
      try {
        const response = await axios.put(
          `http://localhost:3000/chapter/update/${editedChapter.storyid}/update_chapter/${editedChapter.id}`,
          {
            title: editedChapter.title,
            content: editedChapter.content,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken.access_token}`,
            },
          }
        );
        if (response.status === 200) {
          setIsEditing(false);
          setChapter(editedChapter);
        } else {
          setError('Failed to update the chapter');
        }
      } catch (error: any) {
        if (error.response) {
          setError('An error occurred. Please try again later');
        } else {
          setError('Network error. Please check your internet connection');
        }
      }
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedChapter(null);
  };

  const handleChapterDelete = async () => {
    if (chapter && confirm('Are you sure you want to delete this chapter?')) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/chapter/story/${chapter.storyid}/delete_chapter/${chapter.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken.access_token}`,
            },
          }
        );
        if (response.status === 204) {
          navigate('/user_stories');
          window.location.reload();
        } else {
          setError('Failed to delete the chapter');
        }
        navigate('/user_stories');
      } catch (error: any) {
        if (error.response) {
          setError('An error occurred. Please try again later');
        } else {
          setError('Network error. Please check your internet connection');
        }
      }
    }
  };

  const renderAuthorNavbar = () => {
    if (accessToken && accessToken.id === Number(authorid)) {
      return (
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">
              Chapter Menu
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item active">
                  {isEditing ? (
                    <button type="button" className="nav-link" onClick={cancelEditing}>
                      Cancel Edit
                    </button>
                  ) : (
                    <button type="button" className="nav-link" onClick={handleEditButtonClick}>
                      Edit Chapter
                    </button>
                  )}
                </li>
                <li className="nav-item">
                  <button className="nav-link" onClick={handleChapterDelete}>
                    Delete Chapter
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      );
    }
    return null;
  };

  const ChapterPageContainer = darkMode ? 'dark-mode' : '';

  return (
    <div className={`ChapterPage_mainDiv ${ChapterPageContainer}`}>
      {renderAuthorNavbar()}
      {error && <div className="error-message">{error}</div>}
      {isEditing ? (
        <div className="chapter-edit-form">
          <h2 className="edit-form-title">Edit Chapter</h2>
          <form onSubmit={handleChapterUpdate}>
            <div className="form-group">
              <input
                type="text"
                id="title"
                name="title"
                value={editedChapter?.title || ''}
                onChange={(e) => handleInputChange(e, 'title')}
                className="edit-form-input"
                required
              />
            </div>
            <div className="form-group">
              <textarea
                id="content"
                name="content"
                value={editedChapter?.content || ''}
                rows={40}
                onChange={(e) => handleInputChange(e, 'content')}
                className="edit-form-textarea"
                required
              />
            </div>
            <div className="edit-form-buttons">
              <button type="submit" className="edit-form-save-button">
                Save
              </button>
              <button type="button" onClick={cancelEditing} className="edit-form-cancel-button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="chapterContainer">
          <h2 id="chapterTitle">{chapter?.title ?? 'Loading...'}</h2>
          <div
            className="chapter-content"
            dangerouslySetInnerHTML={{ __html: chapter?.content || 'Loading...' }}
          />
        </div>
      )}
    </div>
  );
};

export default ChapterPage;

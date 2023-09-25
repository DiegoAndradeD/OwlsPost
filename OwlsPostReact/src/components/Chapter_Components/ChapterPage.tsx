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


  const cookies = new Cookies();
  const accessToken = cookies.get('accessToken');;

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

  if (!chapter || chapters.length === 0) {
    return <div>Loading...</div>;
  }

  const currentIndex = chapters.findIndex((c) => c.id.toString() === chapterId);
  const nextIndex = currentIndex + 1;
  const prevIndex = currentIndex - 1;

  const hasNextChapter = nextIndex < chapters.length;
  const hasPrevChapter = prevIndex >= 0;

  const nextChapterId = hasNextChapter ? chapters[nextIndex].id : null;
  const prevChapterId = hasPrevChapter ? chapters[prevIndex].id : null;

  const navigateToNextChapter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (nextChapterId) {
      window.location.href = `/chapter/${nextChapterId}`;
    }
  };

  const navigateToPrevChapter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (prevChapterId) {
      window.location.href = `/chapter/${prevChapterId}`;
    }
  };

  const handleChapterDelete = async () => {
    
    if (confirm('Are you sure you want to delete this chapter?')) {
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
          setError('Failed to delete the story');
        }
        navigate('/user_stories');
      } catch (error: any) {
          if(error.response) {
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
        <div >
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">Chapter Menu</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item active">
                  <button className="nav-link" id='' onClick={handleChapterDelete}>
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
      <div className="chapterContainer">
        <h2 id='chapterTitle'>{chapter.title}</h2>
        <div
          className="chapter-content"
          dangerouslySetInnerHTML={{ __html: chapter.content }} 
        />
        <div className="chapter-navigation">
          {hasPrevChapter && (
            <a
              href={`/chapter/${prevChapterId}`}
              className="prevChapterButton"
              onClick={navigateToPrevChapter}
            >
              Previous Chapter
            </a>
          )}
          {hasNextChapter && (
            <a
              href={`/chapter/${nextChapterId}`}
              className="nextChapterButton"
              onClick={navigateToNextChapter}
            >
              Next Chapter
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/Chapter_Styles/ChapterPage.css';

interface Chapter {
  id: number;
  title: string;
  content: string;
}

const ChapterPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [storyId, setStoryId] = useState<number | null>(null);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/chapter/getChapter/${chapterId}`);
        setStoryId(response.data.storyid);
        setChapter(response.data);
      } catch (error) {
        console.error(error);
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
          console.error(error);
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

  return (
    <div className="chapterContainer">
      <h2 id='chapterTitle'>{chapter.title}</h2>
      <div className="chapter-content">{chapter.content}</div>
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
  );
};

export default ChapterPage;

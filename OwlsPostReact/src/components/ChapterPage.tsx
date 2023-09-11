import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import '../styles/ChapterPage.css'

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
        console.log(response.data.storyid)
        setChapter(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchChapters = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/chapter/getStory/${storyId}/chapters`);
          console.log(response.data)
          setChapters(response.data);
        } catch (error) {
          console.error(error);
        }
      };

    fetchChapter();
    fetchChapters();
  }, [chapterId, storyId]);

  if (!chapter || chapters.length === 0) {
    return <div>Loading...</div>;
  }

  const currentIndex = chapters.findIndex((c) => c.id.toString() === chapterId);
  const nextIndex = currentIndex + 1;
  const hasNextChapter = nextIndex < chapters.length;
  const nextChapterId = hasNextChapter ? chapters[nextIndex].id : null;

  const navigateToNextChapter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault(); 
    if (nextChapterId) {
      window.location.href = `/chapter/${nextChapterId}`;
    }
  };

  return (
    <div className="chapterContainer">
      <h2>{chapter.title}</h2>
      <div className="chapter-content">{chapter.content}</div>
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
  );
};

export default ChapterPage;

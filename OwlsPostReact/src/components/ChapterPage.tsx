import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Chapter {
  id: number;
  title: string;
  content: string;
}

const ChapterPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const [chapter, setChapter] = useState<Chapter | null>(null);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/chapter/getChapter/${chapterId}`);
        setChapter(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChapter();
  }, [chapterId]);

  if (!chapter) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{chapter.title}</h2>
      <p>{chapter.content}</p>
    </div>
  );
};

export default ChapterPage;

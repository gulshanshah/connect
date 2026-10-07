import { useState, useEffect } from 'react';
import { Story } from '../types';

export default function useStories(): Story[] {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    setStories([
      { id: '1', user: 'Travel Diaries', image: 'https://picsum.photos/200/300?random=1' },
      { id: '2', user: 'Tech Today',      image: 'https://picsum.photos/200/300?random=2' },
      { id: '3', user: 'Foodies',         image: 'https://picsum.photos/200/300?random=3' },
      { id: '4', user: 'Art Space',       image: 'https://picsum.photos/200/300?random=4' },
      { id: '5', user: 'Fitness Zone',    image: 'https://picsum.photos/200/300?random=5' },
    ]);
  }, []);

  return stories;
}

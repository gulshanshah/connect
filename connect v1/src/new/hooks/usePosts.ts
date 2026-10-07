import { useState, useEffect } from 'react';
import { Post } from '../types';

export default function usePosts(): Post[] {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts([
      {
        id: '1',
        title: 'Mountain Escape',
        username: 'nature_explorer',
        fullName: 'Sarah Johnson',
        college: 'Wildlife Conservation College',
        avatar: 'https://picsum.photos/50/50?random=9',
        images: [
          { url: 'https://picsum.photos/400/600?random=6' },
          { url: 'https://picsum.photos/400/600?random=61' },
          { url: 'https://picsum.photos/400/600?random=62' },
        ],
        likes: 234,
        comments: 45,
        shares: 32,
        bookmarks: 12,
      },
      {
        id: '2',
        title: 'Future of AI',
        username: 'tech_visionary',
        fullName: 'Michael Chen',
        college: 'MIT Computer Science',
        avatar: 'https://picsum.photos/50/50?random=10',
        images: [
          { url: 'https://picsum.photos/400/600?random=7' },
          { url: 'https://picsum.photos/400/600?random=71' },
        ],
        likes: 891,
        comments: 156,
        shares: 87,
        bookmarks: 89,
      },
      {
        id: '3',
        title: 'Urban Artistry',
        username: 'city_artist',
        fullName: 'Emma Wilson',
        college: 'School of Visual Arts',
        avatar: 'https://picsum.photos/50/50?random=11',
        images: [
          { url: 'https://picsum.photos/400/600?random=8' },
          { url: 'https://picsum.photos/400/600?random=81' },
          { url: 'https://picsum.photos/400/600?random=82' },
          { url: 'https://picsum.photos/400/600?random=83' },
        ],
        likes: 567,
        comments: 89,
        shares: 54,
        bookmarks: 45,
      },
    ]);
  }, []);

  return posts;
}

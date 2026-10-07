export interface Story {
    id: string;
    user: string;
    image: string;
  }
  
  export interface PostImage {
    url: string;
  }
  
  export interface Post {
    id: string;
    title: string;
    username: string;
    fullName: string;
    college: string;
    avatar: string;
    images: PostImage[];
    likes: number;
    comments: number;
    shares: number;
    bookmarks: number;
  }

  
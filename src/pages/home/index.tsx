
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MediaSlider from '../../components/post';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
interface IUser {
  username: string;
  avatar?: string | null;
}

interface IPost {
  _id: string;
  content: string;
  imageUrls: string[];
  videoUrl?: string;
  createdAt: string;
  user: IUser;
  likesCount: number;
  likes: string[]; 
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getUserIdFromToken = (): string => {
    const token = localStorage.getItem('token'); 
    if (token) {
      try {
        const decoded: any = jwtDecode(token); 
        return decoded.id ; 
      } catch (error) {
        console.error('Error decoding token:', error);
        return ''; 
      }
    }
    return ''; 
  };
  const userId = getUserIdFromToken();
  console.log(userId)
  // Функция для получения постов
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        'http://localhost:3333/api/post/following',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        }
      );
      setPosts(response.data.data.posts);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при загрузке постов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostModal = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  
  if (loading) {
    return <div>Загрузка...</div>;
  }


  if (error) {
    return <div className="text-red-500">{error}</div>;
  }


  if (posts.length === 0) {
    return <div>Пока нет постов людей, за которыми вы следите</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="z-20 w-full bg-gray-200 aspect-square overflow-y-clip"
        >
          <MediaSlider
            media={
              post.imageUrls.length > 0 ? post.imageUrls : [post.videoUrl || '']
            }
            avatar={post.user.avatar || null}
            onClick={() => handlePostModal(post._id)}
            author={post.user.username}
            date={new Date(post.createdAt).toDateString()}
            likecount={post.likesCount}
            description={post.content}
            postId={post._id} 
            userId={userId|| ''}
            likes={post.likes} 
          />
        </div>
      ))}
    </div>
  );
};

export default Home;

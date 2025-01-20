import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../../ui/button';
import MediaSlider from '../../components/post';
import { jwtDecode } from 'jwt-decode';

interface IUserProfile {
  user: {
    _id: string;
    username: string;
  };
  avatar?: string;
  bio: string;
  gender: 'male' | 'female' | 'other';
  address: {
    city?: string;
    state?: string;
    country?: string;
  };
  interests: string[];
  occupation?: string;
  education?: string;
  followers: string[];
  following: string[];
  followersCount: number;
  followingCount: number;
  repostedPosts: string[];
  postsCount: number;
}

interface IPost {
  _id: string;
  imageUrls: string[];
  videoUrl: string;
  user: {
    avatar: string;
    username: string;
  };
  createdAt: string;
  likesCount: number;
  likes: string[];
  content: string;
  
}

const Profile = () => {
  const navigate = useNavigate();
  const { username: urlUsername } = useParams<{ username: string }>();

  const currentUsername = localStorage.getItem('username');
  const username = urlUsername || currentUsername;

  const [user, setUser] = useState<IUserProfile | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const getUserIdFromToken = (): string => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded.id;
      } catch (error) {
        console.error('Error decoding token:', error);
        return '';
      }
    }
    return '';
  };

  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!username) {
      setError('Имя пользователя не найдено');
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Токен не найден');

        const response = await axios.get<{ data: IUserProfile }>(
          `http://localhost:3333/api/profile/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userProfile = response.data.data;
        setUser(userProfile);
        console.log(userProfile)
        setAvatar(userProfile.avatar || '');

        // Установить статус подписки
        setIsFollowing(userProfile.followers.includes(userId));
      } catch (err) {
        setError('Ошибка загрузки профиля');
      } finally {
        setLoading(false);
      }
    };

    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Токен не найден');

        const response = await axios.get<{ data: IPost[] }>(
          `http://localhost:3333/api/post/user-posts/${username}`,
          {
            headers: {
              Authorization: ` Bearer ${token}`,
            },
          }
        );
        setPosts(response.data.data);
      } catch (err) {
        setError('Ошибка загрузки постов');
      }
    };

    const fetchData = async () => {
      await fetchProfile();
      await fetchPosts();
    };

    fetchData();
  }, [username, userId]);

  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Токен не найден');

      const response = await axios.post(
        `http://localhost:3333/api/follow/${username}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsFollowing((prev) => !prev);
      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              followersCount: isFollowing
                ? prevUser.followersCount - 1
                : prevUser.followersCount + 1,
            }
          : null
      );
    } catch (error) {
      console.error('Ошибка подписки/отписки:', error);
      setError('Ошибка выполнения действия');
    }
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Токен не найден');

      const response = await axios.post(
        'http://localhost:3333/api/upload-avatar',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const avatarUrl = response.data.data.avatar;
      setAvatar(avatarUrl);
    } catch (err) {
      setError('Ошибка загрузки аватара');
    }
  };

  const handlePostModal = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>Профиль не найден</p>;

  const profileLink: string = `${window.location.origin}/profile/${user.user.username}`;
  const canEditProfile = user.user.username === currentUsername;

  return (
    <div className="w-full max-w-6xl px-4 py-8 mx-auto">
      <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8">
        <div
          className="relative flex items-center justify-center w-24 h-24 mt-2 ml-4 mr-6 bg-gray-300 rounded-full cursor-pointer sm:w-28 sm:h-28 md:w-32 md:h-32"
          onClick={() =>
            canEditProfile && document.getElementById('avatarInput')?.click()
          }
        >
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full rounded-full"
            />
          ) : (
            <span className="text-gray-500">Фото</span>
          )}
          <input
            type="file"
            id="avatarInput"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
            disabled={!canEditProfile}
          />
        </div>

        <div className="flex flex-col items-center md:items-start">
          <div className="flex flex-col items-end space-y-2 md:flex-row md:space-y-0 md:space-x-5">
            <h2 className="text-lg font-semibold sm:text-2xl md:text-3xl lg:text-4xl">
              {user.user.username}
            </h2>
            {canEditProfile ? (
              <Button
                variant="secondary"
                className="p-1 text-black bg-gray-300 hover:bg-gray-300"
                onClick={() => navigate('/profile-info')}
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="pb-[3px] p-1b text-zinc-950"
                onClick={handleFollowToggle}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </div>
          <div className="flex justify-center mt-3 space-x-4 text-xs sm:text-sm md:text-base md:justify-start">
            <span>
              <strong>{user.postsCount}</strong> posts
            </span>
            <span>
              <strong>{user.followersCount}</strong> followers
            </span>
            <span>
              <strong>{user.followingCount}</strong> following
            </span>
          </div>

          <p className="mt-3 text-xs sm:text-sm md:text-base">{user.bio}</p>

          <Button
            variant="secondary"
            className="mt-2 text-xs text-blue-500 sm:text-sm md:text-base"
            onClick={() => navigator.clipboard.writeText(profileLink)}
          >
            {profileLink}
          </Button>
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="z-20 w-full bg-gray-200 aspect-square overflow-y-clip"
          >
            <MediaSlider
              onClick={() => handlePostModal(post._id)}
              media={
                post.imageUrls.length > 0 ? post.imageUrls : [post.videoUrl]
              }
              avatar={avatar || ''}
              author={post.user?.username || ''}
              date={new Date(post.createdAt).toDateString()}
              likecount={post.likesCount}
              description={post.content}
              postId={post._id}
              userId={userId}
              likes={post.likes}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;

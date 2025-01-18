

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../../ui/button';
import MediaSlider from '../../components/post';


import foto from '../../assets/icons/InStack.svg';
import foto1 from '../../assets/icons/lock_pass.svg';
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
}

const Profile = () => {
  const media: string[] = [
    'https://res.cloudinary.com/demo/image/upload/v1605072189/sample.jpg', // Пример изображения
    foto1, // Локальное изображение
    foto, // Локальное изображение
  ];

  // Данные для автора, аватара и даты
  const author = 'John Doe';
  const avatars = 'https://example.com/avatar.jpg'; // Пример URL аватара
  const date = '2025'; // Пример даты
const likecount=25
  const desscription= 'Lorem ygvhndxyrcgf'
  const navigate = useNavigate();
  const { username: urlUsername } = useParams<{ username: string }>();

  const currentUsername = localStorage.getItem('username');
  const username = urlUsername || currentUsername; // Если имя пользователя не указано в URL, берем из localStorage
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [avatar, setAvatar] = useState<string | null>(null);

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

        // Получаем профиль пользователя
        const response = await axios.get<{ data: IUserProfile }>(
          `http://localhost:3333/api/profile/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const userProfile = response.data.data;
        setUser(userProfile);

        // Получаем аватар по username
        const avatarUrl = userProfile.avatar || '';
        setAvatar(avatarUrl);
      } catch (err) {
        setError('Ошибка загрузки профиля');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

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

      // Загружаем новый аватар
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

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>Профиль не найден</p>;

  const profileLink: string = `${window.location.origin}/profile/${user.user.username}`;

  // Проверка, чтобы разрешить редактирование только для текущего пользователя
  const canEditProfile = user.user.username === currentUsername;

  return (
    <div className="w-full max-w-6xl px-4 py-8 mx-auto">
      <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8">
        {/* Аватар */}
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
            disabled={!canEditProfile} // Отключаем возможность изменения аватара для других пользователей
          />
        </div>

        {/* Данные профиля */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-5">
            <h2 className="text-lg font-semibold sm:text-2xl md:text-3xl lg:text-4xl">
              {user.user.username}
            </h2>
            {canEditProfile && (
              <Button
                variant="secondary"
                className="p-1 text-black bg-gray-300 hover:bg-gray-300"
                onClick={() => navigate('/profile-info')}
              >
                Edit Profile
              </Button>
            )}
          </div>
          <div className="flex justify-center mt-3 space-x-4 text-xs sm:text-sm md:text-base md:justify-start">
            <span>
              <strong>{user.repostedPosts.length}</strong> posts
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
        {Array(9)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="z-20 w-full bg-gray-200 aspect-square overflow-y-clip"
            >
              <MediaSlider
                media={media}
                avatar={avatars}
                author={author}
                date={date}
                likecount={likecount}
                desscription={desscription}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Profile;
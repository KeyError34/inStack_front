import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from '../../components/modal';
import Button from '../../ui/button';
import Input from '../../ui/input';

const ModalData = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState('');

  // Определяем, открыта ли модалка, по URL
  const isModalOpen = location.pathname === '/create';
  const isShareModalOpen = location.pathname === '/create/share';

  // Загрузка изображения
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <>
      {/* Пункт меню для открытия модалки */}
      {/* <Button variant="primary" onClick={() => navigate('/create')}>
        Open Create Post Modal
      </Button> */}

      {/* Первая модалка */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => navigate('/')}
        title="Create Post"
        modal={
          <Button variant="secondary" onClick={() => navigate('/create/share')}>
            Share
          </Button>
        }
      >
        <div className="flex w-full mt-4 h-96">
          {/* Загрузка изображения */}
          <div className="flex items-center justify-center w-1/2 border-r">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <label className="text-blue-500 cursor-pointer">
                Upload Image
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          {/* Поле для комментариев */}
          <div className="flex flex-col w-1/2 pl-4 border-b border-gray-300 h-[50%]">
            <Input
              type="textarea"
              className="border-none min-h-1/2 focus:outline-none"
              placeholder="Write your comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Вторая модалка */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => navigate('/')}
        title="Share Post"
      >
        <div className="flex flex-col gap-4">
          <Button variant="secondary" onClick={() => navigate('/create')}>
            Back to Create Post
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              alert('Post Created!');
              navigate('/');
            }}
          >
            Create Post
          </Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ModalData;

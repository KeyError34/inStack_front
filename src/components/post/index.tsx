import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

interface MediaSliderProps {
  media: string[]; // Список ссылок на изображения или видео
  avatar: string; // Ссылка на изображение аватара
  author: string; // Имя автора
  date: string; // Дата создания
  likecount: number;
  desscription: string;
}

const MediaSlider: React.FC<MediaSliderProps> = ({
  media,
  avatar,
  author,
  date,
  likecount,
  desscription,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (media.length === 0) return null; // Если массив пуст, ничего не рендерим

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true, // Включаем поддержку для мыши
  });

  // Функция для определения типа контента по расширению URL
  const getMediaType = (url: string) => {
    if (url.endsWith('.mp4') || url.endsWith('.mov')) {
      return 'video';
    }
    return 'image'; // все остальные — изображения
  };

  return (
    <div className="border border-gray-300 rounded-lg">
      <div className="relative p-4 mx-auto bg-gray-200 ">
        {/* Верхний белый блок */}
        <div className="absolute top-0 left-0 right-0 flex items-center p-4 space-x-2 bg-white rounded-t-lg">
          <img
            src={avatar}
            alt="Author Avatar"
            className="object-cover w-10 h-10 rounded-full"
          />
          <div className="flex flex-col pl-6">
            <p className="font-semibold">{author}</p>
            <span className="text-sm text-gray-500">{date}</span>
          </div>
        </div>

        {/* Media Section */}
        <div
          {...swipeHandlers}
          className="justify-center w-full mt-16 bg-gray-200 ems-center abflex h-80 " // Установим фиксированную высоту для стабильности
        >
          {getMediaType(media[currentIndex]) === 'video' ? (
            <video controls className="object-contain w-full h-full">
              <source src={media[currentIndex]} type="video/mp4" />
            </video>
          ) : (
            <img
              src={media[currentIndex]}
              alt={`Slide ${currentIndex}`}
              className="object-contain w-full h-full"
            />
          )}
        </div>

        {/* Дот-индикаторы */}
        {media.length > 1 && (
          <div className="absolute flex space-x-2 transform -translate-x-1/2 bottom-4 left-1/2">
            {media.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ease-in-out duration-300 ${
                  currentIndex === index
                    ? 'bg-white scale-125'
                    : 'bg-gray-500 hover:bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col p-4 space-x-2 bg-white fitems-center">
        {/* нужно сделать кнопкой */}
        <div className="flex p-2">
          <img src="#" alt="like" className="object-cover w-10 h-10" />
          <p className="font-semibold">{likecount} likes</p>
        </div>
        <div className="flex p-0">
          <span className="text-sm text-gray-500">{desscription}</span>
        </div>
      </div>
    </div>
  );
};

export default MediaSlider;
// import React, { useState } from 'react';
// import { useSwipeable } from 'react-swipeable';

// interface MediaSliderProps {
//   media: string[]; // Список ссылок на изображения или видео
//   avatar: string;
//   author: string;
//   date: string;
// }

// const MediaSlider: React.FC<MediaSliderProps> = ({
//   media,
//   avatar,
//   author,
//   date,
// }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   if (media.length === 0) return null;

//   const nextSlide = () => {
//     setCurrentIndex((prev) => (prev + 1) % media.length);
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
//   };

//   const swipeHandlers = useSwipeable({
//     onSwipedLeft: nextSlide,
//     onSwipedRight: prevSlide,

//     trackMouse: true,
//   });

//   const getMediaType = (url: string) => {
//     if (url.endsWith('.mp4') || url.endsWith('.mov')) {
//       return 'video';
//     }
//     return 'image';
//   };

//   return (
//     <div className="relative z-10 w-full max-w-xs mx-auto overflow-hidden bg-gray-200 rounded-lg h-80">
//       {/* Верхний блок с аватаром, именем и датой */}
//       <div className="absolute z-20 flex items-center space-x-3 top-4 left-4">
//         <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full" />
//         <div className="flex flex-col text-sm text-white">
//           <span>{author}</span>
//           <span>{date}</span>
//         </div>
//       </div>

//       {/* Слайдер */}
//       <div
//         {...swipeHandlers}
//         className="relative z-10 flex items-center justify-center w-full h-full"
//       >
//         {getMediaType(media[currentIndex]) === 'video' ? (
//           <video controls className="object-cover w-full h-full">
//             <source src={media[currentIndex]} type="video/mp4" />
//           </video>
//         ) : (
//           <img
//             src={media[currentIndex]}
//             alt={`Slide ${currentIndex}`}
//             className="object-cover w-full h-full"
//           />
//         )}
//       </div>

//       {/* Дот-индикаторы */}
//       {media.length > 1 && (
//         <div className="absolute z-20 flex space-x-2 transform -translate-x-1/2 bottom-4 left-1/2">
//           {media.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentIndex(index)}
//               className={`w-3 h-3 rounded-full transition-all ease-in-out duration-300 ${
//                 currentIndex === index
//                   ? 'bg-white scale-125'
//                   : 'bg-gray-500 hover:bg-gray-300'
//               }`}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MediaSlider;

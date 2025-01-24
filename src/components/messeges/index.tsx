// import React, { useState, useEffect } from 'react';
// import { io, Socket } from 'socket.io-client';

// // Типы для TypeScript
// interface Chat {
//   _id: string;
//   participants: string[];
// }

// interface Message {
//   sender: string;
//   content: string;
//   createdAt: string;
// }

// const Messenger: React.FC = () => {
//   const loggedInUsername = localStorage.getItem('username') || ''; // Залогиненный пользователь
//   const otherUsername =
//     new URLSearchParams(window.location.search).get('username') || 'gogo'; // Пользователь из URL

//   const [chatId, setChatId] = useState<string>('');
//   const [message, setMessage] = useState<string>('');
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [socket, setSocket] = useState<Socket | null>(null);

//   // Установим соединение с сервером
//   useEffect(() => {
//     const newSocket = io('http://localhost:3333', {
//       transports: ['websocket'], // Указываем транспорт WebSocket
//       autoConnect: false, // Не подключаемся автоматически
//     });

//     setSocket(newSocket);

//     // Подключение к серверу
//     newSocket.connect();

//     newSocket.on('connect', () => {
//       console.log('Connected to the server');
//       if (loggedInUsername) {
//         newSocket.emit('register', loggedInUsername); // Регистрация пользователя
//       }
//     });

//     newSocket.on('chatCreated', (chat: Chat) => {
//       setChats((prevChats) => [...prevChats, chat]);
//       setChatId(chat._id);
//     });

//     newSocket.on('newMessage', (message: Message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     newSocket.on('error', (error: string) => {
//       alert(`Error: ${error}`);
//     });

//     return () => {
//       newSocket.disconnect();
//       newSocket.off();
//     };
//   }, [loggedInUsername]);

//   // Функция для создания чата
//   const createChat = () => {
//     if (socket && loggedInUsername && otherUsername) {
//       socket.emit('createChat', { loggedInUsername, otherUsername });
//     } else {
//       alert('Both usernames are required to start a chat');
//     }
//   };

//   // Функция для отправки сообщения
//   const sendMessage = () => {
//     if (socket && message.trim() && chatId) {
//       socket.emit('sendMessage', { chatId, message });
//       setMessage('');
//     }
//   };

//   return (
//     <div>
//       <h2>Messenger</h2>

//       {/* Вывод информации о текущем пользователе и собеседнике */}
//       <div>
//         <p>
//           Logged in as: <strong>{loggedInUsername}</strong>
//         </p>
//         <p>
//           Chatting with: <strong>{otherUsername || 'No user selected'}</strong>
//         </p>
//       </div>

//       {/* Создание чата */}
//       {loggedInUsername && otherUsername && (
//         <button onClick={createChat}>Start Chat with {otherUsername}</button>
//       )}

//       {/* Список чатов */}
//       <div>
//         <h3>Chats</h3>
//         <ul>
//           {chats.map((chat) => (
//             <li key={chat._id}>
//               Chat ID: {chat._id}, Participants: {chat.participants.join(', ')}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Отправка сообщений */}
//       {chatId && (
//         <div>
//           <h3>Messages</h3>
//           <div>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Write a message"
//             />
//             <button onClick={sendMessage}>Send</button>
//           </div>

//           <div>
//             <h4>Chat Messages:</h4>
//             <ul>
//               {messages.map((msg, index) => (
//                 <li key={index}>
//                   <strong>{msg.sender}: </strong>
//                   {msg.content}{' '}
//                   <em>{new Date(msg.createdAt).toLocaleTimeString()}</em>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Messenger;

import { io, Socket } from 'socket.io-client';
const Messenger = () => {
  // Подключение к серверу
  const socket: Socket = io('http://localhost:3000', {
    auth: {
      token: localStorage.getItem('token'), // Передаем токен для аутентификации
    },
  });

  // Событие успешного соединения
  socket.on('connect', () => {
    console.log('Connected to server with id:', socket.id);
  });

  // Событие ошибки при подключении (например, неверный токен)
  socket.on('connect_error', (error: Error) => {
    console.error('Connection failed:', error.message);
  });

  // Событие отключения
  socket.on('disconnect', (reason: string) => {
    console.log('Disconnected:', reason);
  });

  // Проверка соединения
  if (socket.connected) {
    console.log('Socket is connected!');
  } else {
    console.log('Socket is not connected.');
  }
  return <>lkjk</>;
}

export default Messenger;
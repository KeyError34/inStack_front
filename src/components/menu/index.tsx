import { Routes, Route } from 'react-router-dom';
import {
  HomeIcon,
  SearchIcon,
  ExploreIcon,
  MessagesIcon,
  NotificationIcon,
  CreateIcon,
  ProfileIcon,
} from '../../assets/menu_icons/index';
import MenuItem from '../../ui/menu_item/index';
import Home from '../../pages/main/index';
import Search from '../../pages/search/index';
import Explore from '../../pages/explore/index';
import Messages from '../../pages/messages/index';
import Notification from '../../pages/notification/index';
import Create from '../../pages/explore/index';
import Profile from '../../pages/profile/index';

const Menu = () => {
  const menuItems = [
    { name: 'Home', path: '/', icon: <HomeIcon /> },
    { name: 'Search', path: '/search', icon: <SearchIcon /> },
    { name: 'Explore', path: '/explore', icon: <ExploreIcon /> },
    { name: 'Messages', path: '/messages', icon: <MessagesIcon /> },
    {
      name: 'Notifications',
      path: '/notification',
      icon: <NotificationIcon />,
    },
    {
      name: 'Create',
      path: '/create',
      icon: <CreateIcon />,
      hideOnMobile: true,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: <ProfileIcon />,
      hideOnMobile: true,
    },
  ];

  return (
    <div className="flex flex-row w-full">
      {/* Меню на больших экранах - показываем ВСЕ элементы */}
      <div className="hidden p-3 bg-white border-r md:flex md:flex-col w-max">
        {menuItems.map(({ name, path, icon }) => (
          <MenuItem
            key={path}
            name={name}
            path={path}
            icon={icon}
            isMobile={false}
          />
        ))}
      </div>

      {/* Меню на мобильных устройствах - скрываем Create и Profile */}
      <div className="fixed bottom-0 left-0 w-full p-3 bg-white border-t md:hidden">
        <div className="flex justify-around">
          {menuItems
            .filter(({ hideOnMobile }) => !hideOnMobile) // Фильтруем скрытые элементы
            .map(({ name, path, icon }) => (
              <MenuItem
                key={path}
                name={name}
                path={path}
                icon={icon}
                isMobile={true}
              />
            ))}
        </div>
      </div>

      {/* Контент страницы */}
      <div className="flex ml-[20%] pt-3 px-3 w-full">
        <Routes>
          {menuItems.map(({ path }) => (
            <Route
              key={path}
              path={path}
              element={
                path === '/' ? (
                  <Home />
                ) : path === '/search' ? (
                  <Search />
                ) : path === '/explore' ? (
                  <Explore />
                ) : path === '/messages' ? (
                  <Messages />
                ) : path === '/notification' ? (
                  <Notification />
                ) : path === '/create' ? (
                  <Create />
                ) : path === '/profile' ? (
                  <Profile />
                ) : null
              }
            />
          ))}
        </Routes>
      </div>
    </div>
  );
};

export default Menu;

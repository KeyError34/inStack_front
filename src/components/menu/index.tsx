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

const Menu = () => {
  const username =localStorage.getItem('username')
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
      path: `/profile/${username}`,
      icon: <ProfileIcon />,
      hideOnMobile: true,
    },
  ];

  return (
    <div className="flex flex-row w-20%">
      {/* Меню на больших экранах */}
      <div className="z-50 hidden p-3 bg-white border-r md:flex md:flex-col w-max z-2000">
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

      {/* Меню на мобильных устройствах */}
      <div className="fixed bottom-0 left-0 z-50 w-full p-3 bg-white border-t md:hidden">
        <div className="flex justify-around">
          {menuItems
            .filter(({ hideOnMobile }) => !hideOnMobile)
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
      
    </div>
  );
};

export default Menu;

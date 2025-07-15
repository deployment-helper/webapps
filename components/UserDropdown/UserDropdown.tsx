'use client';

import {
  Avatar,
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  tokens,
} from '@fluentui/react-components';
import { Person24Regular, SignOut24Regular } from '@fluentui/react-icons';
import { useRouter } from 'next/navigation';
import useSlidesStore from '@/src/stores/store';

export const UserDropdown = () => {
  const router = useRouter();
  const { user } = useSlidesStore();

  const handleProfileClick = () => {
    // Navigate to profile page - assuming /auth/profile route
    router.push('/auth/profile');
  };

  const handleLogoutClick = () => {
    // Clear user session and redirect to auth page
    // In a real app, you'd also clear authentication tokens/cookies
    router.push('/auth');
  };

  return (
    <Menu positioning="below-end">
      <MenuTrigger disableButtonEnhancement>
        <Button 
          style={{ 
            border: 'none', 
            backgroundColor: 'transparent',
            padding: 0, 
            minWidth: 'auto', 
            height: 'auto' 
          }}
        >
          <Avatar
            className="cursor-pointer"
            image={{
              src: 'https://placekitten.com/32/32',
              as: 'img',
            }}
          />
        </Button>
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          <div 
            style={{ 
              padding: '8px 12px',
              borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
              pointerEvents: 'none' 
            }}
          >
            <Avatar
              size={40}
              image={{
                src: 'https://placekitten.com/40/40',
                as: 'img',
              }}
            />
            <div 
              style={{
                fontSize: '12px',
                color: tokens.colorNeutralForeground2,
                marginTop: '4px',
              }}
            >
              {user?.email || 'user@example.com'}
            </div>
          </div>

          <MenuItem 
            icon={<Person24Regular />}
            onClick={handleProfileClick}
          >
            Profile
          </MenuItem>

          <MenuItem 
            icon={<SignOut24Regular />}
            onClick={handleLogoutClick}
          >
            Logout
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

export default UserDropdown;
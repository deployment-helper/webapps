import BaseHeader from '@/components/BaseHeader/BaseHeader';
import { mergeClasses } from '@fluentui/react-components';
import { useStyles } from './Header.styles';
import { Navigation24Filled } from '@fluentui/react-icons';
import { HeaderProps } from '@/components/Header/Header.types';
import UserDropdown from '@/components/UserDropdown';

export const Header2 = ({ title }: HeaderProps) => {
  const classes = useStyles();

  return (
    <BaseHeader
      slot1={
        <Navigation24Filled
          className={mergeClasses(classes.title, 'cursor-pointer')}
        />
      }
      slot3={
        <div>
          <UserDropdown />
        </div>
      }
    />
  );
};

export default Header2;

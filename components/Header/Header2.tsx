import BaseHeader from '@/components/BaseHeader/BaseHeader';
import { Avatar, mergeClasses } from '@fluentui/react-components';
import { useStyles } from './Header.styles';
import { Navigation24Filled } from '@fluentui/react-icons';
import { HeaderProps } from '@/components/Header/Header.types';

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
          <Avatar
            className="cursor-pointer"
            image={{
              src: 'https://placekitten.com/32/32',
              as: 'img',
            }}
          />
        </div>
      }
    />
  );
};

export default Header2;

import BaseHeader from '@/components/BaseHeader/BaseHeader';
import { mergeClasses, Subtitle1 } from '@fluentui/react-components';
import { useStyles } from './Header.styles';
import { HeaderProps } from '@/components/Header/Header.types';

export const Header1 = ({ title }: HeaderProps) => {
  const classes = useStyles();

  return (
    <BaseHeader
      slot1={
        <Subtitle1 className={mergeClasses(classes.title)}>{title}</Subtitle1>
      }
    />
  );
};

export default Header1;

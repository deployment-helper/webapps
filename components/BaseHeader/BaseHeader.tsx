import { ReactNode } from 'react';
import { mergeClasses } from '@fluentui/react-components';
import { useStyles } from './BaseHeader.style';

export const BaseHeader = ({ slot1, slot2, slot3 }: IBaseHeaderProps) => {
  const classes = useStyles();
  return (
    <header
      className={mergeClasses(
        classes.root,
        'flex h-12 w-full items-center justify-between pb-2 pl-4 pr-4 pt-2',
      )}
    >
      <div className={'flex gap-1.5'}>
        {slot1}
        {slot2}
      </div>
      {slot3}
    </header>
  );
};

export interface IBaseHeaderProps {
  slot1: ReactNode;
  slot2?: ReactNode;
  slot3?: ReactNode;
}

export default BaseHeader;

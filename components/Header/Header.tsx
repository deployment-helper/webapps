'use client';

import { FC } from 'react';

import { HeaderProps } from './Header.types';
import { usePathname } from 'next/navigation';
import Header1 from '@/components/Header/Header1';
import Header2 from '@/components/Header/Header2';
import Header3 from '@/components/Header/Header3';
import Header4 from '@/components/Header/Header4';

export const Header: FC<HeaderProps> = (props) => {
  const path = usePathname();
  const getHeaderContent = () => {
    if (path === '/auth') {
      return <Header1 {...props} />;
    } else if (path === '/auth/projects') {
      return <Header2 {...props} />;
    } else if (/\/auth\/projects\/.*\/video\/.*/.test(path)) {
      return <Header4 {...props} />;
    } else if (/\/auth\/projects\/.*/.test(path)) {
      return <Header3 {...props} />;
    }
  };
  return getHeaderContent();
};

export default Header;

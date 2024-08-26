import { FC } from 'react';

export const List: FC<IListProps> = ({ children }) => {
  return <div className={'flex flex-col gap-1 p-1'}>{children} </div>;
};

export interface IListProps {
  children?: React.ReactNode;
}

export default List;

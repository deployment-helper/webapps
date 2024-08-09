import { FC } from 'react';

export const ListItem: FC<IListItemProps> = ({ children }) => {
  return (
    <div
      className={
        'flex cursor-pointer items-center bg-gray-200 p-2 hover:bg-gray-300'
      }
    >
      {children}{' '}
    </div>
  );
};

export interface IListItemProps {
  children?: React.ReactNode;
}

export default ListItem;

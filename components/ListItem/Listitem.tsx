import { FC } from 'react';

export const ListItem: FC<IListItemProps> = ({ children }) => {
  return (
    <div className={'cursor-pointer bg-gray-200 p-2 hover:bg-gray-300'}>
      {children}{' '}
    </div>
  );
};

export interface IListItemProps {
  children?: React.ReactNode;
}

export default ListItem;

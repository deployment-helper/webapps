import { FC } from 'react';

export const ListItem: FC<IListItemProps> = ({ children, selected }) => {
  return (
    <div
      className={`flex cursor-pointer items-center ${
        selected ? 'bg-gray-400' : 'bg-gray-200'
      } p-2 hover:bg-gray-300`}
    >
      {children}{' '}
    </div>
  );
};

export interface IListItemProps {
  children?: React.ReactNode;
  selected?: boolean;
}

export default ListItem;

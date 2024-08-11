import { FC } from 'react';

export const ListItem: FC<IListItemProps> = ({
  children,
  selected,
  onClick,
}) => {
  return (
    <div
      className={`flex cursor-pointer items-center ${
        selected ? 'bg-violet-200' : 'bg-violet-50'
      } p-2 hover:bg-violet-200`}
      onClick={onClick}
    >
      {children}{' '}
    </div>
  );
};

export interface IListItemProps {
  children?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

export default ListItem;

import { FC } from 'react';

export const List: FC<IListProps> = ({ children, listDir = 'column' }) => {
  return (
    <div
      className={`flex ${
        listDir === 'row' ? 'flex-row' : 'flex-col'
      } flex-wrap gap-1 p-1`}
    >
      {children}{' '}
    </div>
  );
};

export interface IListProps {
  children?: React.ReactNode;
  listDir?: 'row' | 'column';
}

export default List;

import { Delete20Filled } from '@fluentui/react-icons';
import useMyToastController from '../MyToast/MyToast.hook';

export function DeleteIcon({
  position = 'top-right',
  onClick,
}: ICopyIconProps) {
  let positionClass = '';
  const { dispatchToast } = useMyToastController();
  switch (position) {
    case 'top-right':
      positionClass = 'absolute right-1 top-1';
      break;
    case 'top-left':
      positionClass = 'absolute left-1 top-1';
      break;
    case 'bottom-right':
      positionClass = 'absolute right-1 bottom-1';
      break;
    case 'bottom-left':
      positionClass = 'absolute left-1 bottom-1';
      break;
    default:
      positionClass = 'absolute right-1 top-1';
  }

  return (
    <div className={`${positionClass} cursor-pointer rounded bg-violet-100`}>
      <Delete20Filled className={'text-red-500'} onClick={onClick} />
    </div>
  );
}

export interface ICopyIconProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  onClick: () => void;
}

export default DeleteIcon;

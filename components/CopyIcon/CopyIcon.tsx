import { Copy32Filled } from '@fluentui/react-icons';
import useMyToastController from '../MyToast/MyToast.hook';

export function CopyIcon({ position = 'top-right', copyText }: ICopyIconProps) {
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
    <div className={`${positionClass} cursor-pointer rounded bg-amber-200`}>
      <Copy32Filled
        onClick={() => {
          navigator.clipboard.writeText(copyText).then(() => {
            dispatchToast({
              title: 'Copied',
              body: copyText,
              intent: 'success',
            });
          });
        }}
      />
    </div>
  );
}

export interface ICopyIconProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  copyText: string;
}

export default CopyIcon;

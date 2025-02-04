import useMyToastController from '../MyToast/MyToast.hook';
import { Copy24Filled } from '@fluentui/react-icons';

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
    <div
      className={`${positionClass} z-10 cursor-pointer rounded bg-violet-100`}
    >
      <Copy24Filled
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

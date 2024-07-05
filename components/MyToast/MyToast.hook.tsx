import { useToastController } from '@fluentui/react-components';
import MyToast, { IMyToastProps } from '@/components/MyToast/MyToast';

export const TOAST_ID = 'my-toast';

export function useMyToastController() {
  const { dispatchToast } = useToastController(TOAST_ID);
  return {
    dispatchToast: ({ title, body, intent = 'success' }: IMyToastProps) => {
      dispatchToast(<MyToast title={title} body={body} intent={intent} />, {
        intent,
        position: 'bottom-start',
        timeout: 10000,
      });
    },
  };
}

export default useMyToastController;

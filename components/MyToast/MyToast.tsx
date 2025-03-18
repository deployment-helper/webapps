import { Toast, ToastBody, ToastTitle } from '@fluentui/react-components';
import { ToastIntent } from '@fluentui/react-toast';

export function MyToast({ title, body, intent = 'success' }: IMyToastProps) {
  return (
    <Toast>
      <ToastTitle>{title}</ToastTitle>
      <ToastBody>{body}</ToastBody>
    </Toast>
  );
}

export interface IMyToastProps {
  title: string;
  body: string;
  intent?: ToastIntent;
}

export default MyToast;

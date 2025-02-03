import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Spinner,
} from '@fluentui/react-components';
import { ArrowLeft32Filled } from '@fluentui/react-icons';

interface DrawerHOCProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  isPending?: boolean;
}

const DrawerHOC: React.FC<DrawerHOCProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  isPending,
}) => {
  return (
    <Drawer
      type={'overlay'}
      onOpenChange={onClose}
      open={isOpen}
      position={'end'}
      size={'medium'}
    >
      <DrawerHeader>
        <DrawerHeaderTitle>
          <div>
            <ArrowLeft32Filled
              className={
                'cursor-pointer pr-2 text-4xl text-gray-700 hover:text-gray-900'
              }
              onClick={onClose}
            />
            {title}
          </div>
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody>{children}</DrawerBody>
      <DrawerFooter>
        <div className={'flex w-full justify-end gap-2'}>
          <Button onClick={onClose} appearance={'secondary'} size={'large'}>
            Cancel
          </Button>
          {onSubmit && (
            <Button onClick={onSubmit} appearance={'primary'} size={'large'}>
              Submit
              {isPending && <Spinner size={'small'} />}
            </Button>
          )}
        </div>
      </DrawerFooter>
    </Drawer>
  );
};

export default DrawerHOC;

import { useForm, Controller } from 'react-hook-form';
import {
  Body2,
  Button,
  Caption1,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Input,
  Label,
  Textarea,
} from '@fluentui/react-components';
import { useRef } from 'react';
import { IVideo } from '@/src/types/video.types';

export function FormAddVideo({
  isOpen,
  onClose,
  onSubmit,
  projectId,
  projectName,
}: IFormAddProjectProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      projectId: '',
      projectName: '',
      properties: '',
    },
    values: {
      projectId: projectId,
      projectName: projectName,
    },
  });

  const formRef = useRef<HTMLFormElement>(null);
  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };
  // TODO: color red for required fields
  return (
    <div>
      <Drawer
        type={'overlay'}
        onOpenChange={onClose}
        open={isOpen}
        position={'end'}
        size={'medium'}
      >
        <DrawerHeader>
          <DrawerHeaderTitle>Add Video</DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          <form ref={formRef} onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="flex flex-col gap-4">
              <div>
                <Controller
                  name="projectId"
                  control={control}
                  render={({ field }) => <input {...field} type="hidden" />}
                />
              </div>
              <div>
                <Controller
                  name="projectName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      id="projectName"
                      placeholder="Project Name"
                      className={'w-full'}
                      disabled={!!projectId}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      id="videoName"
                      placeholder="video Name"
                      className={'w-full'}
                    />
                  )}
                />
                {errors.name && <Label>This field is required</Label>}
              </div>
              <div>
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="videoDescription"
                      placeholder="Video Description"
                      className={'w-full'}
                    />
                  )}
                />
                {errors.description && <Label>This field is required</Label>}
              </div>
              <div>
                <div className={'flex flex-col'}>
                  <Body2>Properties</Body2>
                  <Caption1>
                    Video object other properties can be passed here.
                  </Caption1>
                </div>

                <Controller
                  name={'properties'}
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id={'properties'}
                      className={'w-full'}
                      placeholder={
                        'Enter properties here in form of ENV variables'
                      }
                      rows={6}
                    />
                  )}
                />
              </div>
            </div>
          </form>
        </DrawerBody>
        <DrawerFooter>
          <div className={'flex w-full justify-end gap-5'}>
            <Button size={'large'} onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => {
                formRef.current?.requestSubmit();
              }}
              size={'large'}
              appearance={'primary'}
            >
              Submit
            </Button>
          </div>
        </DrawerFooter>
      </Drawer>
    </div>
  );
}

interface IFormAddProjectProps {
  isOpen: boolean;
  projectId?: string;
  projectName?: string;
  onClose: () => void;
  onSubmit: (data: Partial<IVideo>) => void;
}
export default FormAddVideo;

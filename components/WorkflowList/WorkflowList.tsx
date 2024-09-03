import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Input,
} from '@fluentui/react-components';
import { SUPPORTED_WORKFLOWS, WORKFLOWS } from '@/src/constants';
import List from '@/components/List/List';
import { ListItem } from '@/components/ListItem';
import { useRef, useState } from 'react';
import { ArrowLeft32Filled } from '@fluentui/react-icons';
import { Controller, useForm } from 'react-hook-form';
import { useMutationCreateVideoWithWorkflowYoutubeVideoClone } from '@/src/query/video.query';

export function WorkflowList({ isOpen, onClose }: IWorkflowListProps) {
  const [workflowId, setWorkflowId] = useState<string>('');
  const [workflowName, setWorkflowName] = useState<string>('');
  const { handleSubmit, control } = useForm();
  const formRef = useRef<HTMLFormElement>(null);
  const { mutate: createVideoWithYoutubeVideoClone } =
    useMutationCreateVideoWithWorkflowYoutubeVideoClone();
  const Workflows = () => (
    <List>
      {WORKFLOWS.map((workflow) => (
        <ListItem key={workflow.id}>
          <div
            onClick={() => {
              setWorkflowId(workflow.id);
              setWorkflowName(workflow.name);
            }}
          >
            {workflow.name}
          </div>
        </ListItem>
      ))}
    </List>
  );

  const onSubmit = () => {
    formRef.current?.requestSubmit();
  };

  const youtubeCloneVideoSubmit = (data: any) => {
    createVideoWithYoutubeVideoClone({
      videoURL: data['video-url'],
    });
  };

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
          <DrawerHeaderTitle>
            {workflowId === '' ? (
              'Workflows'
            ) : (
              <div>
                <ArrowLeft32Filled
                  className={
                    'cursor-pointer pr-2 text-4xl text-gray-700 hover:text-gray-900'
                  }
                  onClick={() => {
                    setWorkflowId('');
                    setWorkflowName('');
                  }}
                />
                {workflowName}
              </div>
            )}
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          {workflowId === '' ? (
            <Workflows />
          ) : (
            <div>
              {SUPPORTED_WORKFLOWS.includes(workflowId) &&
                workflowId === 'youtube-video-clone' && (
                  <div>
                    <form
                      ref={formRef}
                      onSubmit={handleSubmit(youtubeCloneVideoSubmit)}
                    >
                      <div>
                        <Controller
                          render={({ field }) => (
                            <Input
                              {...field}
                              required={true}
                              placeholder="Enter youtube video url"
                              className={'w-full'}
                            />
                          )}
                          control={control}
                          name={'video-url'}
                        />
                      </div>
                    </form>
                  </div>
                )}
              {!SUPPORTED_WORKFLOWS.includes(workflowId) && (
                <div className={'bg-red-200 p-2 text-xl'}>
                  {' '}
                  Workflow not supported
                </div>
              )}
            </div>
          )}
        </DrawerBody>
        <DrawerFooter>
          <div className={'flex w-full justify-end gap-2'}>
            <Button onClick={onClose} appearance={'secondary'} size={'large'}>
              Cancel
            </Button>
            {workflowId !== '' && (
              <Button onClick={onSubmit} appearance={'primary'} size={'large'}>
                Submit
              </Button>
            )}
          </div>
        </DrawerFooter>
      </Drawer>
    </div>
  );
}

export interface IWorkflowListProps {
  isOpen: boolean;
  onClose: () => void;
}
export default WorkflowList;

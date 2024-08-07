import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
} from '@fluentui/react-components';
import { WORKFLOWS } from '@/src/constants';
import List from '@/components/List/List';
import { ListItem } from '@/components/ListItem';
import { useState } from 'react';
import { ArrowLeft32Filled } from '@fluentui/react-icons';

export function WorkflowList({ isOpen, onClose }: IWorkflowListProps) {
  const [workflowId, setWorkflowId] = useState<string>('');
  const [workflowName, setWorkflowName] = useState<string>('');

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
              <h3>Workflow Id: {workflowId}</h3>
              <h3>Workflow Name: {workflowName}</h3>
            </div>
          )}
        </DrawerBody>
      </Drawer>
    </div>
  );
}

export interface IWorkflowListProps {
  isOpen: boolean;
  onClose: () => void;
}
export default WorkflowList;

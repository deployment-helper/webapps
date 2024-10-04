import Scene from '@/components/Scene/Scene';
import {
  Button,
  Menu,
  MenuButtonProps,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner,
  SplitButton,
} from '@fluentui/react-components';
import { ELanguage, IScene } from '@/src/types/video.types';
import { useParams } from 'next/navigation';
import { useVideoStore } from '@/src/stores/video.store';
import { useEffect, useState } from 'react';
import { IInput } from '@/src/types/types';
import { DEFAULT_LAYOUT } from '@/src/layouts';
import { CreateSceneWithTextModal } from '@/components/CreateSceneWithTextModal';

export function SceneList(props: ISceneListProps) {
  const params = useParams();
  const setSelectedContent = useVideoStore((state) => state.setSceneContent);
  const selectedSceneId = useVideoStore((state) => state.selectedSceneId);
  const [markerIndex, setMarkerIndex] = useState<number | undefined>(undefined);
  const [scenes, setScenes] = useState<IScene[]>(props.scenes);
  const [draggedSceneIndex, setDraggedSceneIndex] = useState<
    number | undefined
  >(undefined);
  const [isSceneWithTextModalOpen, setIsSceneWithTextModalOpen] =
    useState<boolean>(false);
  const onSceneChange = (
    sceneId: string,
    layoutId: string,
    sceneArrayIndex: number,
    content?: Record<string, IInput>,
  ) => {
    setSelectedContent(layoutId, sceneId, sceneArrayIndex, content);
  };

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    const sceneIndex = e.currentTarget.getAttribute('data-index');
    setDraggedSceneIndex(Number(sceneIndex));
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const markerIndex = e.currentTarget.getAttribute('data-index');
    setMarkerIndex(Number(markerIndex));
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log('Dropped');
    setMarkerIndex(undefined);
    const sceneIndex = e.currentTarget.getAttribute('data-index');
    const targetSceneIndex = Number(sceneIndex);
    console.log('Dragged scene index', draggedSceneIndex);
    console.log('Target scene index', targetSceneIndex);
    props.onSceneReorder?.(draggedSceneIndex!, targetSceneIndex);
    updateScenesOrder(draggedSceneIndex!, targetSceneIndex);
  };

  const updateScenesOrder = (
    sceneArrayIndex: number,
    newSceneArrayIndex: number,
  ) => {
    const newScenes = [...scenes];
    const scene = newScenes.splice(sceneArrayIndex, 1)[0];
    newScenes.splice(newSceneArrayIndex, 0, scene);
    setScenes(newScenes);
  };
  useEffect(() => {
    setScenes(props.scenes);
  }, [props.scenes]);
  useEffect(() => {
    if (props.scenes.length > 0 && !selectedSceneId) {
      const scene = props.scenes[0];
      setSelectedContent(
        scene.layoutId || DEFAULT_LAYOUT.id,
        scene.id,
        0,
        scene.content || DEFAULT_LAYOUT.content,
      );
    }
  }, [selectedSceneId, props.scenes, setSelectedContent]);

  return (
    <div className="flex- flex max-h-screen flex-col items-center overflow-auto pb-10 pt-10">
      <div className="flex flex-col">
        {scenes.map((scene, index) => (
          <Scene
            {...scene}
            videoId={params.video_id as string}
            audioLanguage={props.audioLanguage}
            voiceCode={props.voiceCode}
            key={scene.id}
            onClick={onSceneChange}
            onDragStart={onDragStart}
            onDrop={onDrop}
            onDragOver={onDragOver}
            sceneArrayIndex={index}
            markerIndex={markerIndex}
            sceneDocId={props.sceneDocId}
            layoutId={scene.layoutId || DEFAULT_LAYOUT.id}
            isSelected={scene.id === selectedSceneId}
            onCreateScene={props.createScene}
          />
        ))}
      </div>
      {isSceneWithTextModalOpen && (
        <CreateSceneWithTextModal
          isOpen={isSceneWithTextModalOpen}
          onClose={() => setIsSceneWithTextModalOpen(false)}
          onSceneCreate={(text) => props?.createBulkScenes?.(text)}
        />
      )}
      <Menu positioning="below-end">
        <MenuTrigger disableButtonEnhancement>
          {(triggerProps: MenuButtonProps) => (
            <SplitButton
              className="rounded-md p-2 text-white"
              appearance={'primary'}
              menuButton={triggerProps}
              primaryActionButton={{
                onClick: () => props.createScene(false),
              }}
            >
              {props.isCreating ? <Spinner size="small" /> : 'Create Scene'}
            </SplitButton>
          )}
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem onClick={() => setIsSceneWithTextModalOpen(true)}>
              Create with text
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
}

export interface ISceneListProps {
  createScene: (addAfter: boolean, sceneArrayIndex?: number) => void;
  createBulkScenes?: (text: string) => void;
  isCreating?: boolean;
  isLoading?: boolean;
  scenes: IScene[];
  sceneDocId: string;
  audioLanguage?: ELanguage;
  voiceCode?: string;
  onSceneReorder?: (
    sceneArrayIndex: number,
    newSceneArrayIndex: number,
  ) => void;
}

export default SceneList;

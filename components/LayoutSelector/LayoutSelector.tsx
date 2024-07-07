import {
  SelectTabData,
  SelectTabEvent,
  Tab,
  TabList,
} from '@fluentui/react-tabs';
import { useState } from 'react';
import { debounce } from 'lodash';

import Image from '@/components/Image/Image';

import layouts from '@/src/layouts';
import { useVideoStore } from '@/src/stores/video.store';
import { useMutationUpdateScene } from '@/src/query/video.query';
import { useParams } from 'next/navigation';

import { IInput } from '@/src/types/types';
import RenderLayoutComponent from '@/components/RenderLayoutComponent/RenderLayoutComponent';
import { Video } from '@/components/Video/Video';

let debounceContent: any = undefined;
const LayoutSelector = ({ sceneDocId }: ISceneEditorProps) => {
  const [activeTab, setActiveTab] = useState('1');
  const selectedLayoutId = useVideoStore((state) => state.selectedLayoutId);
  const selectedSceneId = useVideoStore((state) => state.selectedSceneId);
  const sceneContent = useVideoStore((state) => state.sceneContent);
  const sceneArrayIndex = useVideoStore((state) => state.sceneArrayIndex);
  const setSceneContent = useVideoStore((state) => state.setSceneContent);
  const params = useParams();

  const { mutate: updateScene } = useMutationUpdateScene();

  // Select tab
  const onTabSelect = (e: SelectTabEvent, data: SelectTabData) => {
    setActiveTab(data.value as string);
  };

  // Update scene content on server
  const updateSceneContent = (content?: Record<string, IInput>) => {
    if (debounceContent) {
      debounceContent.cancel();
    }
    debounceContent = debounce(updateScene, 1000);
    debounceContent({
      id: params.video_id as string,
      sceneId: sceneDocId,
      sceneArrayIndex,
      data: { content: content || sceneContent },
      invalidate: false,
    });
  };

  // Select layout
  const onLayoutChange = (layoutId: string) => {
    if (layoutId !== selectedLayoutId) {
      const layout = layouts.find((layout) => layout.id === layoutId);
      const newContentTemplate = JSON.parse(JSON.stringify(layout?.content));
      setSceneContent(
        layoutId,
        selectedSceneId,
        sceneArrayIndex,
        newContentTemplate,
      );
    }
  };

  // When image is uploaded to S3 update image URL to content template
  const onUploadSuccess = (url: string, name: string) => {
    setSceneContent(selectedLayoutId, selectedSceneId, sceneArrayIndex, {
      ...sceneContent,
      [name]: {
        ...sceneContent[name],
        value: url,
      },
    });
    // TODO: Commented for now as not needs now
    // createImage();
    updateScene({
      id: params.video_id as string,
      sceneId: sceneDocId,
      layoutId: selectedLayoutId,
      sceneArrayIndex,
      data: {
        image: url,
      },
    });
    updateSceneContent({
      ...sceneContent,
      [name]: {
        ...sceneContent[name],
        value: url,
      },
    });
  };

  // Listener for content data change and update the content in state
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSceneContent(selectedLayoutId, selectedSceneId, sceneArrayIndex, {
      ...sceneContent,
      [e.target.name]: {
        ...sceneContent[e.target.name],
        value: e.target.value,
      },
    });
    updateSceneContent();
  };

  return (
    <div className={'p-4'}>
      <h1 className={'text-xl'}>Layout Selector</h1>
      <TabList
        className={'border-b-2 border-b-gray-500'}
        selectedValue={activeTab}
        onTabSelect={onTabSelect}
      >
        <Tab value={'1'}>Layout</Tab>
        <Tab value={'2'}>Content</Tab>
      </TabList>
      <div>
        {/*Layouts*/}
        {activeTab === '1' && (
          // render current layouts
          <>
            <div>
              <h2>Current Layout</h2>
              <img
                style={{ width: '200px' }}
                src={
                  layouts.find((layout) => layout.id === selectedLayoutId)
                    ?.image
                }
                alt={selectedLayoutId}
              />
            </div>

            {/*Render layouts*/}
            <h2>Layouts</h2>
            <div className={'flex flex-wrap'}>
              {layouts.map((layout) => (
                <div key={layout.id}>
                  <img
                    style={{ width: '200px', cursor: 'pointer' }}
                    className={`p-0.5 ${
                      layout.id === selectedLayoutId
                        ? 'border-2 border-blue-500'
                        : ''
                    }`}
                    src={layout.image}
                    alt={layout.id}
                    onClick={() => onLayoutChange(layout.id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/*Content*/}
        {activeTab === '2' && (
          <>
            <div>
              {/*This image element to render imageToCanvas generate image in this section*/}
              <img id={'canvas'} src={''} />
              {/*Render currently selected component with latest content*/}
              <RenderLayoutComponent
                isDisplayNone={true}
                content={sceneContent}
                sceneId={selectedSceneId}
                layoutId={selectedLayoutId}
              />
            </div>

            <hr className={'my-4'} />
            <div className={'flex flex-col'}>
              {sceneContent &&
                Object.entries(sceneContent).map(([key, value]) => (
                  <div key={key} className={'flex flex-col'}>
                    <label className={'capitalize'} htmlFor={key}>
                      {key}
                    </label>
                    {value.type === 'input' && (
                      <input
                        onChange={onInputChange}
                        type={value.type}
                        name={value.name}
                        value={value.value}
                        placeholder={value.placeholder}
                      />
                    )}
                    {value.type === 'image' && (
                      <Image
                        isViewOnly={false}
                        isCopyable={true}
                        src={value.value as string}
                        onUploadSuccess={(url?: string) => {
                          onUploadSuccess(url || '', value.name);
                        }}
                      />
                    )}
                    {value.type === 'video' && (
                      <Video
                        isViewOnly={false}
                        isCopyable={true}
                        src={value.value as string}
                        onUploadSuccess={(url?: string) => {
                          onUploadSuccess(url || '', value.name);
                        }}
                      />
                    )}
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export interface ISceneEditorProps {
  sceneDocId: string;
}

export { LayoutSelector };
export default LayoutSelector;

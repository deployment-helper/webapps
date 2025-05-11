import {
  SelectTabData,
  SelectTabEvent,
  Tab,
  TabList,
} from '@fluentui/react-tabs';
import { useState } from 'react';
import { debounce } from 'lodash';

import Image from '@/components/Image/Image';
import CopyIcon from '@/components/CopyIcon/CopyIcon';

import { ALLOWED_LAYOUTS, layouts } from '@/src/layouts';
import { useVideoStore } from '@/src/stores/video.store';
import {
  useMutationUpdateScene,
  useQueryGetVideo,
} from '@/src/query/video.query';
import { useParams } from 'next/navigation';

import { IInput } from '@/src/types/types';
import RenderLayoutComponent from '@/components/RenderLayoutComponent/RenderLayoutComponent';
import { Video } from '@/components/Video/Video';

let debounceContent: any = undefined;
const LayoutSelector = ({
  name,
  description,
  sceneDocId,
  visualPrompt,
}: ISceneEditorProps) => {
  const [activeTab, setActiveTab] = useState('1');
  const selectedLayoutId = useVideoStore((state) => state.selectedLayoutId);
  const selectedSceneId = useVideoStore((state) => state.selectedSceneId);
  const sceneContent = useVideoStore((state) => state.sceneContent);
  const sceneArrayIndex = useVideoStore((state) => state.sceneArrayIndex);
  const setSceneContent = useVideoStore((state) => state.setSceneContent);

  const {} = useQueryGetVideo;
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
    const content = {
      ...sceneContent,
      [e.target.name]: {
        ...sceneContent[e.target.name],
        value: e.target.value,
      },
    };

    setSceneContent(
      selectedLayoutId,
      selectedSceneId,
      sceneArrayIndex,
      content,
    );

    updateSceneContent(content);
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
        <Tab value={'3'}>Video</Tab>
      </TabList>
      <div>
        {/*Layouts*/}
        {activeTab === '1' && (
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
              {layouts
                .filter((layout) => ALLOWED_LAYOUTS.includes(layout.id))
                .map((layout) => (
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
            <div className="flex h-[200px] flex-row">
              {/*This image element to render imageToCanvas generate image in this section*/}
              {/* @Depricated and no more in use */}
              {/* <img id={'canvas'} src={''} /> */}
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
                        isAIImage={true}
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

        {/*Video Tab*/}
        {activeTab === '3' && (
          <div className="mt-4">
            <h2 className="mb-4 text-lg font-semibold">Video Settings</h2>
            <div className="space-y-4">
              <div className="relative flex flex-col">
                <label htmlFor="videoTitle" className="mb-1 font-bold">
                  Video Title
                </label>
                <input
                  id="videoTitle"
                  name="videoTitle"
                  className="rounded border bg-gray-50 p-2"
                  type="text"
                  placeholder="No title available"
                  value={name || ''}
                  readOnly
                />
                <CopyIcon copyText={name || ''} position="top-right" />
              </div>

              <div className="relative flex flex-col">
                <label htmlFor="videoDescription" className="mb-1 font-bold">
                  Video Description
                </label>
                <textarea
                  id="videoDescription"
                  name="videoDescription"
                  className="h-24 rounded border bg-gray-50 p-2"
                  placeholder="No description available"
                  value={description || ''}
                  readOnly
                />
                <CopyIcon copyText={description || ''} position="top-right" />
              </div>

              <div className="relative flex flex-col">
                <label htmlFor="videoVisualPrompt" className="mb-1 font-bold">
                  Video Visual Prompt
                </label>
                <textarea
                  id="videoVisualPrompt"
                  name="videoVisualPrompt"
                  className="h-24 rounded border bg-gray-50 p-2"
                  placeholder="No visual prompt available"
                  value={visualPrompt || ''}
                  readOnly
                />
                <CopyIcon copyText={visualPrompt || ''} position="top-right" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export interface ISceneEditorProps {
  sceneDocId: string;
  name?: string;
  description?: string;
  visualPrompt?: string;
}

export { LayoutSelector };
export default LayoutSelector;

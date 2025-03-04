'use client';

import {
  useMutationUpdateProject,
  useQueryGetProject,
} from '@/src/query/video.query';
import {
  Body1,
  Button,
  Checkbox,
  Input,
  Select,
  SelectOnChangeData,
  Spinner,
  Subtitle1,
  Textarea,
  Title1,
  Title2,
} from '@fluentui/react-components';
import List from '@/components/List/List';
import { ListItem } from '@/components/ListItem';
import {
  FilmstripImage24Filled,
  GlobeRegular,
  Group24Filled,
  HeadphonesSoundWave24Filled,
  Prompt24Filled,
  Settings24Filled,
} from '@fluentui/react-icons';
import { ChangeEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { getFileType } from '@/src/helpers';
import Image from '@/components/Image/Image';
import { Video } from '@/components/Video/Video';
import InsertImageModal from '@/components/InsertImageModal/InsertImageModal';
import { SupportedVoices } from '@/components/SupportedVoices';
import Language from '@/components/Language/Language';
import { IProject } from '@/src/types/video.types';
import { SupportedBackgroundMusic } from '@/components/SupportedBackgroundMusic';
import {
  MP3_SPEAKING_RATES,
  OVERLAYS,
  SILENT_MP3_FILES,
  WORKFLOW_YOUTUBE_VIDEO_CLONE,
} from '@/src/constants';
import { LAYOUT_IDS } from '@/src/layouts';

function Page({
  params,
}: {
  params: {
    project_id: string;
  };
}) {
  const { data } = useQueryGetProject(params.project_id);
  const { mutate, isPending } = useMutationUpdateProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(4);

  const promptVideoCloneRef = useRef<HTMLTextAreaElement>(null);

  const updateProject = (_data: Partial<IProject>) => {
    mutate({
      ...data,
      ..._data,
      id: params.project_id,
    });
  };

  const updateAssets = (url: string) => {
    const assets: string[] = data?.assets?.length ? data.assets : [];
    assets.push(url);

    updateProject({
      assets: assets,
    });
  };

  const updatePrompt = (promptsName: string, value?: string) => {
    updateProject({
      prompts: {
        ...data?.prompts,
        [promptsName]: value,
      },
    });
  };
  // TODO: use this function as hook as we are using this at multiple places
  const deleteAsset = (url: string) => {
    const assets: string[] = data?.assets?.length ? data.assets : [];
    const index = assets.indexOf(url);
    if (index > -1) {
      assets.splice(index, 1);
    }

    updateProject({
      assets: assets,
    });
  };

  const AssetList = () => {
    return (
      <>
        <div
          className={
            'mb-2 flex items-center justify-between  gap-2 bg-violet-50 p-2'
          }
        >
          <div>
            <Subtitle1>Assets</Subtitle1>
          </div>
          <div className={'flex items-center gap-2'}>
            <Subtitle1># {data?.assets?.length}</Subtitle1>
            <Button appearance={'primary'} onClick={() => setIsModalOpen(true)}>
              Upload Assets
            </Button>
          </div>
        </div>
        <hr />
        <div className={'flex flex-row flex-wrap gap-1'}>
          {!data?.assets?.length && (
            <div className={'flex w-full flex-col items-center p-5'}>
              <Subtitle1>No assets found</Subtitle1>
              <Title2>Upload assets to get started</Title2>
            </div>
          )}
          {/*TODO: Need to use ProjectAssets component*/}
          {data?.assets?.map((asset: string, index: number) => {
            const fileType = getFileType(asset);
            if (fileType.type === 'image') {
              return (
                <div key={asset} className={'max-w-md'}>
                  <Image
                    onDelete={() => deleteAsset(asset)}
                    isCopyable={true}
                    copyPosition={'bottom-right'}
                    isViewOnly={true}
                    key={index}
                    src={asset}
                  />
                </div>
              );
            } else if (fileType.type === 'video') {
              return (
                <div key={asset} className={'max-w-md'}>
                  <Video
                    onDelete={() => deleteAsset(asset)}
                    isCopyable={true}
                    copyPosition={'bottom-right'}
                    isViewOnly={true}
                    key={index}
                    src={asset}
                  />
                </div>
              );
            } else {
              return (
                <div key={asset} className={'max-w-md'}>
                  <Image
                    onDelete={() => deleteAsset(asset)}
                    isCopyable={true}
                    copyPosition={'bottom-right'}
                    isViewOnly={true}
                    key={index}
                    src={asset}
                  />
                </div>
              );
            }
          })}
        </div>
        {isModalOpen && (
          <InsertImageModal
            isOpen={isModalOpen}
            onUploadSuccess={(url?: string) => {
              console.log('onUploadSuccess');
              console.log(`url =${url}`);
              url && updateAssets(url);
              setIsModalOpen(false);
            }}
            title={'Upload Asset'}
            isDisplayURLUpload={false}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </>
    );
  };

  const LanguageVoices = () => {
    return (
      <>
        <div
          className={
            'mb-2 flex items-center justify-between  gap-2 bg-violet-50 p-2'
          }
        >
          <div className={'flex'}>
            <Subtitle1>Language Voices</Subtitle1>
            {isPending && <Spinner size={'tiny'} className={'ml-1'} />}
          </div>
          <div className={'flex items-center gap-2'}></div>
        </div>
        <hr />
        <div className={'p-2'}>
          <div>
            <div className={'pb-2'}>
              <Subtitle1 className={'block'}>Default Language</Subtitle1>
            </div>
            <Language
              onSelect={(language) => {
                updateProject({
                  defaultLanguage: language,
                  defaultVoice: '',
                });
              }}
              currentLanguage={data?.defaultLanguage}
            />
          </div>
          <div>
            <div className={' pt-2'}>
              <Subtitle1>Default Voice</Subtitle1>
            </div>
          </div>

          <SupportedVoices
            title={''}
            onUpdateVoice={(voiceCode) => {
              updateProject({
                defaultVoice: voiceCode,
              });
            }}
            audioLanguage={data?.defaultLanguage}
            currentVoice={data?.defaultVoice}
          />
        </div>
      </>
    );
  };

  const BackgroundMusic = () => {
    return (
      <>
        <div
          className={
            'mb-2 flex items-center justify-between  gap-2 bg-violet-50 p-2'
          }
        >
          <div className={'flex'}>
            <Subtitle1>Background Music</Subtitle1>
            {isPending && <Spinner size={'tiny'} className={'ml-1'} />}
          </div>
          <div className={'flex items-center gap-2'}></div>
        </div>
        <hr />
        <div className={'p-2'}>
          <div>
            <div className={' pt-2'}>
              <Subtitle1 className={'block'}>
                Default Background Music
              </Subtitle1>
            </div>
          </div>

          <SupportedBackgroundMusic
            title={''}
            onUpdate={(bgMusic: string) => {
              updateProject({
                defaultBackgroundMusic: bgMusic,
              });
            }}
            currentBackgroundMusic={data?.defaultBackgroundMusic}
          />
        </div>
      </>
    );
  };

  const Overlays = () => {
    return (
      <>
        <div
          className={
            'mb-2 flex items-center justify-between  gap-2 bg-violet-50 p-2'
          }
        >
          <div className={'flex'}>
            <Subtitle1>Overlays</Subtitle1>
            {isPending && <Spinner size={'tiny'} className={'ml-1'} />}
          </div>
          <div className={'flex items-center gap-2'}></div>
        </div>
        <hr />
        <div className={'p-2'}>
          <div>
            <div className={' pt-2'}>
              <Subtitle1 className={'block'}>Default Overlays</Subtitle1>
            </div>
          </div>
          <div className={'flex flex-grow gap-1'}>
            {OVERLAYS.map((_overlay) => (
              <div
                key={_overlay.src}
                className={
                  'flex max-w-md flex-col gap-1 border-2 border-violet-200'
                }
              >
                <div className={'text-center text-2xl'}>{_overlay.name}</div>
                <Video src={_overlay.exampleSrc} isViewOnly />
                {data?.defaultOverlay === _overlay.src ? (
                  <Button
                    className={'w-full'}
                    appearance={'secondary'}
                    onClick={() => {
                      updateProject({
                        defaultOverlay: '',
                      });
                    }}
                  >
                    UnApply
                  </Button>
                ) : (
                  <Button
                    className={'w-full'}
                    appearance={'primary'}
                    onClick={() => {
                      updateProject({
                        defaultOverlay: _overlay.src,
                      });
                    }}
                  >
                    Apply
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };
  const General = () => {
    const [CIBranchName, setCIBranchName] = useState<string>(
      data?.CIBranchName || '',
    );
    const SCENES_MERGE_EFFECTS = ['concat', 'blend'];
    return (
      <>
        <div
          className={
            'mb-2 flex items-center justify-between  gap-2 bg-violet-50 p-2'
          }
        >
          <div className={'flex'}>
            <Subtitle1>General Settings</Subtitle1>
            {isPending && <Spinner size={'tiny'} className={'ml-1'} />}
          </div>
          <div className={'flex items-center gap-2'}></div>
        </div>
        <hr />
        <div className={'p-2'}>
          <div>
            <div className={' pt-2'}>
              <h3 className={'text-xl'}>Create scene with random asset</h3>
              <h5>
                When enabled, a random asset will be selected for each scene
              </h5>
              <Checkbox
                checked={data?.sceneRandomAsset}
                onChange={(e, data) => {
                  updateProject({
                    sceneRandomAsset: !!data.checked,
                  });
                }}
                label={'Enable'}
              />
              <hr className={'mb-2 mt-2'} />
              <h3 className={'text-xl'}>Create video with default settings</h3>
              <h5>When enabled, Video will be created with default settings</h5>
              <Checkbox
                checked={data?.videoWithDefaultSettings}
                onChange={(e, data) => {
                  updateProject({
                    videoWithDefaultSettings: !!data.checked,
                  });
                }}
                label={'Enable'}
              />
              <hr className={'mb-2 mt-2'} />
              <h3 className={'text-xl'}>Enable subtitles</h3>
              <h5>
                When enabled, Subtitles will be displayed on the screen.
                Currently some languages do support the subtitles.
              </h5>
              <Checkbox
                checked={data?.videoSubtitles}
                onChange={(e, data) => {
                  updateProject({
                    videoSubtitles: !!data.checked,
                  });
                }}
                label={'Enable'}
              />
              <hr className={'mb-2 mt-2'} />
              <h5 className={'text-xl'}>CI Branch Name</h5>
              <h5>
                This CI branch name will be used to upload the video on youtube
                channel
              </h5>
              <Input
                defaultValue={CIBranchName}
                onChange={(e, data) => {
                  console.log(data.value);
                  setCIBranchName(data.value);
                }}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    updateProject({
                      CIBranchName: CIBranchName,
                    });
                  }
                }}
              />
              <hr className={'mb-2 mt-2'} />
              <h3 className={'text-xl'}>Scenes Merge Effect</h3>
              <h5>
                This setting will be applied to merge the scenes videos. default
                is concat.
              </h5>
              <Select
                onChange={(
                  ev: ChangeEvent<HTMLSelectElement>,
                  data: SelectOnChangeData,
                ) => {
                  updateProject({
                    mergeEffect: data?.value as string,
                  });
                }}
              >
                <option value={''}>Select Effect</option>
                {SCENES_MERGE_EFFECTS.map((effect) => (
                  <option
                    selected={data?.mergeEffect === effect}
                    value={effect}
                    key={effect}
                  >
                    {effect}
                  </option>
                ))}
              </Select>
              <hr className={'mb-2 mt-2'} />
              <h3 className={'text-xl'}>Default layout</h3>
              <h5>
                When enabled, Subtitles will be displayed on the screen.
                Currently some languages do support the subtitles.
              </h5>
              <Select
                onChange={(
                  ev: ChangeEvent<HTMLSelectElement>,
                  data: SelectOnChangeData,
                ) => {
                  updateProject({
                    defaultLayout: data?.value as string,
                  });
                }}
              >
                <option value={''}>Select Layout</option>
                {LAYOUT_IDS.map((layout) => (
                  <option
                    selected={data?.defaultLayout === layout}
                    className={'capitalize'}
                    value={layout}
                    key={layout}
                  >
                    {layout}
                  </option>
                ))}
              </Select>
              <hr className={'mb-2 mt-2'} />
              <h3 className={'text-xl'}>Default Mp3 Speaking Rate</h3>
              <h5>
                This is the default speaking rate for the mp3 audio files.
              </h5>
              <Select
                onChange={(
                  ev: ChangeEvent<HTMLSelectElement>,
                  data: SelectOnChangeData,
                ) => {
                  updateProject({
                    defaultMp3SpeakingRate: Number(data?.value),
                  });
                }}
              >
                <option value={''}>Select Speaking Rate</option>
                {MP3_SPEAKING_RATES.map((rate) => (
                  <option
                    selected={data?.defaultMp3SpeakingRate === rate}
                    className={'capitalize'}
                    value={rate}
                    key={rate}
                  >
                    {rate}
                  </option>
                ))}
              </Select>
              <hr className={'mb-2 mt-2'} />
              <h3 className={'text-xl'}>Postfix Silence</h3>
              <h5>
                This setting adds given seconds of silence at the end of each
                scene.
              </h5>
              <Select
                onChange={(
                  ev: ChangeEvent<HTMLSelectElement>,
                  data: SelectOnChangeData,
                ) => {
                  updateProject({
                    postFixSilence: data?.value as string,
                  });
                }}
              >
                <option value={''}>Select Silence</option>
                {SILENT_MP3_FILES.map((asset) => (
                  <option
                    selected={data?.postFixSilence === asset.src}
                    className={'capitalize'}
                    value={asset.src}
                    key={asset.src}
                  >
                    {asset.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Prompts = () => {
    return (
      <>
        <div
          className={
            'mb-2 flex items-center justify-between  gap-2 bg-violet-50 p-2'
          }
        >
          <div className={'flex'}>
            <Subtitle1>Prompts</Subtitle1>
            {isPending && <Spinner size={'tiny'} className={'ml-1'} />}
          </div>
          <div className={'flex items-center gap-2'}></div>
        </div>
        <hr />
        <div className={'p-2'}>
          <div>
            <div className={'flex flex-col gap-1 pt-2'}>
              <h3 className={'text-xl'}>Youtube copy</h3>
              <h5>Prompts for youtube copy video workflow</h5>
              <Textarea
                defaultValue={data?.prompts?.[WORKFLOW_YOUTUBE_VIDEO_CLONE]}
                ref={promptVideoCloneRef}
                className={'w-full'}
                rows={10}
              />
              <Button
                appearance={'primary'}
                onClick={() => {
                  updatePrompt(
                    WORKFLOW_YOUTUBE_VIDEO_CLONE,
                    promptVideoCloneRef.current?.value,
                  );
                }}
              >
                Save
                {isPending && <Spinner size={'small'} />}
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={'w-100 flex w-full max-w-7xl flex-col'}>
      <div className={'flex  justify-start pb-1 pt-1'}>
        <Link href={`/auth/projects/${params.project_id}`}>
          <Title1> {data?.projectName}</Title1>
        </Link>
      </div>

      <div className="flex flex-row ">
        <div className="w-1/4 pt-10">
          <List>
            <ListItem
              selected={activeTab === 4}
              onClick={() => setActiveTab(4)}
            >
              <Settings24Filled />
              <Body1 className={'ml-1'}>General</Body1>
            </ListItem>
            <ListItem
              selected={activeTab === 0}
              onClick={() => setActiveTab(0)}
            >
              <Group24Filled />
              <Body1 className={'ml-1'}>Assets</Body1>
            </ListItem>
            <ListItem
              selected={activeTab === 1}
              onClick={() => setActiveTab(1)}
            >
              <GlobeRegular className={'text-2xl'} />
              <Body1 className={'ml-1'}>Language/Voices</Body1>
            </ListItem>
            <ListItem
              selected={activeTab === 2}
              onClick={() => setActiveTab(2)}
            >
              <HeadphonesSoundWave24Filled />
              <Body1 className={'ml-1'}>Background Music</Body1>
            </ListItem>
            <ListItem
              selected={activeTab === 3}
              onClick={() => setActiveTab(3)}
            >
              <FilmstripImage24Filled />
              <Body1 className={'ml-1'}>Overlays</Body1>
            </ListItem>
            <ListItem
              selected={activeTab === 5}
              onClick={() => setActiveTab(5)}
            >
              <Prompt24Filled />
              <Body1 className={'ml-1'}>Prompts</Body1>
            </ListItem>
          </List>
        </div>
        <div className="flex w-3/4 flex-col">
          {activeTab === 0 && <AssetList />}
          {activeTab === 1 && <LanguageVoices />}
          {activeTab === 2 && <BackgroundMusic />}
          {activeTab === 3 && <Overlays />}
          {activeTab === 4 && <General />}
          {activeTab === 5 && <Prompts />}
        </div>
      </div>
    </div>
  );
}

export default Page;

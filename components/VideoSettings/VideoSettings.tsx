import { getFileType } from '@/src/helpers';
import Image from '@/components/Image/Image';
import { Video } from '@/components/Video/Video';
import { useState } from 'react';
import { Button } from '@fluentui/react-components';
import { DEFAULT_NO_IMAGE_URL } from '@/src/constants';

export function VideoSettings({
  currentDefaultAsset = DEFAULT_NO_IMAGE_URL,
  onUploadSuccess,
}: IVideoSettingsProps) {
  const [fileType, setFileType] = useState(getFileType(currentDefaultAsset));
  const [updatedAsset, setUpdatedAsset] = useState<string | undefined>(
    undefined,
  );

  const [defaultAsset, setDefaultAsset] = useState<string>(currentDefaultAsset);

  const handleUploadSuccess = (url?: string) => {
    setUpdatedAsset(url);
    setDefaultAsset(url || DEFAULT_NO_IMAGE_URL);
    setFileType(getFileType(url || DEFAULT_NO_IMAGE_URL));
  };

  return (
    <div className={'p-4'}>
      <h1 className={'text-xl'}>Video Settings</h1>
      <div className={'flex flex-col gap-1 pt-2.5 '}>
        <h2 className={'text-lg'}>Current Asset</h2>
        <div>
          {fileType.type === 'image' && (
            <Image src={defaultAsset} onUploadSuccess={handleUploadSuccess} />
          )}
          {fileType.type === 'video' && (
            <Video src={defaultAsset} onUploadSuccess={handleUploadSuccess} />
          )}
        </div>
        <div className={'mt-3 flex justify-end gap-2'}>
          <Button
            disabled={!updatedAsset}
            size={'large'}
            appearance={'secondary'}
            onClick={() => onUploadSuccess(updatedAsset || '', true)}
          >
            Update with Existing scenes
          </Button>
          <Button
            size={'large'}
            disabled={!updatedAsset}
            appearance={'primary'}
            onClick={() => onUploadSuccess(updatedAsset || '', false)}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}

export default VideoSettings;

interface IVideoSettingsProps {
  currentDefaultAsset?: string;
  onUploadSuccess: (url: string, isUpdateCurrentScenes: boolean) => void;
}

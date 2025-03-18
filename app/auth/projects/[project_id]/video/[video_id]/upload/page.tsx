'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  useMutationUploadVideo,
  useQueryGetProject,
  useQueryGetVideo,
} from '@/src/query/video.query';
import {
  Body1,
  Body1Strong,
  Button,
  Input,
  Spinner,
  Textarea,
} from '@fluentui/react-components';
import Image from '@/components/Image/Image';
import { useMyToastController } from '@/components/MyToast';

export default function Page({
  params,
}: {
  params: {
    project_id: string;
    video_id: string;
  };
}) {
  const { data: videoData } = useQueryGetVideo(params.video_id);
  const { data: projectData } = useQueryGetProject(params.project_id);

  //  display toasts

  const { dispatchToast } = useMyToastController();
  const { mutate: upload, isPending } = useMutationUploadVideo(
    (state: 'error' | 'success', data: any) => {
      if (state === 'success') {
        if (data.errors) {
          dispatchToast({
            title: 'Error',
            body: data.errors,
            intent: 'error',
          });
        } else {
          dispatchToast({
            title: 'Success',
            body: 'Video upload scheduled successfully',
            intent: 'success',
          });
        }
      } else {
        dispatchToast({
          title: 'Error',
          body: 'Error uploading video',
          intent: 'error',
        });
      }
    },
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ciBranchName: projectData?.CIBranchName || '',
      name: videoData?.name || '',
      description: videoData?.description || '',
      thumbnailUrl: videoData?.thumbnailUrl || '/no-image.png',
    },
  });

  const handleUpload = (data: any) => {
    upload({
      id: params.video_id,
      branch: projectData?.CIBranchName || '',
      title: data.name,
      desc: data.description,
    });
  };

  useEffect(() => {
    setValue('name', videoData?.name || '');
    setValue('description', videoData?.description || '');
    setValue('thumbnailUrl', videoData?.thumbnailUrl || '/no-image.png');
  }, [videoData, setValue]);

  useEffect(() => {
    setValue('ciBranchName', projectData?.CIBranchName || '');
  }, [projectData, setValue]);
  return (
    <div style={{ width: '1000px' }} className={'mt-3 flex items-center'}>
      <form
        onSubmit={handleSubmit(handleUpload)}
        className={'flex flex-col gap-2'}
      >
        <div className={'flex gap-1'}>
          <label>
            <Body1Strong>Video Name</Body1Strong>
          </label>
          <div className={'flex w-full flex-col'}>
            <Input
              size={'large'}
              style={{ width: '100%' }}
              {...register('name', { required: 'This field is required' })}
            />

            {errors.name && (
              <Body1 className={'text-red-500'}>{errors.name.message}</Body1>
            )}
          </div>
        </div>
        <div className={'flex gap-1'}>
          <label>
            <Body1Strong>Video Description</Body1Strong>
          </label>
          <div className={'flex flex-col'}>
            <Textarea
              cols={100}
              rows={10}
              {...register('description', {
                required: 'This field is required',
              })}
            />
            {errors.description && (
              <span className={'text-red-500'}>
                {errors.description.message}
              </span>
            )}
          </div>
        </div>
        <div className={'flex'}>
          <label>
            <Body1Strong>CI Branch Name</Body1Strong>
          </label>
          <div className={'flex flex-col'}>
            <Input
              defaultValue={projectData?.CIBranchName}
              disabled
              {...register('ciBranchName', {
                required: 'This field is required',
              })}
            />
            {errors.ciBranchName && (
              <span className={'text-red-500'}>
                {errors.ciBranchName.message}
              </span>
            )}
          </div>
        </div>
        <div className={'flex'}>
          <label>
            <Body1Strong>Thumbnail Image</Body1Strong>
          </label>
          <div className={'w-1/4'}>
            <Image
              src={videoData?.thumbnailUrl || '/no-image.png'}
              onUploadSuccess={(url) => {
                setValue('thumbnailUrl', url as string);
              }}
            />
            {!videoData?.thumbnailUrl && (
              <span className={'text-red-500'}>Thumbnail URL required</span>
            )}
          </div>
        </div>
        <Button appearance={'primary'} type="submit" disabled={isPending}>
          {isPending ? <Spinner /> : 'Upload Video'}
        </Button>
      </form>
    </div>
  );
}

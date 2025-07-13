import React, { useRef, useState, useEffect } from 'react';
import { Button, Body1, Caption1 } from '@fluentui/react-components';
import {
  Play24Regular,
  Pause24Regular,
  ArrowDownload24Regular,
} from '@fluentui/react-icons';

interface Mp3PlayerProps {
  audioData: string; // Base64 encoded MP3 data
  fileName?: string;
  className?: string;
}

export const Mp3Player: React.FC<Mp3PlayerProps> = ({
  audioData,
  fileName = 'synthesis.mp3',
  className = '',
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const audioSource = `data:audio/mpeg;base64,${audioData}`;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioData]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const downloadAudio = () => {
    const link = document.createElement('a');
    link.href = audioSource;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-4 ${className}`}
    >
      <audio ref={audioRef} src={audioSource} preload="metadata" />

      <div className="flex items-center space-x-4">
        {/* Play/Pause Button */}
        <Button
          appearance="primary"
          shape="circular"
          icon={isPlaying ? <Pause24Regular /> : <Play24Regular />}
          onClick={togglePlay}
          disabled={!isLoaded}
          size="large"
          className="flex-shrink-0"
        />

        {/* Progress Section */}
        <div className="flex-1 space-y-2">
          {/* Time and Title */}
          <div className="flex items-center justify-between">
            <Body1 className="font-medium text-gray-900">Generated Audio</Body1>
            <Caption1 className="text-gray-500">
              {formatTime(currentTime)} / {formatTime(duration)}
            </Caption1>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-150"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              disabled={!isLoaded}
            />
          </div>
        </div>

        {/* Download Button */}
        <Button
          appearance="secondary"
          icon={<ArrowDownload24Regular />}
          onClick={downloadAudio}
          title="Download MP3"
          className="flex-shrink-0"
        >
          Download
        </Button>
      </div>
    </div>
  );
};

export default Mp3Player;

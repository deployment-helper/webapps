/**
 * Need to create a audio player component that will be used to play videos in the application.
 * This audio component will receive video/videos as base64 string and play those videos one by one automatically.
 * This audio also provides the functionality to pause/play the video and also to seek the video to a specific time.
 * This audio component will provide control to parent component to handle the video end events.
 */

import React, { useEffect, useRef, useState } from 'react';

const AudioPlayer = ({
  audios,
  onAudioEnd,
  nextIndex,
  play,
  stop,
  autoPlay = true,
}: IAudioPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleEnded = () => {
      if (currentIndex < audios.length - 1 && isPlaying && autoPlay) {
        setCurrentIndex(currentIndex + 1);
      } else if (currentIndex === audios.length - 1 && isPlaying) {
        setIsPlaying(false);
        onAudioEnd(); // Call the parent's callback here
      }
    };

    audioRef.current && audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      audioRef.current &&
        audioRef.current.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, isPlaying, audioRef, audios, onAudioEnd]); // Update deps

  useEffect(() => {
    if (
      nextIndex !== undefined &&
      nextIndex !== currentIndex &&
      nextIndex < audios.length &&
      nextIndex !== null
    ) {
      setIsPlaying(false);
      setCurrentIndex(nextIndex);
    }
  }, [nextIndex, currentIndex, audios]);

  useEffect(() => {
    if (play && !isPlaying) {
      setIsPlaying(true);
      audioRef.current?.play();
    }
  }, [play, isPlaying]);

  useEffect(() => {
    if (stop && isPlaying) {
      setIsPlaying(false);
      audioRef.current?.pause();
    }
  }, [stop, isPlaying]);
  const audioSource = `data:audio/wav;base64,${audios[currentIndex]}`; // Assuming MP3 format

  return (
    <div className="audio-player" style={{ width: '100%' }}>
      <audio
        ref={audioRef}
        src={audioSource}
        controls={!isPlaying}
        style={{ width: '100%' }}
      >
        <source src={audioSource} type="audio/mpeg" />
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
};

export interface IAudioPlayerProps {
  audios: string[];
  onAudioEnd: () => void;
  nextIndex?: number;
  play?: boolean;
  stop?: boolean;
  autoPlay?: boolean;
}

export default AudioPlayer;

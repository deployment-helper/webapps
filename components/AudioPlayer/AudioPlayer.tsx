/**
 * Need to create a audio player component that will be used to play videos in the application.
 * This audio component will receive video/videos as base64 string and play those videos one by one automatically.
 * This audio also provides the functionality to pause/play the video and also to seek the video to a specific time.
 * This audio component will provide control to parent component to handle the video end events.
 */

import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import classNames from "classnames";

const AudioPlayer = ({ audios, onAudioEnd }: IAudioPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleEnded = () => {
      if (currentIndex < audios.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsPlaying(false);
        onAudioEnd(); // Call the parent's callback here
      }
    };

    audioRef.current && audioRef.current.addEventListener("ended", handleEnded);

    return () => {
      audioRef.current &&
        audioRef.current.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, isPlaying, audioRef, audios, onAudioEnd]); // Update deps

  const audioSource = `data:audio/mp3;base64,${audios[currentIndex]}`; // Assuming MP3 format

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={audioSource} controls={!isPlaying}>
        <source src={audioSource} type="audio/mp3" />
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
};

export interface IAudioPlayerProps {
  audios: string[];
  onAudioEnd: () => void;
}

export default AudioPlayer;

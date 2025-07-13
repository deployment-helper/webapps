'use client';

import React, { useState, useRef } from 'react';
import {
  Button,
  Textarea,
  Title1,
  Spinner,
  Body1,
} from '@fluentui/react-components';
import { Play24Regular, Delete24Regular } from '@fluentui/react-icons';
import Mp3Player from '@/components/Mp3Player/Mp3Player';
import { useMutationPostTextToSpeechMultiVoice } from '@/src/query/video.query';

export default function SynthesisPage() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize the multi-voice synthesis mutation
  const { mutate: generateMultiVoiceSynthesis, isPending: isSynthesisLoading } =
    useMutationPostTextToSpeechMultiVoice(
      (data) => {
        // On success
        setIsLoading(false);
        if (data && data.length > 0 && data[0].data) {
          setAudioData(data[0].data);
        } else {
          setError('No audio data received from synthesis');
        }
      },
      (error) => {
        // On error
        setIsLoading(false);
        console.error('Synthesis error:', error);
        setError('Failed to generate synthesis. Please try again.');
      },
    );

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to synthesize');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAudioData(null);

    // Call the multi-voice synthesis API
    generateMultiVoiceSynthesis({
      conversationText: inputText,
    });
  };

  const handleClear = () => {
    setInputText('');
    setAudioData(null);
    setError(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <Title1 className="text-gray-900">
              Generate multi voice english language MP3
            </Title1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {/* Text Input Section */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="synthesis-text"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Enter text for synthesis
              </label>
              <Textarea
                ref={textareaRef}
                id="synthesis-text"
                value={inputText}
                onChange={(_, data) => setInputText(data.value)}
                placeholder="Enter the text you want to convert to speech..."
                className="w-full"
                rows={12}
                resize="vertical"
                style={{
                  minHeight: '300px',
                  maxHeight: '500px',
                  fontSize: '16px',
                  lineHeight: '1.5',
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-4">
                <Body1 className="text-red-700">{error}</Body1>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                appearance="primary"
                size="large"
                icon={
                  isLoading || isSynthesisLoading ? (
                    <Spinner size="tiny" />
                  ) : (
                    <Play24Regular />
                  )
                }
                onClick={handleGenerate}
                disabled={isLoading || isSynthesisLoading || !inputText.trim()}
                className="min-w-[140px]"
              >
                {isLoading || isSynthesisLoading
                  ? 'Generating...'
                  : 'Generate MP3'}
              </Button>

              <Button
                appearance="secondary"
                size="large"
                icon={<Delete24Regular />}
                onClick={handleClear}
                disabled={isLoading || isSynthesisLoading}
              >
                Clear Text
              </Button>
            </div>
          </div>

          {/* Audio Player Section */}
          {audioData && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="space-y-4">
                <div>
                  <Body1 className="mb-4 font-semibold text-gray-900">
                    Generated Audio
                  </Body1>
                  <Mp3Player
                    audioData={audioData}
                    fileName="synthesis-output.mp3"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { Button } from '@fluentui/react-components';
import dynamic from 'next/dynamic';

// Import the modal component dynamically with no SSR to avoid hydration issues
const SystemPromptModal = dynamic(
  () =>
    import('@/components/SystemPromptModal/SystemPromptModal').then(
      (mod) => mod.SystemPromptModal,
    ),
  { ssr: false },
);

export default function SystemPromptExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-4 text-2xl font-bold text-black">
        System Prompt Modal Example
      </h1>
      <Button
        appearance="primary"
        onClick={() => setIsModalOpen(true)}
        className="bottom-1 text-black"
      >
        Open System Prompt Modal
      </Button>

      {/* Only render the modal when it's needed */}
      {isModalOpen && (
        <SystemPromptModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="System Prompt"
          description="Use this interface to interact with documents and generate responses based on their content."
        />
      )}
    </div>
  );
}

import React, { useRef, useState, useEffect } from 'react';
import {
  Button,
  Input,
  Body1,
  Body1Strong,
  Textarea,
  Spinner,
  Title1,
} from '@fluentui/react-components';
import {
  Add24Regular,
  Send24Regular,
  Document24Regular,
  DismissCircle24Filled,
} from '@fluentui/react-icons';
import { useDropzone } from 'react-dropzone';
import { getApiServer, s3RandomPublicKey } from '@/src/helpers';
import { ServerClient } from '@/src/apis/server.client';
import { useMyToastController } from '@/components/MyToast';
import { useMutationGenerateMCQ } from '@/src/query/video.query';

export interface IMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface IDocument {
  id: string;
  name: string;
  url: string;
}

export interface ISystemPromptPanelProps {
  onClose: () => void;
  title?: string;
  systemPrompt?: string;
  projectId?: string;
}

export const SystemPromptPanel: React.FC<ISystemPromptPanelProps> = ({
  onClose,
  title = 'System Prompt',
  systemPrompt = 'No system prompt provided.',
  projectId = '',
}) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { dispatchToast } = useMyToastController();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize the MCQ mutation
  const { mutate: generateMCQ, isPending: isMcqLoading } =
    useMutationGenerateMCQ(
      (data) => {
        // On success
        setIsSending(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 11),
            text: data.response || 'MCQ generated successfully',
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      },
      (error) => {
        // On error
        setIsSending(false);
        dispatchToast({
          title: 'Error',
          body: 'Failed to generate MCQ',
          intent: 'error',
        });
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 11),
            text: 'Error: Failed to generate MCQ',
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      },
    );

  const handleSendMessage = () => {
    const message = promptInputRef.current?.value.trim();
    if (!message || message.trim() === '') return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 11),
        text: message,
        isUser: true,
        timestamp: new Date(),
      },
    ]);

    // Clear the input
    if (promptInputRef.current) {
      promptInputRef.current.value = '';
    }

    // Set sending state
    setIsSending(true);

    // Use the hardcoded user prompt for MCQ generation
    const userPrompt =
      'Generate multiple choice questions with explanations for correct and incorrect answers';

    // Get asset files from documents
    const assetFiles = documents.map((doc) => doc.url);

    if (!projectId) {
      setIsSending(false);
      dispatchToast({
        title: 'Error',
        body: 'Project ID is required to generate MCQs',
        intent: 'error',
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 11),
          text: 'Error: Project ID is required to generate MCQs',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
      return;
    }

    // Call the MCQ API with our data
    generateMCQ({
      projectId,
      systemPrompt,
      assetFiles,
      userPrompt,
    });
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    // Only accept PDF files
    if (file.type !== 'application/pdf') {
      dispatchToast({
        title: 'Error',
        body: 'Only PDF files are supported',
        intent: 'error',
      });
      return;
    }

    setIsUploading(true);
    try {
      const apiServer = getApiServer();
      const s3Key = s3RandomPublicKey();
      const fileKey = `${s3Key}.pdf`;

      const response = await ServerClient.uploadS3Object(
        apiServer,
        fileKey,
        file,
        true,
      );

      const newDocument = {
        id: s3Key,
        name: file.name,
        url: response.publicUrl,
      };

      setDocuments((prev) => [...prev, newDocument]);

      dispatchToast({
        title: 'Success',
        body: 'Document uploaded successfully',
        intent: 'success',
      });

      // Add system message about the uploaded document
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 11),
          text: `Document '${file.name}' has been uploaded.`,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error uploading file:', error);
      dispatchToast({
        title: 'Error',
        body: 'Failed to upload document',
        intent: 'error',
      });
    } finally {
      setIsUploading(false);
      setIsDocumentModalOpen(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col bg-white">
      {/* Fixed Header Section */}
      <header
        className="flex-shrink-0 px-6 py-4 text-white shadow-md"
        style={{ backgroundColor: 'var(--colorBrandBackground)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-bold">{title}</h1>
            </div>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white bg-opacity-20 transition-colors hover:bg-opacity-30"
            onClick={onClose}
          >
            <DismissCircle24Filled className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-2 text-sm text-violet-100">
          {systemPrompt.length > 120
            ? `${systemPrompt.substring(0, 120)}...`
            : systemPrompt}
        </div>

        {/* Document list in header */}
        {documents.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-1 rounded bg-white bg-opacity-20 px-2 py-1"
                title={doc.name}
              >
                <Document24Regular className="h-4 w-4" />
                <span className="max-w-[150px] truncate text-sm">
                  {doc.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Scrollable Messages Container */}
      <main className="scrollbar-thin flex-1 overflow-y-auto bg-gray-50 px-6 py-4">
        <style jsx>{`
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: #f1f5f9;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}</style>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                  <svg
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-lg text-gray-500">
                  No messages yet. Start a conversation!
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className="max-w-xs lg:max-w-md">
                    <div
                      className={`rounded-lg px-4 py-3 shadow-sm ${
                        message.isUser
                          ? 'bg-violet-600 text-white'
                          : 'border border-gray-200 bg-white'
                      }`}
                    >
                      <p
                        className={
                          message.isUser ? 'text-white' : 'text-gray-800'
                        }
                      >
                        {message.text}
                      </p>
                      <p
                        className={`mt-2 text-xs ${
                          message.isUser ? 'text-violet-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </main>

      {/* Fixed Bottom Input Section */}
      <footer className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-4">
        <div className="flex items-end space-x-3">
          <Button
            icon={<Add24Regular />}
            appearance="subtle"
            onClick={(e) => {
              e.stopPropagation();
              setIsDocumentModalOpen(true);
            }}
            title="Upload PDF document"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 transition-colors hover:bg-gray-200"
          />
          <div className="relative flex-1">
            <Textarea
              ref={promptInputRef}
              placeholder="Type your message here..."
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
              resize="vertical"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          <Button
            icon={isSending ? <Spinner size="tiny" /> : <Send24Regular />}
            appearance="primary"
            onClick={handleSendMessage}
            disabled={isSending}
            title="Send message"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white transition-colors hover:bg-violet-700"
          />
        </div>
      </footer>

      {/* Document upload modal overlay */}
      {isDocumentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <Title1>Upload PDF Document</Title1>
              <div
                className="cursor-pointer text-gray-600 hover:text-gray-800"
                onClick={() => setIsDocumentModalOpen(false)}
              >
                <DismissCircle24Filled />
              </div>
            </div>
            <div
              {...getRootProps()}
              className={`flex h-64 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-4 ${
                isDragActive
                  ? 'border-blue-400 bg-gray-100'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <input {...getInputProps()} accept="application/pdf" />
              {isUploading ? (
                <Spinner size="medium" />
              ) : (
                <div className="text-center">
                  <Document24Regular className="mx-auto mb-2 h-16 w-16 text-gray-400" />
                  <p className="text-gray-600">
                    Drag and drop a PDF file here, or click to select a file
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                appearance="secondary"
                onClick={() => setIsDocumentModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemPromptPanel;

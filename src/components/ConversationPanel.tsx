import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Send } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { Message, MessageType } from '../types';

type ConversationPanelProps = {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isProcessing: boolean;
};

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  messages,
  onSendMessage,
  isProcessing,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white dark:bg-neutral-800 shadow-sm rounded-t-lg p-4 border-b border-neutral-200 dark:border-neutral-700">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">Conversation</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-neutral-50 dark:bg-neutral-900">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-primary-50 dark:bg-primary-900/30 p-6 rounded-full mb-4">
              <Send size={24} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2">
              Start a new conversation
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md">
              Begin by describing your requirements for an RFP or proposal. 
              Our AI agents will work together to generate the appropriate documents.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-b-lg border-t border-neutral-200 dark:border-neutral-700">
        <div className="relative">
          <textarea
            className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg py-3 px-4 pr-12 resize-none bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent"
            placeholder="Type your message..."
            rows={2}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
          />
          <button
            className={`absolute right-3 bottom-3 p-2 rounded-full 
              ${inputValue.trim() === '' || isProcessing
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
              } transition-colors`}
            onClick={handleSendMessage}
            disabled={inputValue.trim() === '' || isProcessing}
          >
            <Send size={18} />
          </button>
        </div>
        {isProcessing && (
          <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 flex items-center">
            <div className="w-4 h-4 rounded-full bg-primary-600 animate-pulse mr-2"></div>
            Agents are processing your request...
          </div>
        )}
      </div>
    </div>
  );
};
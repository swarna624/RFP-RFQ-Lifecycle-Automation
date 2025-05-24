import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Message } from '../types';
import { AgentAvatar } from './AgentAvatar';
import { motion } from 'framer-motion';

type MessageBubbleProps = {
  message: Message;
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'User';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isUser && (
        <div className="mr-3 flex-shrink-0">
          <AgentAvatar agentType={message.sender} />
        </div>
      )}
      <div
        className={`max-w-[80%] ${
          isUser
            ? 'bg-primary-600 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg'
            : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tr-lg rounded-tl-lg rounded-br-lg'
        } p-4 shadow-sm`}
      >
        {!isUser && (
          <div className="font-medium text-sm text-primary-600 dark:text-primary-400 mb-1">
            {message.sender}
          </div>
        )}
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        <div className={`text-xs mt-1 ${isUser ? 'text-primary-200' : 'text-neutral-400'}`}>
          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
        </div>
      </div>
      {isUser && (
        <div className="ml-3 flex-shrink-0">
          <AgentAvatar agentType="User" />
        </div>
      )}
    </motion.div>
  );
};
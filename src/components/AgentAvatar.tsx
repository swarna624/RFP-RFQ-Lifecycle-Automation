import React from 'react';
import { 
  Shield, BarChart, DollarSign, Code, Scale, Calculator, 
  Calendar, CheckSquare, FileText, ClipboardCheck, User 
} from 'lucide-react';
import { AgentType } from '../types';

type AgentAvatarProps = {
  agentType: AgentType | 'User';
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
};

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  agentType,
  size = 'md',
  showBadge = false,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const getAgentIcon = () => {
    switch (agentType) {
      case 'User':
        return <User size={iconSize[size]} />;
      case AgentType.SECURITY:
        return <Shield size={iconSize[size]} />;
      case AgentType.SCALABILITY:
        return <BarChart size={iconSize[size]} />;
      case AgentType.BUDGETING:
        return <DollarSign size={iconSize[size]} />;
      case AgentType.TECH_LEAD:
        return <Code size={iconSize[size]} />;
      case AgentType.LEGAL:
        return <Scale size={iconSize[size]} />;
      case AgentType.ESTIMATION:
        return <Calculator size={iconSize[size]} />;
      case AgentType.TIMELINE:
        return <Calendar size={iconSize[size]} />;
      case AgentType.TERMS_CONDITIONS:
        return <CheckSquare size={iconSize[size]} />;
      case AgentType.MAIN_RFP:
        return <FileText size={iconSize[size]} />;
      case AgentType.MAIN_PROPOSAL:
        return <ClipboardCheck size={iconSize[size]} />;
      default:
        return <User size={iconSize[size]} />;
    }
  };

  const getAgentColor = () => {
    switch (agentType) {
      case 'User':
        return 'bg-neutral-100 text-neutral-600';
      case AgentType.SECURITY:
        return 'bg-error-100 text-error-600';
      case AgentType.SCALABILITY:
        return 'bg-success-100 text-success-600';
      case AgentType.BUDGETING:
        return 'bg-warning-100 text-warning-600';
      case AgentType.TECH_LEAD:
        return 'bg-primary-100 text-primary-700';
      case AgentType.LEGAL:
        return 'bg-neutral-100 text-neutral-600';
      case AgentType.ESTIMATION:
        return 'bg-accent-100 text-accent-600';
      case AgentType.TIMELINE:
        return 'bg-secondary-100 text-secondary-700';
      case AgentType.TERMS_CONDITIONS:
        return 'bg-error-100 text-error-700';
      case AgentType.MAIN_RFP:
        return 'bg-primary-100 text-primary-600';
      case AgentType.MAIN_PROPOSAL:
        return 'bg-secondary-100 text-secondary-600';
      default:
        return 'bg-neutral-100 text-neutral-600';
    }
  };

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${getAgentColor()}`}>
        {getAgentIcon()}
      </div>
      {showBadge && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
      )}
    </div>
  );
};
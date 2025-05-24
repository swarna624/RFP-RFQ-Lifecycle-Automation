import React from 'react';
import { CheckCircle, Circle, ArrowRight, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { WorkflowStage } from '../types';
import { motion } from 'framer-motion';

export type WorkflowProgressProps = {
  currentStage: WorkflowStage;
  workflowType: 'rfp' | 'rfq' | 'quotation' | 'proposal';
  onStageChange: (stage: WorkflowStage) => void;
};

export const WorkflowProgress: React.FC<WorkflowProgressProps> = ({
  currentStage,
  workflowType,
  onStageChange,
}) => {
  const getStages = () => {
    switch (workflowType) {
      case 'rfp':
        return [
          { stage: WorkflowStage.INPUT, label: 'Input Requirements' },
          { stage: WorkflowStage.PROCESSING, label: 'Agent Processing' },
          { stage: WorkflowStage.RFP_GENERATED, label: 'RFP Generated' },
          { stage: WorkflowStage.COMPLETED, label: 'Completed' },
        ];
      case 'rfq':
        return [
          { stage: WorkflowStage.INPUT, label: 'Input Requirements' },
          { stage: WorkflowStage.PROCESSING, label: 'Agent Processing' },
          { stage: WorkflowStage.RFQ_GENERATED, label: 'RFQ Generated' },
          { stage: WorkflowStage.COMPLETED, label: 'Completed' },
        ];
      case 'quotation':
        return [
          { stage: WorkflowStage.INPUT, label: 'Input Requirements' },
          { stage: WorkflowStage.PROCESSING, label: 'Agent Processing' },
          { stage: WorkflowStage.QUOTATION_GENERATED, label: 'Quotation Generated' },
          { stage: WorkflowStage.COMPLETED, label: 'Completed' },
        ];
      case 'proposal':
        return [
          { stage: WorkflowStage.INPUT, label: 'Input Requirements' },
          { stage: WorkflowStage.PROCESSING, label: 'Agent Processing' },
          { stage: WorkflowStage.PROPOSAL_GENERATED, label: 'Proposal Generated' },
          { stage: WorkflowStage.COMPLETED, label: 'Completed' },
        ];
      default:
        return [];
    }
  };

  const stages = getStages();
  const currentIndex = stages.findIndex((s) => s.stage === currentStage);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">
          Workflow Progress
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (currentIndex > 0) {
                onStageChange(stages[currentIndex - 1].stage);
              }
            }}
            className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} className="text-neutral-600 dark:text-neutral-400" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (currentIndex < stages.length - 1) {
                onStageChange(stages[currentIndex + 1].stage);
              }
            }}
            className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            disabled={currentIndex === stages.length - 1}
          >
            <ChevronRight size={20} className="text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex || currentStage === WorkflowStage.COMPLETED;
          const isCurrent = stage.stage === currentStage;
          const isClickable = isCompleted || index === currentIndex + 1;

          return (
            <React.Fragment key={stage.stage}>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => isClickable && onStageChange(stage.stage)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
                <span
                  className={`mt-2 text-sm ${
                    isCompleted || isCurrent
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
              {index < stages.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
import React from 'react';
import { motion } from 'framer-motion';
import { AgentType } from '../types';
import { AgentAvatar } from './AgentAvatar';

type AgentNetworkProps = {
  activeAgents: AgentType[];
  stage: 'rfp' | 'proposal' | 'rfq' | 'quotation';
};

export const AgentNetwork: React.FC<AgentNetworkProps> = ({ activeAgents, stage }) => {
  const rfpAgents = [
    AgentType.SECURITY,
    AgentType.SCALABILITY,
    AgentType.BUDGETING,
    AgentType.MAIN_RFP,
  ];
  
  const proposalAgents = [
    AgentType.TECH_LEAD,
    AgentType.LEGAL,
    AgentType.ESTIMATION,
    AgentType.TIMELINE,
    AgentType.TERMS_CONDITIONS,
    AgentType.MAIN_PROPOSAL,
  ];

  const rfqAgents = [
    AgentType.SECURITY,
    AgentType.BUDGETING,
    AgentType.MAIN_RFQ,
  ];

  let agentsToDisplay, mainAgent, networkTitle;
  if (stage === 'rfp') {
    agentsToDisplay = rfpAgents;
    mainAgent = AgentType.MAIN_RFP;
    networkTitle = 'RFP Generation Network';
  } else if (stage === 'proposal') {
    agentsToDisplay = proposalAgents;
    mainAgent = AgentType.MAIN_PROPOSAL;
    networkTitle = 'Proposal Creation Network';
  } else {
    agentsToDisplay = rfqAgents;
    mainAgent = AgentType.MAIN_RFQ;
    networkTitle = 'RFQ Generation Network';
  }

  const isActive = (agentType: AgentType) => activeAgents.includes(agentType);

  return (
    <div className="relative w-full h-80 bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">
        {networkTitle}
      </h3>
      
      {/* Main agent in the center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{
            scale: isActive(mainAgent) ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: isActive(mainAgent) ? Infinity : 0,
            repeatType: 'reverse',
          }}
        >
          <AgentAvatar agentType={mainAgent} size="lg" showBadge={isActive(mainAgent)} />
          <div className="mt-2 text-center text-sm font-medium text-neutral-800 dark:text-neutral-200">
            {mainAgent}
          </div>
        </motion.div>
      </div>
      
      {/* Surrounding agents */}
      {agentsToDisplay.filter(agent => agent !== mainAgent).map((agentType, index) => {
        const angle = (index * (2 * Math.PI)) / (agentsToDisplay.length - 1);
        const radius = 100; // Distance from center
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        return (
          <div
            key={agentType}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
            }}
          >
            <motion.div
              animate={{
                scale: isActive(agentType) ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: isActive(agentType) ? Infinity : 0,
                repeatType: 'reverse',
              }}
            >
              <AgentAvatar agentType={agentType} showBadge={isActive(agentType)} />
              <div className="mt-2 text-center text-xs font-medium text-neutral-800 dark:text-neutral-200">
                {agentType}
              </div>
            </motion.div>
          </div>
        );
      })}
      
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        {agentsToDisplay.filter(agent => agent !== mainAgent).map((agentType, index) => {
          const angle = (index * (2 * Math.PI)) / (agentsToDisplay.length - 1);
          const radius = 100;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          
          return (
            <motion.line
              key={`line-${agentType}`}
              x1="50%"
              y1="50%"
              x2={`calc(50% + ${x}px)`}
              y2={`calc(50% + ${y}px)`}
              stroke={isActive(agentType) ? "#6366f1" : "#d1d5db"}
              strokeWidth="2"
              strokeDasharray={isActive(agentType) ? "0" : "5,5"}
              initial={{ opacity: 0.3 }}
              animate={{ 
                opacity: isActive(agentType) ? 1 : 0.3,
                strokeDashoffset: isActive(agentType) ? [0, 100] : 0
              }}
              transition={{
                duration: isActive(agentType) ? 2 : 0,
                repeat: isActive(agentType) ? Infinity : 0,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};
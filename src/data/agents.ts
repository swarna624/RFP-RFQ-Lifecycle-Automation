import { Agent, AgentType } from '../types';

export const agents: Agent[] = [
  {
    id: 'rfp-gen',
    type: AgentType.MAIN_RFP,
    name: 'RFP Generator',
    description: 'Creates detailed RFP documents from user requirements',
    icon: 'file-text',
    color: 'primary-600',
  },
  {
    id: 'proposal-gen',
    type: AgentType.MAIN_PROPOSAL,
    name: 'Proposal Generator',
    description: 'Creates comprehensive proposals in response to RFPs',
    icon: 'clipboard-check',
    color: 'secondary-600',
  },
  {
    id: 'security-agent',
    type: AgentType.SECURITY,
    name: 'Security Agent',
    description: 'Analyzes security requirements and compliance needs',
    icon: 'shield',
    color: 'error-600',
  },
  {
    id: 'scale-agent',
    type: AgentType.SCALABILITY,
    name: 'Scalability Agent',
    description: 'Evaluates system scaling requirements and infrastructure needs',
    icon: 'bar-chart',
    color: 'success-600',
  },
  {
    id: 'budget-agent',
    type: AgentType.BUDGETING,
    name: 'Budget Agent',
    description: 'Analyzes cost implications and budget constraints',
    icon: 'dollar-sign',
    color: 'warning-600',
  },
  {
    id: 'tech-agent',
    type: AgentType.TECH_LEAD,
    name: 'Tech Lead Agent',
    description: 'Provides technical specifications and architecture recommendations',
    icon: 'code',
    color: 'primary-700',
  },
  {
    id: 'legal-agent',
    type: AgentType.LEGAL,
    name: 'Legal Agent',
    description: 'Reviews legal implications and contract terms',
    icon: 'scale',
    color: 'neutral-600',
  },
  {
    id: 'estimate-agent',
    type: AgentType.ESTIMATION,
    name: 'Estimation Agent',
    description: 'Calculates time and resource estimates for deliverables',
    icon: 'calculator',
    color: 'accent-600',
  },
  {
    id: 'timeline-agent',
    type: AgentType.TIMELINE,
    name: 'Timeline Agent',
    description: 'Creates project timelines and milestone schedules',
    icon: 'calendar',
    color: 'secondary-700',
  },
  {
    id: 'terms-agent',
    type: AgentType.TERMS_CONDITIONS,
    name: 'Terms & Conditions Validator',
    description: 'Validates legal, ethical and compliance requirements',
    icon: 'check-square',
    color: 'error-700',
  },
];

export const getAgentByType = (type: AgentType): Agent => {
  const agent = agents.find(agent => agent.type === type);
  if (!agent) {
    throw new Error(`Agent with type ${type} not found`);
  }
  return agent;
};

export const getAgentById = (id: string): Agent => {
  const agent = agents.find(agent => agent.id === id);
  if (!agent) {
    throw new Error(`Agent with id ${id} not found`);
  }
  return agent;
};
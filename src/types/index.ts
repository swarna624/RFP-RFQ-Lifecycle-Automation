// Agent types
export enum AgentType {
  SECURITY = 'Security',
  SCALABILITY = 'Scalability',
  BUDGETING = 'Budgeting',
  TECH_LEAD = 'Tech Lead',
  LEGAL = 'Legal',
  ESTIMATION = 'Estimation',
  TIMELINE = 'Timeline',
  TERMS_CONDITIONS = 'Terms & Conditions',
  MAIN_RFP = 'RFP Generator',
  MAIN_PROPOSAL = 'Proposal Generator',
  MAIN_RFQ = 'RFQ Generator',
  MAIN_QUOTATION = 'Quotation Generator',
}

export enum MessageType {
  USER = 'user',
  AGENT = 'agent',
  SYSTEM = 'system',
}

export enum WorkflowStage {
  INPUT = 'input',
  PROCESSING = 'processing',
  RFP_GENERATED = 'rfp_generated',
  PROPOSAL_GENERATED = 'proposal_generated',
  RFQ_GENERATED = 'rfq_generated',
  QUOTATION_GENERATED = 'quotation_generated',
  COMPLETED = 'completed',
}

export interface Message {
  id: string;
  content: string;
  sender: AgentType | 'User';
  type: MessageType;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  messages: Message[];
}

export interface Agent {
  id: string;
  type: AgentType;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface RfpDocument {
  id: string;
  title: string;
  sections: RfpSection[];
  createdAt: Date;
  lastUpdated: Date;
}

export interface RfpSection {
  id: string;
  title: string;
  content: string;
}

export interface ProposalDocument {
  id: string;
  title: string;
  rfpId: string;
  sections: ProposalSection[];
  createdAt: Date;
  lastUpdated: Date;
  flags: ComplianceFlag[];
}

export interface ProposalSection {
  id: string;
  title: string;
  content: string;
  agentType: AgentType;
}

export interface ComplianceFlag {
  id: string;
  sectionId: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestion: string;
}

export interface RfqDocument {
  id: string;
  title: string;
  sections: RfqSection[];
  createdAt: Date;
  lastUpdated: Date;
}

export interface RfqSection {
  id: string;
  title: string;
  content: string;
}

export interface QuotationDocument {
  id: string;
  title: string;
  sections: QuotationSection[];
  createdAt: Date;
  lastUpdated: Date;
}

export interface QuotationSection {
  id: string;
  title: string;
  content: string;
}
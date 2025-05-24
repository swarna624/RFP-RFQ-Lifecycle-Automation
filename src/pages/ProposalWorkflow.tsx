import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ConversationPanel } from '../components/ConversationPanel';
import { AgentNetwork } from '../components/AgentNetwork';
import { DocumentPreview } from '../components/DocumentPreview';
import { WorkflowProgress } from '../components/WorkflowProgress';
import {
  Message,
  MessageType,
  AgentType,
  WorkflowStage,
  ProposalDocument,
  ProposalSection,
  ComplianceFlag,
} from '../types';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { generateDocumentContent } from '../config/api';

// Mock data for demonstration
const mockProposalDocument: ProposalDocument = {
  id: '2',
  title: 'Proposal: Mobile Application for Logistics Tracking',
  rfpId: '1',
  sections: [
    {
      id: '2-1',
      title: 'Executive Summary',
      content: 'Our company proposes to develop a high-performance, scalable mobile application for logistics tracking that will support 100,000 concurrent users. The application will provide real-time tracking, route optimization, and delivery status updates across iOS and Android platforms.',
      agentType: AgentType.MAIN_PROPOSAL,
    },
    {
      id: '2-2',
      title: 'Technical Approach',
      content: 'We propose a React Native-based mobile application with a Node.js backend running on Kubernetes. The system will utilize GraphQL for efficient data fetching, Redis for caching, and PostgreSQL for data storage. Real-time features will be implemented using WebSockets, and the application will support offline functionality through a local SQLite database that syncs when connectivity is restored.',
      agentType: AgentType.TECH_LEAD,
    },
    {
      id: '2-3',
      title: 'Security Implementation',
      content: 'The solution will implement industry-standard security measures including end-to-end encryption (AES-256), OAuth 2.0 with MFA for authentication, JWTs for authorization, and regular security audits. All data will be encrypted at rest and in transit, and we will comply with GDPR, CCPA, and relevant data protection regulations.',
      agentType: AgentType.LEGAL,
    },
    {
      id: '2-4',
      title: 'Project Timeline',
      content: 'The project will be completed in 24 weeks with the following milestones:\n\nWeeks 1-4: Requirements Analysis and Design\nWeeks 5-12: Development Phase 1 (Core Functionality)\nWeeks 13-16: Mid-project Review and Adjustments\nWeeks 17-20: Development Phase 2 (Advanced Features)\nWeeks 21-22: QA and Testing\nWeeks 23-24: Deployment and Training',
      agentType: AgentType.TIMELINE,
    },
    {
      id: '2-5',
      title: 'Cost Estimation',
      content: 'Total Project Cost: $298,500\n\nBreakdown:\n- Development: $179,100 (60%)\n- Testing: $44,775 (15%)\n- Deployment: $29,850 (10%)\n- Training: $14,925 (5%)\n- Maintenance (6 months): $29,850 (10%)\n\nPayment Schedule:\n- 20% upon contract signing\n- 30% at midpoint review\n- 40% at completion of development\n- 10% after acceptance testing',
      agentType: AgentType.ESTIMATION,
    },
  ],
  createdAt: new Date(),
  lastUpdated: new Date(),
  flags: [
    {
      id: 'flag-1',
      sectionId: '2-3',
      severity: 'medium',
      description: 'Security implementation lacks mention of penetration testing',
      suggestion: 'Add regular penetration testing to the security measures',
    },
    {
      id: 'flag-2',
      sectionId: '2-5',
      severity: 'high',
      description: 'Payment terms may create cash flow risk',
      suggestion: 'Consider requesting a higher percentage upfront (25-30%)',
    },
  ],
};

// Simulated agent responses
const agentResponses: { [key in AgentType]?: string } = {
  [AgentType.TECH_LEAD]: "Based on the RFP requirements, I recommend a React Native mobile application with a Node.js backend deployed on Kubernetes. The architecture should use GraphQL for efficient data fetching, Redis for caching, and PostgreSQL for data storage. WebSockets will provide real-time updates, and we'll implement offline mode with local SQLite.",
  [AgentType.LEGAL]: "I've reviewed the security requirements and recommend implementing end-to-end encryption (AES-256), OAuth 2.0 with MFA, JWTs for authorization, and regular security audits. We'll need to ensure GDPR and CCPA compliance and establish data retention policies that meet industry standards.",
  [AgentType.ESTIMATION]: "I estimate the total project cost at $298,500, with 60% allocated to development, 15% to testing, 10% to deployment, 5% to training, and 10% to 6 months of maintenance. I recommend a payment schedule with 20% upfront, 30% at midpoint, 40% at development completion, and 10% after acceptance testing.",
  [AgentType.TIMELINE]: "I've created a 24-week project timeline with clear milestones: 4 weeks for requirements and design, 8 weeks for core development, 4 weeks for review and adjustments, 4 weeks for advanced features, 2 weeks for testing, and 2 weeks for deployment and training.",
  [AgentType.TERMS_CONDITIONS]: "I've identified two compliance issues in the proposal: 1) The security section doesn't mention required penetration testing (medium severity), and 2) The payment terms create cash flow risk with too little upfront payment (high severity). I recommend addressing these issues before submission.",
  [AgentType.MAIN_PROPOSAL]: "I've compiled a comprehensive proposal based on input from specialized agents covering technical approach, security implementation, timeline, and cost estimates. The document follows RFP requirements and includes all requested details for client evaluation."
};

export const ProposalWorkflow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<WorkflowStage>(WorkflowStage.INPUT);
  const [activeAgents, setActiveAgents] = useState<AgentType[]>([]);
  const [document, setDocument] = useState<ProposalDocument | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSendMessage = (content: string) => {
    // Store current scroll position
    const currentScroll = window.scrollY;

    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'User',
      type: MessageType.USER,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    setIsProcessing(true);
    setStage(WorkflowStage.PROCESSING);
    
    // Activate agents one by one with delays
    setTimeout(() => {
      setActiveAgents([AgentType.MAIN_PROPOSAL]);
      
      setTimeout(() => {
        setActiveAgents([AgentType.MAIN_PROPOSAL, AgentType.TECH_LEAD]);
        addAgentMessage(AgentType.TECH_LEAD);
        
        setTimeout(() => {
          setActiveAgents([AgentType.MAIN_PROPOSAL, AgentType.TECH_LEAD, AgentType.LEGAL]);
          addAgentMessage(AgentType.LEGAL);
          
          setTimeout(() => {
            setActiveAgents([
              AgentType.MAIN_PROPOSAL,
              AgentType.TECH_LEAD,
              AgentType.LEGAL,
              AgentType.ESTIMATION,
            ]);
            addAgentMessage(AgentType.ESTIMATION);
            
            setTimeout(() => {
              setActiveAgents([
                AgentType.MAIN_PROPOSAL,
                AgentType.TECH_LEAD,
                AgentType.LEGAL,
                AgentType.ESTIMATION,
                AgentType.TIMELINE,
              ]);
              addAgentMessage(AgentType.TIMELINE);
              
              setTimeout(() => {
                addAgentMessage(AgentType.MAIN_PROPOSAL);
                setDocument(mockProposalDocument);
                setStage(WorkflowStage.PROPOSAL_GENERATED);
                
                // Now activate the T&C validator
                setTimeout(() => {
                  setActiveAgents([
                    AgentType.MAIN_PROPOSAL,
                    AgentType.TERMS_CONDITIONS,
                  ]);
                  addAgentMessage(AgentType.TERMS_CONDITIONS);
                  setStage(WorkflowStage.COMPLETED);
                  setIsProcessing(false);
                  
                  // Reset active agents after completion
                  setTimeout(() => {
                    setActiveAgents([]);
                  }, 2000);
                }, 3000);
              }, 2000);
            }, 2000);
          }, 2000);
        }, 2000);
      }, 2000);
    }, 1000);

    // Restore scroll position after state updates
    requestAnimationFrame(() => {
      window.scrollTo({
        top: currentScroll,
        behavior: 'instant'
      });
    });
  };
  
  const addAgentMessage = (agentType: AgentType) => {
    const content = agentResponses[agentType] || "Processing request...";
    
    const agentMessage: Message = {
      id: uuidv4(),
      content,
      sender: agentType,
      type: MessageType.AGENT,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, agentMessage]);
  };

  const handleDownload = () => {
    if (document) {
      // Create a new PDF document
      const pdf = new jsPDF();
      
      // Set font styles
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      
      // Add title
      pdf.text(document.title, 20, 20);
      
      // Add creation date
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Created: ${document.createdAt.toLocaleDateString()}`, 20, 30);
      
      // Add sections
      let yPosition = 40;
      document.sections.forEach((section, index) => {
        // Add section title
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text(section.title, 20, yPosition);
        yPosition += 10;
        
        // Add section content
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        
        // Split content into lines and add to PDF
        const contentLines = pdf.splitTextToSize(section.content, 170);
        contentLines.forEach((line: string) => {
          if (yPosition > 270) { // Check if we need a new page
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(line, 20, yPosition);
          yPosition += 7;
        });
        
        yPosition += 10; // Add space between sections
      });

      // Add compliance flags if any
      if (document.flags && document.flags.length > 0) {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('Compliance Flags', 20, yPosition);
        yPosition += 10;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        
        document.flags.forEach((flag) => {
          const flagText = `Severity: ${flag.severity}\nDescription: ${flag.description}\nSuggestion: ${flag.suggestion}`;
          const flagLines = pdf.splitTextToSize(flagText, 170);
          
          flagLines.forEach((line: string) => {
            if (yPosition > 270) {
              pdf.addPage();
              yPosition = 20;
            }
            pdf.text(line, 20, yPosition);
            yPosition += 7;
          });
          
          yPosition += 10;
        });
      }
      
      // Save the PDF with .pdf extension
      const fileName = `${document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      pdf.save(fileName);

      // Mark workflow as completed
      setStage(WorkflowStage.COMPLETED);
      
      // Add a completion message
      const completionMessage: Message = {
        id: uuidv4(),
        content: "Proposal document has been downloaded in PDF format and the workflow is now complete.",
        sender: AgentType.MAIN_PROPOSAL,
        type: MessageType.AGENT,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, completionMessage]);
    }
  };

  const handleGenerateContent = async (sectionId: string, prompt: string) => {
    try {
      setIsGenerating(true);
      setError(null);
      
      const generatedContent = await generateDocumentContent(prompt, 'proposal');
      
      // Update the section with generated content
      setDocument(prev => {
        if (!prev) return null;
        return {
          ...prev,
          sections: prev.sections.map(section => 
            section.id === sectionId 
              ? { ...section, content: generatedContent }
              : section
          )
        };
      });
    } catch (err) {
      setError('Failed to generate content. Please try again.');
      console.error('Error generating content:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Proposal Generation Workflow
        </h1>
        {document && stage === WorkflowStage.PROPOSAL_GENERATED && (
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <Download size={18} className="mr-2" />
            Download Proposal
          </button>
        )}
      </div>
      
      <WorkflowProgress 
        currentStage={stage} 
        workflowType="proposal" 
        onStageChange={(newStage) => {
          // Only allow moving to completed stages or the next stage
          const stageOrder = Object.values(WorkflowStage);
          const currentIndex = stageOrder.indexOf(stage);
          const newIndex = stageOrder.indexOf(newStage);
          
          if (newIndex <= currentIndex + 1) {
            // Store current scroll position
            const currentScroll = window.scrollY;
            
            setStage(newStage);
            
            // Update document and agents based on stage
            if (newStage === WorkflowStage.PROPOSAL_GENERATED || newStage === WorkflowStage.COMPLETED) {
              setDocument(mockProposalDocument);
              setActiveAgents([AgentType.MAIN_PROPOSAL]);
            } else if (newStage === WorkflowStage.PROCESSING) {
              setActiveAgents([
                AgentType.MAIN_PROPOSAL,
                AgentType.TECH_LEAD,
                AgentType.LEGAL,
                AgentType.ESTIMATION,
                AgentType.TIMELINE,
                AgentType.TERMS_CONDITIONS
              ]);
            } else {
              setDocument(null);
              setActiveAgents([]);
            }

            // Restore scroll position after state updates
            requestAnimationFrame(() => {
              window.scrollTo({
                top: currentScroll,
                behavior: 'instant'
              });
            });
          }
        }}
      />
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="flex flex-col h-full">
          <AgentNetwork activeAgents={activeAgents} stage="proposal" />
          
          <div className="flex-1 mt-6">
            <ConversationPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              isProcessing={isProcessing}
            />
          </div>
        </div>
        
        <div className="h-full">
          {document ? (
            <DocumentPreview document={document} type="proposal" />
          ) : (
            <div className="flex items-center justify-center h-full bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                  No Proposal Document Yet
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
                  Start by submitting an RFP or describing what kind of proposal you need.
                  Our AI agents will collaborate to generate a detailed proposal document.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        {document?.sections.map((section) => (
          <div key={section.id} className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                {section.title}
              </h3>
              <button
                onClick={() => handleGenerateContent(section.id, `Generate content for ${section.title} section of a proposal document.`)}
                disabled={isGenerating}
                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg hover:from-primary-700 hover:to-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? 'Generating...' : 'Generate Content'}
              </button>
            </div>
            <textarea
              value={section.content}
              onChange={(e) => handleGenerateContent(section.id, e.target.value)}
              className="w-full h-32 p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder={`Enter content for ${section.title}...`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
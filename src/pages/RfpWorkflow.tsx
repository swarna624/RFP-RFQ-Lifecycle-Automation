import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ConversationPanel } from '../components/ConversationPanel';
import { AgentNetwork } from '../components/AgentNetwork';
import { DocumentPreview } from '../components/DocumentPreview';
import { WorkflowProgress } from '../components/WorkflowProgress';
import { Message, MessageType, AgentType, WorkflowStage, RfpDocument, RfpSection } from '../types';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { generateDocumentContent } from '../config/api';

// Mock data for demonstration
const mockRfpDocument: RfpDocument = {
  id: '1',
  title: 'Request for Proposal: Mobile Application for Logistics Tracking',
  sections: [
    {
      id: '1-1',
      title: 'Project Overview',
      content: 'Development of a mobile application for real-time logistics tracking, capable of supporting up to 100,000 concurrent users. The application will provide real-time tracking, route optimization, and delivery status updates.',
    },
    {
      id: '1-2',
      title: 'Technical Requirements',
      content: '- Cross-platform mobile application (iOS and Android)\n- Real-time tracking capabilities\n- Integration with existing logistics management systems\n- Push notifications for status updates\n- Offline functionality\n- Map visualization with route optimization\n- User authentication and role-based permissions',
    },
    {
      id: '1-3',
      title: 'Security Requirements',
      content: '- End-to-end encryption for all data transmission\n- Compliance with GDPR and relevant data protection regulations\n- Secure authentication using industry standards (OAuth 2.0, JWT)\n- Regular security audits and penetration testing\n- Data backup and disaster recovery plans',
    },
    {
      id: '1-4',
      title: 'Scalability Requirements',
      content: '- Support for 100,000 concurrent users\n- Elastic infrastructure to handle peak loads\n- Response time under 500ms for 95% of requests\n- 99.9% uptime guarantee\n- Horizontal scaling capability for both frontend and backend components',
    },
    {
      id: '1-5',
      title: 'Budget Considerations',
      content: '- Total budget range: $250,000 - $350,000\n- Breakdown expectations: Development (60%), Testing (15%), Deployment (10%), Training (5%), Maintenance (10%)\n- Payment schedule tied to project milestones\n- Additional budget allowance for third-party services and APIs',
    },
    {
      id: '1-6',
      title: 'Submission Requirements',
      content: '- Detailed technical approach\n- Project timeline with milestones\n- Team composition and relevant experience\n- Cost breakdown\n- References from similar projects\n- Sample deliverables or portfolio',
    },
  ],
  createdAt: new Date(),
  lastUpdated: new Date(),
};

// Simulated agent responses
const agentResponses: { [key in AgentType]?: string } = {
  [AgentType.SECURITY]: "Based on the requirements for a logistics tracking application supporting 100k users, I recommend implementing end-to-end encryption, OAuth 2.0 authentication, regular penetration testing, and compliance with GDPR. Additionally, we should implement rate limiting to prevent DDoS attacks and ensure secure API endpoints.",
  [AgentType.SCALABILITY]: "For an application supporting 100k concurrent users, I recommend a microservices architecture deployed on a cloud platform with auto-scaling capabilities. Use of a CDN for static content, database sharding, and caching mechanisms will be essential. We should target 500ms response times and implement load testing to verify scalability.",
  [AgentType.BUDGETING]: "Based on the scope, I estimate a budget range of $250,000 to $350,000. This includes development costs (60%), QA (15%), deployment (10%), training (5%), and 6 months of maintenance (10%). Third-party services like maps API and push notifications should be budgeted separately.",
  [AgentType.MAIN_RFP]: "I've analyzed the input and consulted with specialized agents. I've generated a comprehensive RFP document that includes technical requirements, security specifications, scalability needs, and budget considerations. The document is structured for vendor evaluation with clear submission guidelines."
};

export const RfpWorkflow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<WorkflowStage>(WorkflowStage.INPUT);
  const [activeAgents, setActiveAgents] = useState<AgentType[]>([]);
  const [document, setDocument] = useState<RfpDocument | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSendMessage = (content: string) => {
    // Store current scroll position
    const currentScroll = window.scrollY;
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'User',
      type: MessageType.USER,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Simulate processing
    setIsProcessing(true);
    setStage(WorkflowStage.PROCESSING);
    
    // Activate agents one by one with delays
    setTimeout(() => {
      setActiveAgents([AgentType.MAIN_RFP]);
      
      setTimeout(() => {
        setActiveAgents([AgentType.MAIN_RFP, AgentType.SECURITY]);
        addAgentMessage(AgentType.SECURITY);
        
        setTimeout(() => {
          setActiveAgents([AgentType.MAIN_RFP, AgentType.SECURITY, AgentType.SCALABILITY]);
          addAgentMessage(AgentType.SCALABILITY);
          
          setTimeout(() => {
            setActiveAgents([
              AgentType.MAIN_RFP,
              AgentType.SECURITY,
              AgentType.SCALABILITY,
              AgentType.BUDGETING,
            ]);
            addAgentMessage(AgentType.BUDGETING);
            
            setTimeout(() => {
              addAgentMessage(AgentType.MAIN_RFP);
              setDocument(mockRfpDocument);
              setStage(WorkflowStage.RFP_GENERATED);
              
              // Add a delay before marking as completed
              setTimeout(() => {
                setStage(WorkflowStage.COMPLETED);
                setIsProcessing(false);
                
                // Reset active agents after completion
                setTimeout(() => {
                  setActiveAgents([]);
                }, 2000);
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
      
      // Save the PDF with .pdf extension
      const fileName = `${document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      pdf.save(fileName);

      // Mark workflow as completed
      setStage(WorkflowStage.COMPLETED);
      
      // Add a completion message
      const completionMessage: Message = {
        id: uuidv4(),
        content: "RFP document has been downloaded in PDF format and the workflow is now complete.",
        sender: AgentType.MAIN_RFP,
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
      
      const generatedContent = await generateDocumentContent(prompt, 'rfp');
      
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
          RFP Generation Workflow
        </h1>
        {document && (stage === WorkflowStage.RFP_GENERATED || stage === WorkflowStage.COMPLETED) && (
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <Download size={18} className="mr-2" />
            Download RFP
          </button>
        )}
      </div>
      
      <WorkflowProgress 
        currentStage={stage} 
        workflowType="rfp" 
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
            if (newStage === WorkflowStage.RFP_GENERATED || newStage === WorkflowStage.COMPLETED) {
              setDocument(mockRfpDocument);
              setActiveAgents([AgentType.MAIN_RFP]);
            } else if (newStage === WorkflowStage.PROCESSING) {
              setActiveAgents([AgentType.MAIN_RFP, AgentType.SECURITY, AgentType.SCALABILITY, AgentType.BUDGETING]);
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
          <AgentNetwork activeAgents={activeAgents} stage="rfp" />
          
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
            <DocumentPreview document={document} type="rfp" />
          ) : (
            <div className="flex items-center justify-center h-full bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                  No RFP Document Yet
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
                  Start by describing your requirements in the conversation panel.
                  Our AI agents will collaborate to generate a detailed RFP document.
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
                onClick={() => handleGenerateContent(section.id, `Generate content for ${section.title} section of an RFP document.`)}
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
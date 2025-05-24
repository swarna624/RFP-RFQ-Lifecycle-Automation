import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ConversationPanel } from '../components/ConversationPanel';
import { AgentNetwork } from '../components/AgentNetwork';
import { DocumentPreview } from '../components/DocumentPreview';
import { WorkflowProgress } from '../components/WorkflowProgress';
import { Message, MessageType, AgentType, WorkflowStage, QuotationDocument, QuotationSection } from '../types';
import { Send, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

// Mock data for demonstration
const mockQuotationDocument: QuotationDocument = {
  id: '1',
  title: 'Quotation: Office Supplies',
  sections: [
    {
      id: '1-1',
      title: 'Product Details',
      content: 'Office supplies including paper, pens, and notebooks.',
    },
    {
      id: '1-2',
      title: 'Pricing',
      content: 'Paper: $5 per ream, Pens: $2 each, Notebooks: $3 each.',
    },
    {
      id: '1-3',
      title: 'Delivery Terms',
      content: 'Delivery within 2 weeks of order confirmation.',
    },
  ],
  createdAt: new Date(),
  lastUpdated: new Date(),
};

// Simulated agent responses
const agentResponses: { [key in AgentType]?: string } = {
  [AgentType.MAIN_QUOTATION]: "I've analyzed the input and generated a detailed quotation for office supplies. The document includes product details, pricing, and delivery terms.",
};

export const QuotationWorkflow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<WorkflowStage>(WorkflowStage.INPUT);
  const [activeAgents, setActiveAgents] = useState<AgentType[]>([]);
  const [document, setDocument] = useState<QuotationDocument | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

    setTimeout(() => {
      setActiveAgents([AgentType.MAIN_QUOTATION]);
      addAgentMessage(AgentType.MAIN_QUOTATION);
      setDocument(mockQuotationDocument);
      setStage(WorkflowStage.QUOTATION_GENERATED);
      
      // Add a delay before marking as completed
      setTimeout(() => {
        setStage(WorkflowStage.COMPLETED);
        setIsProcessing(false);
        
        // Reset active agents after completion
        setTimeout(() => {
          setActiveAgents([]);
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
        content: "Quotation document has been downloaded in PDF format and the workflow is now complete.",
        sender: AgentType.MAIN_QUOTATION,
        type: MessageType.AGENT,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, completionMessage]);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Quotation Creation Workflow
        </h1>
        {document && (stage === WorkflowStage.QUOTATION_GENERATED || stage === WorkflowStage.COMPLETED) && (
          <button
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <Download size={18} className="mr-2" />
            Download Quotation
          </button>
        )}
      </div>

      <WorkflowProgress 
        currentStage={stage} 
        workflowType="quotation" 
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
            if (newStage === WorkflowStage.QUOTATION_GENERATED || newStage === WorkflowStage.COMPLETED) {
              setDocument(mockQuotationDocument);
              setActiveAgents([AgentType.MAIN_QUOTATION]);
            } else if (newStage === WorkflowStage.PROCESSING) {
              setActiveAgents([AgentType.MAIN_QUOTATION]);
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
          <AgentNetwork activeAgents={activeAgents} stage="quotation" />

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
            <DocumentPreview document={document} type="quotation" />
          ) : (
            <div className="flex items-center justify-center h-full bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                  No Quotation Document Yet
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
                  Start by describing your requirements in the conversation panel.
                  Our AI agents will collaborate to generate a detailed quotation document.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 
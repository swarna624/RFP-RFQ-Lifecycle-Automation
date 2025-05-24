import React from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Flag } from 'lucide-react';
import { RfpDocument, ProposalDocument, RfqDocument, QuotationDocument, ComplianceFlag } from '../types';

type DocumentPreviewProps = {
  document: RfpDocument | ProposalDocument | RfqDocument | QuotationDocument;
  type: 'rfp' | 'proposal' | 'rfq' | 'quotation';
};

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, type }) => {
  // Check if document is a ProposalDocument by checking for flags property
  const isProposal = 'flags' in document;
  const flags = isProposal ? (document as ProposalDocument).flags : [];
  
  const getSectionFlags = (sectionId: string): ComplianceFlag[] => {
    if (!isProposal) return [];
    return flags.filter((flag) => flag.sectionId === sectionId);
  };
  
  const getSeverityColor = (severity: 'low' | 'medium' | 'high'): string => {
    switch (severity) {
      case 'low':
        return 'text-warning-500 bg-warning-50';
      case 'medium':
        return 'text-warning-600 bg-warning-50';
      case 'high':
        return 'text-error-600 bg-error-50';
      default:
        return 'text-neutral-500 bg-neutral-50';
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">
          {type === 'rfp' ? 'RFP Document' : type === 'proposal' ? 'Proposal Document' : type === 'rfq' ? 'RFQ Document' : 'Quotation Document'}
        </h3>
        <div className="flex space-x-2">
          <button className="p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full">
            <Copy size={18} />
          </button>
          <button className="p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full">
            <Download size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2 text-neutral-900 dark:text-white">
              {document.title}
            </h1>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              Created: {document.createdAt.toLocaleDateString()}
              {' | '}
              Last updated: {document.lastUpdated.toLocaleDateString()}
            </div>
          </div>
          
          {document.sections.map((section) => {
            const sectionFlags = getSectionFlags(section.id);
            return (
              <div key={section.id} className="mb-6">
                <h2 className="text-lg font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                  {section.title}
                </h2>
                <div className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap mb-4">
                  {section.content}
                </div>
                
                {sectionFlags.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {sectionFlags.map((flag) => (
                      <div 
                        key={flag.id} 
                        className={`p-3 rounded-md flex items-start ${getSeverityColor(flag.severity)}`}
                      >
                        <Flag size={16} className="mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-sm">
                            {flag.description}
                          </div>
                          <div className="text-xs mt-1">
                            Suggestion: {flag.suggestion}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
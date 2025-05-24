import React from 'react';
import { FileText, FileQuestion, FileCheck, FileSpreadsheet } from 'lucide-react';

interface DocumentTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: 'rfp' | 'rfq' | 'proposal' | 'quotation') => void;
}

export const DocumentTypeDialog: React.FC<DocumentTypeDialogProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  if (!isOpen) return null;

  const documentTypes = [
    {
      type: 'rfp',
      title: 'Request for Proposal (RFP)',
      description: 'Create a detailed request for proposal document',
      icon: FileQuestion,
    },
    {
      type: 'rfq',
      title: 'Request for Quotation (RFQ)',
      description: 'Create a request for quotation document',
      icon: FileText,
    },
    {
      type: 'proposal',
      title: 'Proposal Creation',
      description: 'Create a comprehensive proposal document',
      icon: FileCheck,
    },
    {
      type: 'quotation',
      title: 'Quotation Creation',
      description: 'Create a detailed quotation document',
      icon: FileSpreadsheet,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
          Select Document Type
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documentTypes.map((docType) => (
            <button
              key={docType.type}
              onClick={() => onSelect(docType.type as any)}
              className="flex items-start p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              <docType.icon className="w-6 h-6 text-primary-600 mr-3 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  {docType.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {docType.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}; 
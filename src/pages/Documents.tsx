import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, FileQuestion, FileCheck, FileSpreadsheet, Download, Trash2, Eye } from 'lucide-react';
import { DocumentTypeDialog } from '../components/DocumentTypeDialog';
import { jsPDF } from 'jspdf';

interface Document {
  id: string;
  title: string;
  createdAt: Date;
  status: 'draft' | 'completed';
}

export const Documents: React.FC = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Mock documents data - in a real app, this would come from an API
  const [documents, setDocuments] = useState<{
    rfp: Document[];
    rfq: Document[];
    proposal: Document[];
    quotation: Document[];
  }>({
    rfp: [
      { id: '1', title: 'RFP for Mobile App Development', createdAt: new Date(), status: 'completed' },
      { id: '2', title: 'RFP for Website Redesign', createdAt: new Date(), status: 'draft' },
    ],
    rfq: [
      { id: '1', title: 'RFQ for Office Supplies', createdAt: new Date(), status: 'completed' },
    ],
    proposal: [
      { id: '1', title: 'Proposal for Mobile App Development', createdAt: new Date(), status: 'completed' },
    ],
    quotation: [
      { id: '1', title: 'Quotation for Office Supplies', createdAt: new Date(), status: 'completed' },
    ],
  });

  const handleCreateDocument = () => {
    setIsDialogOpen(true);
  };

  const handleDocumentTypeSelect = (type: 'rfp' | 'rfq' | 'proposal' | 'quotation') => {
    setIsDialogOpen(false);
    
    // Add a new document to the selected type
    const newDocument: Document = {
      id: Date.now().toString(),
      title: `New ${type.toUpperCase()} Document`,
      createdAt: new Date(),
      status: 'draft'
    };

    setDocuments(prev => ({
      ...prev,
      [type]: [...prev[type], newDocument]
    }));

    // Navigate to the appropriate workflow
    switch (type) {
      case 'rfp':
        navigate('/rfp-workflow');
        break;
      case 'rfq':
        navigate('/rfq-workflow');
        break;
      case 'proposal':
        navigate('/proposal-workflow');
        break;
      case 'quotation':
        navigate('/quotation-workflow');
        break;
    }
  };

  const handleDeleteDocument = (type: keyof typeof documents, id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => ({
        ...prev,
        [type]: prev[type].filter(doc => doc.id !== id)
      }));
    }
  };

  const handleViewDocument = (type: keyof typeof documents, id: string) => {
    // Navigate to the appropriate workflow with the document ID
    switch (type) {
      case 'rfp':
        navigate(`/rfp-workflow?id=${id}`);
        break;
      case 'rfq':
        navigate(`/rfq-workflow?id=${id}`);
        break;
      case 'proposal':
        navigate(`/proposal-workflow?id=${id}`);
        break;
      case 'quotation':
        navigate(`/quotation-workflow?id=${id}`);
        break;
    }
  };

  const handleDownloadDocument = (type: keyof typeof documents, id: string) => {
    const document = documents[type].find(doc => doc.id === id);
    if (!document) return;

    // Create a PDF document
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
    
    // Add document type
    pdf.text(`Type: ${type.toUpperCase()}`, 20, 40);
    
    // Add status
    pdf.text(`Status: ${document.status}`, 20, 50);
    
    // Save the PDF
    const fileName = `${document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    pdf.save(fileName);
  };

  const handleCreateNewDocument = (type: keyof typeof documents) => {
    // Show the document type selection dialog
    setIsDialogOpen(true);
  };

  const renderDocumentList = (type: keyof typeof documents) => {
    const docs = documents[type];
    if (!docs.length) {
      return (
        <div className="text-center py-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
            No documents yet
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {docs.map(doc => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3 bg-gradient-to-r from-neutral-50 to-white dark:from-neutral-700 dark:to-neutral-800 rounded-lg hover:shadow-md transition-all duration-300 border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                {doc.title}
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {doc.createdAt.toLocaleDateString()}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  doc.status === 'completed' 
                    ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-200'
                    : 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 dark:from-yellow-900/30 dark:to-yellow-800/30 dark:text-yellow-200'
                }`}>
                  {doc.status}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => handleViewDocument(type, doc.id)}
                className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 bg-neutral-100 dark:bg-neutral-700 rounded-lg transition-colors"
                title="View document"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={() => handleDownloadDocument(type, doc.id)}
                className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 bg-neutral-100 dark:bg-neutral-700 rounded-lg transition-colors"
                title="Download document"
              >
                <Download size={16} />
              </button>
              <button
                onClick={() => handleDeleteDocument(type, doc.id)}
                className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 bg-neutral-100 dark:bg-neutral-700 rounded-lg transition-colors"
                title="Delete document"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const documentTypes = [
    {
      type: 'rfp' as const,
      title: 'RFP Documents',
      description: 'Request for Proposal documents and their responses',
      icon: FileQuestion,
      createRoute: '/rfp-workflow',
    },
    {
      type: 'rfq' as const,
      title: 'RFQ Documents',
      description: 'Request for Quotation documents and their responses',
      icon: FileText,
      createRoute: '/rfq-workflow',
    },
    {
      type: 'proposal' as const,
      title: 'Proposals',
      description: 'Generated proposal documents and their status',
      icon: FileCheck,
      createRoute: '/proposal-workflow',
    },
    {
      type: 'quotation' as const,
      title: 'Quotations',
      description: 'Generated quotation documents and their status',
      icon: FileSpreadsheet,
      createRoute: '/quotation-workflow',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Documents
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {documentTypes.map((docType) => (
          <div
            key={docType.type}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 mr-3">
                  <docType.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  {docType.title}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700 px-3 py-1 rounded-full">
                  {documents[docType.type].length} documents
                </span>
                <button
                  onClick={() => setExpandedSection(expandedSection === docType.type ? null : docType.type)}
                  className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 bg-neutral-100 dark:bg-neutral-700 rounded-lg transition-colors"
                >
                  {expandedSection === docType.type ? '▼' : '▶'}
                </button>
              </div>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
              {docType.description}
            </p>
            {expandedSection === docType.type && (
              <div className="mt-4">
                {renderDocumentList(docType.type)}
              </div>
            )}
          </div>
        ))}
      </div>

      <DocumentTypeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSelect={handleDocumentTypeSelect}
      />
    </div>
  );
}; 
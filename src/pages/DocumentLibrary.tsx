import React, { useState } from 'react';
import { FileText, Clock, Download, ExternalLink, Search, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { RfpDocument, ProposalDocument } from '../types';

// Mock data
const mockDocuments = [
  {
    id: '1',
    title: 'RFP: Mobile App for Logistics Tracking',
    type: 'rfp',
    createdAt: new Date('2025-02-10'),
    hasProposal: true,
  },
  {
    id: '2',
    title: 'RFP: Enterprise CRM System',
    type: 'rfp',
    createdAt: new Date('2025-03-05'),
    hasProposal: false,
  },
  {
    id: '3',
    title: 'Proposal: Mobile App for Logistics Tracking',
    type: 'proposal',
    createdAt: new Date('2025-02-15'),
    rfpId: '1',
  },
  {
    id: '4',
    title: 'RFP: Cloud Migration Strategy',
    type: 'rfp',
    createdAt: new Date('2025-01-20'),
    hasProposal: true,
  },
  {
    id: '5',
    title: 'Proposal: Cloud Migration Strategy',
    type: 'proposal',
    createdAt: new Date('2025-01-25'),
    rfpId: '4',
  },
];

export const DocumentLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'rfp' | 'proposal'>('all');
  
  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || doc.type === filter;
    return matchesSearch && matchesFilter;
  });
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-4 md:mb-0">
          Document Library
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documents..."
              className="pl-10 pr-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-xl w-full sm:w-64 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-neutral-400" size={18} />
          </div>
          
          <div className="flex rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-600 shadow-sm">
            <button
              className={`px-4 py-2.5 text-sm transition-colors ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2.5 text-sm transition-colors ${
                filter === 'rfp'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
              }`}
              onClick={() => setFilter('rfp')}
            >
              RFPs
            </button>
            <button
              className={`px-4 py-2.5 text-sm transition-colors ${
                filter === 'proposal'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
              }`}
              onClick={() => setFilter('proposal')}
            >
              Proposals
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Document cards */}
        {filteredDocuments.map((doc) => (
          <motion.div
            key={doc.id}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-all duration-300"
          >
            <div className={`h-2 ${doc.type === 'rfp' ? 'bg-gradient-to-r from-primary-600 to-primary-500' : 'bg-gradient-to-r from-secondary-600 to-secondary-500'}`} />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-2.5 rounded-lg ${
                    doc.type === 'rfp'
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                      : 'bg-gradient-to-br from-secondary-500 to-secondary-600'
                  }`}
                >
                  <FileText size={20} className="text-white" />
                </div>
                <div className="flex space-x-2">
                  <button className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                    <Download size={16} />
                  </button>
                  <button className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-2 line-clamp-2">
                {doc.title}
              </h3>
              <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                <Clock size={14} className="mr-1" />
                {format(doc.createdAt, 'MMM d, yyyy')}
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    doc.type === 'rfp'
                      ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 dark:from-primary-900/30 dark:to-primary-800/30 dark:text-primary-300'
                      : 'bg-gradient-to-r from-secondary-50 to-secondary-100 text-secondary-700 dark:from-secondary-900/30 dark:to-secondary-800/30 dark:text-secondary-300'
                  }`}
                >
                  {doc.type === 'rfp' ? 'RFP' : 'Proposal'}
                </span>
                
                {doc.type === 'rfp' && (
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      doc.hasProposal
                        ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-300'
                        : 'bg-gradient-to-r from-neutral-50 to-neutral-100 text-neutral-600 dark:from-neutral-800 dark:to-neutral-700 dark:text-neutral-400'
                    }`}
                  >
                    {doc.hasProposal ? 'Has Proposal' : 'No Proposal'}
                  </span>
                )}
                
                {doc.type === 'proposal' && doc.rfpId && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-neutral-50 to-neutral-100 text-neutral-600 dark:from-neutral-800 dark:to-neutral-700 dark:text-neutral-400">
                    Linked to RFP #{doc.rfpId}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredDocuments.length === 0 && (
        <div className="mt-8 text-center p-8 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-2">
            No documents found
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
            {searchTerm
              ? `No documents matching "${searchTerm}" were found. Try a different search term.`
              : 'No documents in this category yet. Create your first document to get started.'}
          </p>
        </div>
      )}
    </div>
  );
};
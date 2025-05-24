import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MessageSquare, BarChart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <MessageSquare size={24} className="text-primary-600" />,
      title: 'Conversational RFP Creation',
      description:
        'Transform vague requirements into detailed RFP documents through natural language conversation with specialized AI agents.',
    },
    {
      icon: <FileText size={24} className="text-secondary-600" />,
      title: 'Automated Proposal Generation',
      description:
        'Generate comprehensive proposals in response to RFPs with specialized agents for technical, legal, timeline and budget considerations.',
    },
    {
      icon: <BarChart size={24} className="text-accent-600" />,
      title: 'Compliance Validation',
      description:
        'Automatically validate proposals against legal and regulatory requirements with real-time flags and suggestions for improvement.',
    },
  ];
  
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          AI-Powered RFP/RFQ Lifecycle Automation
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
          Streamline your procurement process with our collaborative multi-agent system
          that automates RFP generation and proposal creation.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              Create an RFP
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-6">
              Start with a simple description of your needs, and our specialized AI agents
              will work together to create a comprehensive Request for Proposal document.
            </p>
            <button
              onClick={() => navigate('/rfp')}
              className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Get Started
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
              Generate a Proposal
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-6">
              Convert an RFP into a detailed proposal with our proposal generation
              system. Our agents handle technical, legal, timeline, and budget considerations.
            </p>
            <button
              onClick={() => navigate('/proposal')}
              className="flex items-center px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg transition-colors"
            >
              Create Proposal
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 text-center">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm"
            >
              <div className="rounded-full w-12 h-12 flex items-center justify-center bg-neutral-100 dark:bg-neutral-700 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-8 text-center"
      >
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
          Ready to streamline your procurement process?
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 mb-6 max-w-2xl mx-auto">
          Our AI-powered system saves time and improves quality by automating the entire
          RFP/RFQ lifecycle from requirements gathering to proposal generation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/rfp')}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Create an RFP
          </button>
          <button
            onClick={() => navigate('/documents')}
            className="px-6 py-3 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors"
          >
            View Document Library
          </button>
        </div>
      </motion.div>
    </div>
  );
};
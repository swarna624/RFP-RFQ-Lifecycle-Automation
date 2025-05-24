import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { RfpWorkflow } from './pages/RfpWorkflow';
import { RfqWorkflow } from './pages/RfqWorkflow';
import { ProposalWorkflow } from './pages/ProposalWorkflow';
import { QuotationWorkflow } from './pages/QuotationWorkflow';
import { DocumentLibrary } from './pages/DocumentLibrary';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rfp" element={<RfpWorkflow />} />
            <Route path="/rfq" element={<RfqWorkflow />} />
            <Route path="/proposal" element={<ProposalWorkflow />} />
            <Route path="/quotation" element={<QuotationWorkflow />} />
            <Route path="/documents" element={<DocumentLibrary />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
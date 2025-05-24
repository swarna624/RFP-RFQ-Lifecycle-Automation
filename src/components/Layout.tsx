import React, { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, FileText, MessageSquare, Home, Layers, PanelLeft, Sun, Moon, ClipboardCheck, Folder } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

type LayoutProps = {
  children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode, setLightMode } = useTheme();

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'RFP', path: '/rfp', icon: <FileText size={20} /> },
    { name: 'RFQ', path: '/rfq', icon: <FileText size={20} /> },
    { name: 'Proposal Creation', path: '/proposal', icon: <ClipboardCheck size={20} /> },
    { name: 'Quotation Creation', path: '/quotation', icon: <ClipboardCheck size={20} /> },
    { name: 'Documents', path: '/documents', icon: <Folder size={20} /> },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={`flex h-screen bg-neutral-50 ${darkMode ? 'dark' : ''}`}>
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white dark:bg-neutral-800 shadow-md"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className={`fixed md:relative z-30 w-64 h-full bg-white dark:bg-neutral-900 shadow-lg`}
          >
            <div className="p-4">
              <div className="flex items-center justify-center py-4">
                <PanelLeft className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                <h1 className="ml-2 text-xl font-semibold text-neutral-800 dark:text-white">
                  RFP/RFQ System
                </h1>
              </div>
              <nav className="mt-8">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <button
                        onClick={() => {
                          navigate(item.path);
                          if (window.innerWidth < 768) setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors
                          ${
                            location.pathname === item.path
                              ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                              : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                          }
                        `}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="absolute bottom-0 w-full p-4 border-t border-neutral-200 dark:border-neutral-700">
              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-center w-full px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                {darkMode ? <Sun size={18} className="mr-2" /> : <Moon size={18} className="mr-2" />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-900 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
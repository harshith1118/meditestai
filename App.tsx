import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Library, 
  Settings, 
  LogOut, 
  Activity,
  Share2
} from 'lucide-react';
import { TestCase, Priority, ComplianceStandard, TestStatus } from './types';
import Dashboard from './components/Dashboard';
import Generator from './components/Generator';
import TestCaseList from './components/TestCaseList';

// Initial Mock Data
const INITIAL_DATA: TestCase[] = [
  {
    id: 'tc-001',
    title: 'User Login Audit Trail Verification',
    description: 'Verify that every successful and failed login attempt creates a timestamped audit log entry.',
    preconditions: 'Database audit service is running.',
    priority: Priority.HIGH,
    complianceTags: [ComplianceStandard.HIPAA, ComplianceStandard.FDA_21_CFR_11],
    status: TestStatus.APPROVED,
    createdAt: new Date().toISOString(),
    traceabilityId: 'REQ-AUTH-005',
    steps: [
      { stepNumber: 1, action: 'Navigate to login page', expectedResult: 'Login form displayed' },
      { stepNumber: 2, action: 'Enter valid credentials', expectedResult: 'User logged in' },
      { stepNumber: 3, action: 'Check Audit Log table', expectedResult: 'New entry "LOGIN_SUCCESS" present with current timestamp' }
    ]
  },
  {
    id: 'tc-002',
    title: 'Patient Data Encryption at Rest',
    description: 'Ensure patient demographic data is encrypted in the database.',
    preconditions: 'Access to DB direct query.',
    priority: Priority.HIGH,
    complianceTags: [ComplianceStandard.HIPAA],
    status: TestStatus.REVIEWED,
    createdAt: new Date().toISOString(),
    traceabilityId: 'REQ-SEC-012',
    steps: [
      { stepNumber: 1, action: 'Create new patient', expectedResult: 'Patient saved successfully' },
      { stepNumber: 2, action: 'Query database directly for patient name', expectedResult: 'Name field appears as ciphertext' }
    ]
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'generate' | 'library'>('dashboard');
  const [testCases, setTestCases] = useState<TestCase[]>(INITIAL_DATA);
  const [showExportToast, setShowExportToast] = useState(false);

  const handleNewCases = (cases: TestCase[]) => {
    setTestCases(prev => [...cases, ...prev]);
    setActiveTab('library');
  };

  const handleExport = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex shrink-0 transition-all duration-300">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Activity size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">MediTestAI</h1>
              <p className="text-xs text-slate-400">FDA/HIPAA Compliant</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
          />
          <NavButton 
            active={activeTab === 'generate'} 
            onClick={() => setActiveTab('generate')} 
            icon={<PlusCircle size={20} />} 
            label="Generate Cases" 
          />
          <NavButton 
            active={activeTab === 'library'} 
            onClick={() => setActiveTab('library')} 
            icon={<Library size={20} />} 
            label="Test Library" 
            badge={testCases.length}
          />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
           <button className="flex w-full items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium">
            <Settings size={20} />
            Settings
          </button>
          <div className="flex items-center gap-3 px-4 py-3 mt-auto">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">JD</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Jane Doe</p>
              <p className="text-xs text-slate-500 truncate">QA Lead</p>
            </div>
            <LogOut size={16} className="text-slate-500 cursor-pointer hover:text-white" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header (Mobile & Actions) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="md:hidden font-bold text-slate-900 flex items-center gap-2">
             <Activity size={24} className="text-blue-600" /> MediTestAI
          </div>
          <div className="hidden md:block text-slate-500 text-sm">
             Project: <span className="font-semibold text-slate-900">Hospital Management System (v2.4)</span>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
             >
                <Share2 size={16} />
                Export to Jira
             </button>
          </div>
        </header>

        {/* Scrollable View Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                {activeTab === 'dashboard' && 'QA Overview'}
                {activeTab === 'generate' && 'AI Test Generation'}
                {activeTab === 'library' && 'Test Case Library'}
              </h2>
              <p className="text-slate-500">
                {activeTab === 'dashboard' && 'Real-time metrics on test coverage and compliance.'}
                {activeTab === 'generate' && 'Transform requirements into compliant test scenarios using Gemini 3.'}
                {activeTab === 'library' && 'Manage and execute your verification protocols.'}
              </p>
            </div>

            {activeTab === 'dashboard' && <Dashboard testCases={testCases} />}
            {activeTab === 'generate' && <Generator onTestCasesGenerated={handleNewCases} />}
            {activeTab === 'library' && <TestCaseList testCases={testCases} />}
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {showExportToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-up z-50">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div>
            <p className="font-medium text-sm">Export Successful</p>
            <p className="text-xs text-slate-400">5 Test Cases pushed to Jira (Project: MED)</p>
          </div>
        </div>
      )}

      {/* Mobile Nav (Bottom) */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-3 z-40">
        <MobileNavBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20} />} />
        <MobileNavBtn active={activeTab === 'generate'} onClick={() => setActiveTab('generate')} icon={<PlusCircle size={24} className="text-blue-600" />} />
        <MobileNavBtn active={activeTab === 'library'} onClick={() => setActiveTab('library')} icon={<Library size={20} />} />
      </div>
    </div>
  );
};

// Sub-components for Nav to keep it clean
const NavButton = ({ active, onClick, icon, label, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
      ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
  >
    {icon}
    <span className="flex-1 text-left">{label}</span>
    {badge && <span className="px-2 py-0.5 bg-slate-800 text-white rounded text-xs">{badge}</span>}
  </button>
);

const MobileNavBtn = ({ active, onClick, icon }: any) => (
  <button onClick={onClick} className={`p-2 rounded-full ${active ? 'bg-slate-100' : ''}`}>
    {icon}
  </button>
);

export default App;

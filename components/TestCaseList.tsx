import React from 'react';
import { TestCase, Priority, ComplianceStandard, TestStatus } from '../types';
import { CheckCircle2, Clock, AlertOctagon, FileText, ChevronRight } from 'lucide-react';

interface TestCaseListProps {
  testCases: TestCase[];
}

const TestCaseList: React.FC<TestCaseListProps> = ({ testCases }) => {
  if (testCases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
        <FileText size={48} className="mb-4 opacity-20" />
        <p>No test cases generated yet. Go to the "Generate" tab.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {testCases.map((tc) => (
        <div key={tc.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 transition-colors group cursor-pointer">
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border 
                  ${tc.priority === Priority.HIGH ? 'bg-red-50 text-red-700 border-red-200' : 
                    tc.priority === Priority.MEDIUM ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                    'bg-blue-50 text-blue-700 border-blue-200'}`}>
                  {tc.priority}
                </span>
                 <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border 
                  ${tc.status === TestStatus.APPROVED ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {tc.status}
                </span>
                <span className="text-xs text-slate-400 font-mono">{tc.traceabilityId}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600">{tc.title}</h3>
              <p className="text-slate-600 text-sm mb-3 line-clamp-2">{tc.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {tc.complianceTags.map(tag => (
                  <span key={tag} className="inline-flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    <ShieldIcon tag={tag} />
                    <span className="ml-1">{tag}</span>
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center sm:flex-col sm:items-end gap-2 text-slate-400">
               <ChevronRight size={20} />
            </div>
          </div>
          
          {/* Expanded Preview (Steps) - Simplified for list view */}
          <div className="mt-4 pt-4 border-t border-slate-100 hidden group-hover:block animate-fade-in">
             <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Steps Preview</h4>
             <ul className="space-y-2">
                {tc.steps.slice(0, 2).map((step, idx) => (
                   <li key={idx} className="text-sm text-slate-600 flex gap-2">
                      <span className="font-mono text-slate-400">{step.stepNumber}.</span>
                      <span>{step.action}</span>
                   </li>
                ))}
                {tc.steps.length > 2 && <li className="text-xs text-slate-400 italic">+{tc.steps.length - 2} more steps...</li>}
             </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

const ShieldIcon = ({ tag }: { tag: string }) => {
  if (tag.includes('HIPAA')) return <CheckCircle2 size={12} className="text-emerald-500" />;
  if (tag.includes('FDA')) return <AlertOctagon size={12} className="text-blue-500" />;
  return <Clock size={12} className="text-slate-400" />;
};

export default TestCaseList;

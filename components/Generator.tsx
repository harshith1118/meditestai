import React, { useState, useCallback } from 'react';
import { generateTestCasesFromRequirement } from '../services/geminiService';
import { TestCase, ComplianceStandard, Priority } from '../types';
import { Sparkles, Loader2, ArrowRight, Save, Trash2 } from 'lucide-react';

interface GeneratorProps {
  onTestCasesGenerated: (cases: TestCase[]) => void;
}

const Generator: React.FC<GeneratorProps> = ({ onTestCasesGenerated }) => {
  const [requirement, setRequirement] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<TestCase[] | null>(null);
  const [selectedStandards, setSelectedStandards] = useState<ComplianceStandard[]>([ComplianceStandard.HIPAA]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!requirement.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedResult(null);

    try {
      const results = await generateTestCasesFromRequirement(requirement, selectedStandards);
      setGeneratedResult(results);
    } catch (err) {
      setError("Failed to generate test cases. Please ensure your API key is set and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAll = useCallback(() => {
    if (generatedResult) {
      onTestCasesGenerated(generatedResult);
      setGeneratedResult(null);
      setRequirement('');
    }
  }, [generatedResult, onTestCasesGenerated]);

  const toggleStandard = (standard: ComplianceStandard) => {
    setSelectedStandards(prev => 
      prev.includes(standard) 
        ? prev.filter(s => s !== standard)
        : [...prev, standard]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Input Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="text-purple-600" size={24} />
          New Requirement
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Compliance Standards</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(ComplianceStandard).map((std) => (
              <button
                key={std}
                onClick={() => toggleStandard(std)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border
                  ${selectedStandards.includes(std) 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
              >
                {std}
              </button>
            ))}
          </div>
        </div>

        <textarea
          className="w-full h-40 p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-700 placeholder:text-slate-400"
          placeholder="Paste your software requirement here (e.g., 'The system must automatically logout users after 15 minutes of inactivity to comply with HIPAA regulations...')"
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
        />

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !requirement.trim()}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white shadow-md
              ${isGenerating || !requirement.trim() 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all'}`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Analyzing Regulations...
              </>
            ) : (
              <>
                Generate Test Cases
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      </div>

      {/* Results Section */}
      {generatedResult && (
        <div className="animate-fade-in space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">Generated Candidates ({generatedResult.length})</h3>
            <div className="flex gap-2">
               <button 
                onClick={() => setGeneratedResult(null)}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} /> Discard
              </button>
              <button 
                onClick={handleSaveAll}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-2 font-medium"
              >
                <Save size={16} /> Save to Library
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {generatedResult.map((tc, idx) => (
              <div key={idx} className="bg-white p-5 rounded-lg border border-blue-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <div className="mb-2">
                   <span className="inline-block px-2 py-0.5 text-xs font-bold text-blue-700 bg-blue-50 rounded mb-2 mr-2">
                     {tc.priority} Priority
                   </span>
                   {tc.complianceTags.map(t => (
                     <span key={t} className="inline-block px-2 py-0.5 text-xs text-slate-500 bg-slate-100 rounded mb-2 mr-2">{t}</span>
                   ))}
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{tc.title}</h4>
                <p className="text-slate-600 text-sm mb-4">{tc.description}</p>
                
                <div className="bg-slate-50 rounded p-3">
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Test Steps</h5>
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-200">
                        <th className="pb-1 font-medium w-12">#</th>
                        <th className="pb-1 font-medium">Action</th>
                        <th className="pb-1 font-medium">Expected Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tc.steps.map((step, i) => (
                        <tr key={i}>
                          <td className="py-2 text-slate-400 font-mono">{step.stepNumber}</td>
                          <td className="py-2 text-slate-700 pr-2">{step.action}</td>
                          <td className="py-2 text-slate-600 italic">{step.expectedResult}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Generator;

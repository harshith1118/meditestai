import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { ShieldCheck, AlertTriangle, FileCheck, Activity } from 'lucide-react';
import { TestCase, Priority, TestStatus } from '../types';

interface DashboardProps {
  testCases: TestCase[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const PRIORITY_COLORS = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#3b82f6'
};

const Dashboard: React.FC<DashboardProps> = ({ testCases }) => {
  // Calculate Stats
  const totalCases = testCases.length;
  const automatedPercent = 65; // Mock metric
  const coveragePercent = 82; // Mock metric

  const statusData = [
    { name: 'Draft', value: testCases.filter(t => t.status === TestStatus.DRAFT).length },
    { name: 'Reviewed', value: testCases.filter(t => t.status === TestStatus.REVIEWED).length },
    { name: 'Approved', value: testCases.filter(t => t.status === TestStatus.APPROVED).length },
  ];

  const priorityData = [
    { name: 'High', value: testCases.filter(t => t.priority === Priority.HIGH).length },
    { name: 'Medium', value: testCases.filter(t => t.priority === Priority.MEDIUM).length },
    { name: 'Low', value: testCases.filter(t => t.priority === Priority.LOW).length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Test Cases" 
          value={totalCases} 
          icon={<FileCheck className="text-blue-600" />} 
          trend="+12% this week"
        />
        <StatCard 
          title="Compliance Score" 
          value={`${coveragePercent}%`} 
          icon={<ShieldCheck className="text-green-600" />} 
          trend="ISO 13485 Ready"
        />
        <StatCard 
          title="Critical Defects" 
          value="3" 
          icon={<AlertTriangle className="text-red-500" />} 
          trend="Requires Attention"
        />
        <StatCard 
          title="Automation Rate" 
          value={`${automatedPercent}%`} 
          icon={<Activity className="text-purple-600" />} 
          trend="+5% from last month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Test Case Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Risk Profile (Priority)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {priorityData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS] || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend }: { title: string, value: string | number, icon: React.ReactNode, trend: string }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
      </div>
      <div className="p-2 bg-slate-50 rounded-lg">
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs text-slate-500">
      <span className="font-medium text-emerald-600 mr-2">{trend}</span>
    </div>
  </div>
);

export default Dashboard;

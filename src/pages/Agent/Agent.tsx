import React, { useState } from 'react';
 import DashboardAgent from './AgentDashboard';
 import AgentOrderList from './AgentOrderList';
// import EntityList from './EntityList';
// import CumulativeEntries from './CumulativeEntries';
// import OrderList from './OrderList';

const Agent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<
    'DashboardAgent' | 'AgentOrderList' 
  >('DashboardAgent');

  const handleTabChange = (
    tab: 'DashboardAgent' | 'AgentOrderList',
  ) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="me-2">
            <button
              className={`inline-block p-4 ${
                activeTab === 'DashboardAgent'
                  ? 'border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  : ''
              }`}
              onClick={() => handleTabChange('DashboardAgent')}
            >
              Tokens List
            </button>
          </li>
          <li className="me-2">
            <button
              className={`inline-block p-4 ${
                activeTab === 'AgentOrderList'
                  ? 'text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500'
                  : 'border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
              onClick={() => handleTabChange('AgentOrderList')}
            >
              Order List
            </button>
          </li>
        
        </ul>
      </div>
      <div>
        {activeTab === 'DashboardAgent' && <DashboardAgent />}
        {activeTab === 'AgentOrderList' && <AgentOrderList />}
       
      </div>
    </div>
  );
};

export default Agent;

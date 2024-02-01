import React, { useState } from 'react';
import EntityList from './EntityList';
import CumulativeEntries from './CumulativeEntries';
import OrderList from './OrderList';

const Entries: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'orderList' | 'cumulativeEntries' | 'entityList'
  >('orderList');

  const handleTabChange = (
    tab: 'orderList' | 'cumulativeEntries' | 'entityList',
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
                activeTab === 'orderList'
                  ? 'text-green-600 border-b-2 border-green-600 rounded-t-lg active dark:text-green-500 dark:border-green-500'
                  : 'border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
              onClick={() => handleTabChange('orderList')}
            >
              Order List
            </button>
          </li>
          <li className="me-2">
            <button
              className={`inline-block p-4 ${
                activeTab === 'entityList'
                  ? 'border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  : ''
              }`}
              onClick={() => handleTabChange('entityList')}
            >
              Entity List
            </button>
          </li>
          <li className="me-2">
            <button
              className={`inline-block p-4 ${
                activeTab === 'cumulativeEntries'
                  ? 'text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500'
                  : 'border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
              onClick={() => handleTabChange('cumulativeEntries')}
            >
              Cumulative Entries
            </button>
          </li>
      
        </ul>
      </div>
      <div>
      {activeTab === 'orderList' && <OrderList />}
        {activeTab === 'entityList' && <EntityList />}
        {activeTab === 'cumulativeEntries' && <CumulativeEntries />}
       
      </div>
    </div>
  );
};

export default Entries;

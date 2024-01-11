import React, { useState } from 'react';
import EntityList from './EntityList';
import CumulativeEntries from './CumulativeEntries';

const Entries: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'entityList' | 'cumulativeEntries'>('entityList');

  const handleTabChange = (tab: 'entityList' | 'cumulativeEntries') => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="me-2">
            <button
              className={`inline-block p-4 ${activeTab === 'entityList' ? 'border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300' : ''}`}
              onClick={() => handleTabChange('entityList')}
            >
              Entity List
            </button>
          </li>
          <li className="me-2">
            <button
              className={`inline-block p-4 ${activeTab === 'cumulativeEntries' ? 'text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
              onClick={() => handleTabChange('cumulativeEntries')}
            >
              Cumulative Entries
            </button>
          </li>
        </ul>
      </div>
      <div>
        {activeTab === 'entityList' && <EntityList />}
        {activeTab === 'cumulativeEntries' && <CumulativeEntries />}
      </div>
    </div>
  );
};

export default Entries;

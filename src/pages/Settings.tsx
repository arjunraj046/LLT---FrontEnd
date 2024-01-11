import React, { useState } from 'react';
import EntryColourSettings from './EntryColourSettings';
import EntryDrawSettings from './EntryDrawSettings';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'EntryColourSettings' | 'EntryDrawSettings'>('EntryColourSettings');

  const handleTabChange = (tab: 'EntryColourSettings' | 'EntryDrawSettings') => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="me-2">
            <button
              className={`inline-block p-4 ${activeTab === 'EntryColourSettings' ? 'border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300' : ''}`}
              onClick={() => handleTabChange('EntryColourSettings')}
            >
             Colour Settings
            </button>
          </li>
          <li className="me-2">
            <button
              className={`inline-block p-4 ${activeTab === 'EntryDrawSettings' ? 'text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
              onClick={() => handleTabChange('EntryDrawSettings')}
            >
            Draw Time Settings
            </button>
          </li>
        </ul>
      </div>
      <div>
        {activeTab === 'EntryColourSettings' && <EntryColourSettings />}
        {activeTab === 'EntryDrawSettings' && <EntryDrawSettings />}
      </div>
    </div>
  );
};

export default Settings;

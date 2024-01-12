import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';

const CumulativeEntries: React.FC = () => {
  const [cumulativeData, setCumulativeData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>(getInitialDate());
  const [tokenNumber, setTokenNumberFilter] = useState<string>('');

  interface Params {
    tokenNumber?: string;
    dateFilter?: string;
    startDate?: string;
  }

  const fetchData = async (params?: Params) => {
    try {
      const response = await axios.get(
        '/api/admin/list-entity-cumulative',
        {
          params: params || {},
        }
      );

      if (response.data.status === 'success') {
        setCumulativeData(response.data.response);
      } else {
        console.error('Error fetching data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const today = new Date();
    const initialDateFilter = today.toISOString().split('T')[0];
    fetchData({ dateFilter: initialDateFilter });
  }, []); // Run only on initial render

  useEffect(() => {
    if (startDate || tokenNumber) {
      fetchData({ dateFilter:startDate, tokenNumber });
    }
  }, [startDate, tokenNumber]);

  function getInitialDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  return (
    <div className="container mx-auto mt-8">
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-5">
          {/* Date Filter */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Select date"
          />
        </div>
        <div className='mb-5'>
          {/* Token Number Filter */}
          <input
            type="text"
            value={tokenNumber}
            onChange={(e) => setTokenNumberFilter(e.target.value)}
            placeholder="Enter token number"
          />
        </div>
        {/* Table Header */}
        <div className="flex flex-col">
        <div
          className={`grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-3 p-2.5 bg-black`}
          style={{ gridTemplateColumns: '1fr 3fr 1fr' }}
        >
          <h5 className="text-white text-center">Sl No</h5>
          <h5 className="text-white text-center">Token Number</h5>
          <h5 className="text-white text-center">Count</h5>
        </div>

        {/* Display Data */}
        {cumulativeData.map((entry, index) => (
          <div
            key={entry._id}
            className={`grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-3 p-2.5`}
            style={{ gridTemplateColumns: '1fr 3fr 1fr' }}
          >
            <div className="text-center">{index + 1}</div>
            <div className="text-center">{entry._id}</div>
            <div className="text-center">{entry.total}</div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default CumulativeEntries;

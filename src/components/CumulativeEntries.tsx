import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';

const CumulativeEntries: React.FC = () => {
  const [cumulativeData, setCumulativeData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>(getInitialDate());
  const [tokenNumber, setTokenNumberFilter] = useState<string>('');
  const [drawTimeList, setDrawTimeList] = useState<any[]>([]);
  const [drawTime, setDrawTime] = useState<string>('');
  const [rangeList, setRangeList] = useState<any[]>([]);
  const [noRecordsFound, setNoRecordsFound] = useState<boolean>(false);

  interface Params {
    tokenNumber?: string;
    dateFilter?: string;
    startDate?: string;
    drawTime?: string;
  }

  useEffect(() => {
    const fetchDrawTimeList = async () => {
      try {
        const drawTimeListResponse = await axios.get<any>('/api/admin/enitity-draw-time-rang-list');
        setDrawTimeList(drawTimeListResponse.data.drawTimeList || []); 
      } catch (error) {
        console.error('Error fetching draw time list:', error);
      }
    };

    const fetchRangeList = async () => {
      try {
        const rangeListResponse = await axios.get<any>('/api/admin/enitity-rang-list');
        setRangeList(rangeListResponse.data.rangeList || []); 
      } catch (error) {
        console.error('Error fetching range list:', error);
        
      }
    };

    fetchDrawTimeList();
    fetchRangeList();
  }, []); // Fetch draw time list and range list on initial render

  const fetchData = async (params?: Params) => {
    try {
      const response = await axios.get('/api/admin/list-entity-cumulative', {
        params: params || {},
      });

      if (response.data.status === 'success') {
        setCumulativeData(response.data.response);
      } else {
        console.error('Error fetching data:', response.data);
        
        setNoRecordsFound(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      
      setNoRecordsFound(true);
    }
  };

  useEffect(() => {
    const today = new Date();
    const initialDateFilter = today.toISOString().split('T')[0];
    fetchData({ dateFilter: initialDateFilter });
  }, []); // Run only on initial render

  useEffect(() => {
    if (startDate || tokenNumber || drawTime) {
      fetchData({ dateFilter: startDate, tokenNumber, drawTime });
    }
  }, [startDate, tokenNumber, drawTime]);
  function getInitialDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  function getRangeColor(total: number) {
    // Implement logic to determine color based on total and rangeList
    // Example: return 'red' if total > 10 and rangeColor is 'red'
    const range = rangeList.find((range) => total >= range.min && total <= range.max);
    return range ? range.color : ''; // Replace with your logic
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
        <div className="mb-5">
          {/* Token Number Filter */}
          <input
            type="text"
            value={tokenNumber}
            onChange={(e) => setTokenNumberFilter(e.target.value)}
            placeholder="Enter token number"
          />
        </div>
        <div className="mb-5 md:mr-5">
          <select
            name="drawTime"
            value={drawTime}
            onChange={(e) => setDrawTime(e.target.value)}
            className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full md:w-50"
          >
            <option value="" disabled>
              Select Draw Time
            </option>
            {drawTimeList.map((drawTime) => (
              <option key={drawTime._id} value={drawTime.drawTime}>
                {drawTime.drawTime}
              </option>
            ))}
            <option value="">None</option>
          </select>
        </div>
        {/* Table Header */}
        <div className="flex flex-col">
          <div
            className={`grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-3 p-2.5 bg-gray-2 dark:bg-meta-4`}
            style={{ gridTemplateColumns: '1fr 3fr 1fr' }}
          >
            <h5 className="text-sm font-medium uppercase xsm:text-base text-center">Sl No</h5>
            <h5 className="text-sm font-medium uppercase xsm:text-base text-center">Token Number</h5>
            <h5 className="text-sm font-medium uppercase xsm:text-base text-center">Count</h5>
          </div>

          
          {
          
          cumulativeData.map((entry, index) => {
             const matchingRange = rangeList.find(
              (range) =>
                parseInt(entry._id) >= range.startRange &&
                parseInt(entry._id) <= range.endRange,
            );
            return(
            
            <div
              key={entry._id}
              className={`grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-3 p-2.5`}
                  style={{ backgroundColor: matchingRange?.color || 'white' }}
            >
              <div  className="flex items-center justify-center">
                <p  className={matchingRange ? 'text-white' : 'text-graydark'}>{index + 1}</p>
                </div>
              <div  className="flex items-center justify-center">
                <p className={matchingRange ? 'text-white' : 'text-graydark'}>{entry._id}</p>
                </div>
              <div  className="flex items-center justify-center">
                <p className={matchingRange ? 'text-white' : 'text-graydark'}>{entry.total}</p>
                </div>
            </div>
            )
})}
)
        </div>
      </div>
    </div>
    
  );
};

export default CumulativeEntries;



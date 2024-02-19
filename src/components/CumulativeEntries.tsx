import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable, { Column } from 'react-data-table-component';
import { backend_Url } from '../api/server';

const CumulativeEntries: React.FC = () => {

  const getInitialDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [cumulativeData, setCumulativeData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>(getInitialDate());
  const [tokenNumber, setTokenNumberFilter] = useState<string>('');
  const [drawTimeList, setDrawTimeList] = useState<any[]>([]);
  const [drawTime, setDrawTime] = useState<string>('');
  const [rangeList, setRangeList] = useState<any[]>([]);
  const [noRecordsFound, setNoRecordsFound] = useState<boolean>(false);



  useEffect(() => {
    const fetchDrawTimeList = async () => {
      try {
        const drawTimeListResponse = await axios.get<any>(
          `${backend_Url}/api/admin/enitity-draw-time-rang-list`,
        );
        setDrawTimeList(drawTimeListResponse.data.drawTimeList || []);
      } catch (error) {
        console.error('Error fetching draw time list:', error);
      }
    };

    const fetchRangeList = async () => {
      try {
        const rangeListResponse = await axios.get<any>(
          `${backend_Url}/api/admin/enitity-rang-list`,
        );
        setRangeList(rangeListResponse.data.rangeList || []);
      } catch (error) {
        console.error('Error fetching range list:', error);
      }
    };

    fetchDrawTimeList();
    fetchRangeList();
  }, []);

  useEffect(() => {
    fetchData();
  }, [startDate, tokenNumber, drawTime]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${backend_Url}/api/admin/list-entity-cumulative`,
        {
          params: {
            dateFilter: startDate,
            tokenNumber,
            drawTime,
          },
        },
      );

      if (response.data.status === 'success') {
        setCumulativeData(response.data.response);
        setNoRecordsFound(false); // Reset the flag if successful data retrieval
      } else {
        console.error('Error fetching data:', response.data);
        setNoRecordsFound(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setNoRecordsFound(true);
    }
  };

  const columns: Column<any>[] = [
    {
      name: 'Sl No',
      selector: (row: any, index: number) => index + 1,
      sortable: true,
    },
    {
      name: 'Token Number',
      selector: (row: { _id: any }) => row._id,
      sortable: true,
    },
    {
      name: 'Count',
      selector: (row: { total: any }) => row.total,
      sortable: true,
    },
  ];

  const data = cumulativeData.map((entry, index) => ({
    ...entry,
    index: index + 1,
  }));

  const conditionalRowStyles = rangeList.map((range) => ({
    when: (row: { total: any }) =>
      row.total >= range.startRange && row.total <= range.endRange,
    style: {
      backgroundColor: range.color,
    },
  }));

  return (
    <div className="container mx-auto mt-8">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h2 className="text-2xl font-bold mb-4">Cumulative Tokens List</h2>
        <div className="flex flex-col md:flex-row">
          <div className="mb-5 md:mr-5">
            {/* Date Filter */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Select date"
              className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full md:w-50"
            />
          </div>
          <div className="mb-5 md:mr-5">
            {/* Token Number Filter */}
            <input
              type="text"
              value={tokenNumber}
              onChange={(e) => setTokenNumberFilter(e.target.value)}
              placeholder="Enter token number"
              className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full md:w-50"
            />
          </div>
          {/* <div className="mb-5 md:mr-5">
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
          </div> */}
        </div>
        <div className="flex flex-col">
          <DataTable
            columns={columns}
            data={data}
            pagination
            conditionalRowStyles={conditionalRowStyles}
            responsive
          />
        </div>
      </div>
    </div>
  );
};

export default CumulativeEntries;

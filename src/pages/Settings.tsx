import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Range {
  _id: string;
  startRange: number;
  endRange: number;
  color: string;
  date: string;
}

const Settings: React.FC = () => {
  const [rangeList, setRangeList] = useState<Range[]>([]);

  useEffect(() => {
    const fetchRangeList = async () => {
      try {
        console.log('axios is calling');

        const response = await axios.get<any>(
          'http://13.233.114.61:5000/api/admin/enitity-rang-list',
        );
        if (response.data.status === 'success') {
          setRangeList(response.data.rangeList);
        } else {
          console.error(
            'API request failed with status:',
            response.data.status,
          );
        }
      } catch (error) {
        console.error('Error fetching range list:', error);
      }
    };
    fetchRangeList();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-end mb-7">
        <Link
          to="/admin/addrange"
          className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-5 xl:px-5"
        >
          Add Range
        </Link>
      </div>
      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Start Range
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              End Range
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Date
            </h5>
          </div>
        </div>

        {rangeList.map((range) => (
          <div
            key={range._id}
            className="grid grid-cols-3 border-b border-stroke dark:border-strokedark "
            style={{ backgroundColor: range.color }}
          >
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-white dark:text-white">{range.startRange}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-white">{range.endRange}</p>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-white dark:text-white">{range.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;

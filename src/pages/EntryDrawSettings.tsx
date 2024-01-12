import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';
import { showAlert } from '../components/tosterComponents/tost';

interface Range {
  _id: string;
  drawTime: number;
//   endRange: number;
//   color: string;
//   date: string;
}

const EntryDrawSettings: React.FC = () => {
  const [drawTimeList, setDrawTimeList] = useState<Range[]>([]);
  (drawTimeList)

  useEffect(() => {
    const fetchDrawTimeList = async () => {
      try {
        console.log('axios is calling');

        const response = await axios.get<any>(
          '/api/admin/enitity-draw-time-rang-list',
        );
        if (response.data.status === 'success') {
            setDrawTimeList(response.data.drawTimeList);
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
    fetchDrawTimeList();
  }, []);
  const formatDrawTime = (drawTime: string) => {
    // Convert drawTime to Date object
    const time = new Date(`2022-01-01 ${drawTime}`);
    // Format time in AM/PM format
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const deleteEntry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        const response = await axios.post(
          '/api/admin/delete-draw-time',
          { id },
        );

        if (response.data.status === 'success') {
          setDrawTimeList((prevList) => prevList.filter((entry) => entry._id !== id));
          showAlert('User Entry Deleted successfully!', 'success');
        }
      } catch (error) {
        console.error('Error making API call:', error);
      }
    }
  };

  return (
    <div className="  rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-end mb-7">
        <Link
          to="/admin/addDrawTime"
          className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-5 xl:px-5"
        >
          Add Time
        </Link>
      </div>
      <div className="flex flex-col">
      <div className="grid grid-cols-2 rounded-sm bg-black dark:bg-meta-4 sm:grid-cols-2 p-2.5">
         
            <h5 className="text-sm font-medium uppercase xsm:text-base text-center">
              Time
            </h5>
            
            <h5 className="text-sm font-medium uppercase xsm:text-base text-center">
              Action
            </h5>
            
         
          {/* <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              End Range
            </h5>
          </div>
          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Date
            </h5>
          </div> */}
        </div>


        {drawTimeList.map((range) => (
            
          <div
            key={range._id}
            className="grid grid-cols-2 border-b border-stroke dark:border-strokedark p-2.5 w-auto"
            // style={{ backgroundColor: range.color }}
          >
            <div className="flex items-center justify-center p-2.5 xl:p-5 ">
              <p className="text-black dark:text-white">{formatDrawTime(String(range.drawTime))}</p>
            </div>
            <div className="flex items-center justify-center">
                      <p className="text-meta-5">
                      <button
              onClick={() => deleteEntry(range._id)}
               >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </p>
                    </div>
            {/* <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-white">{range.endRange}</p>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-white dark:text-white">
                {formatDate(range.date)}
              </p>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EntryDrawSettings;

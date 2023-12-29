import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faTicket,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useSelector } from 'react-redux';
import { user } from '../../redux/reducer/userSlice';
import { Link } from 'react-router-dom';

// interface Person {
//   _id: string;
//   name: string;
//   userName: string;
//   colour: string;
//   count: string;
//   tokenNumber: string;
//   email: string;
//   contactNumber: string;
//   date: string;
// }

const DashboardAgent: React.FC = () => {
  const UserData = useSelector(user);
  console.log('redux data agent dash ', UserData);

  // const [people, setPeople] = useState<Person[]>([]);
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const _id = localStorage.getItem('agentID');
        const response = await axios.post<any>(
          'http://13.233.114.61:5000/api/agent/entity',
          { UserData, _id },
        );
        console.log('Response from POST request:', response.data);
      setList(response?.data?.listEntity);

      } catch (error) {
        console.error('Error making POST request:', error);
      }
    };

    fetchUserDetails();
  }, []);

  // console.log(people);
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className=" flex justify-end mb-7">
        <button className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-semibold text-white hover:bg-opacity-90 lg:px-5 xl:px-5">
          <Link to="/addtoken">
            <FontAwesomeIcon icon={faTicket} /> Add Token
          </Link>
        </button>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4 p-2.5">
          <h5 className="text-sm font-medium uppercase xsm:text-base text-center">
            Token Number
          </h5>
          <h5 className="hidden text-sm font-medium uppercase xsm:text-base text-center sm:block">
            Count
          </h5>

          <h5 className="hidden text-sm font-medium uppercase xsm:text-base text-center sm:block">
            Date
          </h5>

          {/* <h5 className="hidden text-sm font-medium uppercase xsm:text-base text-center sm:block">
            Edit
          </h5> */}
        </div>
{/* person need to change to list items  */}
        {list.map((person) => (
          <div
            key={person._id}
            className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-4 p-2.5"
          >
            <div className="flex items-center justify-center">
              <p className="text-meta-3">{person.tokenNumber}</p>
            </div>
            <div className="hidden items-center justify-center sm:flex">
              <p className="text-black dark:text-white">{person.count}</p>
            </div>

            <div className="hidden items-center justify-center sm:flex">
              <p className="text-meta-5">{formatDate(person.date)}</p>
            </div>
            {/* <div className="hidden items-center justify-center sm:flex">
              <p className="text-meta-5">
                <FontAwesomeIcon icon={faPenToSquare as IconProp} />
              </p>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardAgent;

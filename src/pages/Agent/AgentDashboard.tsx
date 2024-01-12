import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { user } from '../../redux/reducer/userSlice';
import { Link } from 'react-router-dom';
import { showAlert } from '../../components/tosterComponents/tost';

const DashboardAgent: React.FC = () => {
  const UserData = useSelector(user);
  console.log('redux data agent dash ', UserData);

  const [list, setList] = useState<any[]>([]);
  const [reFetch, setReFetch] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const _id =  localStorage.getItem('agentID');
        const token =  localStorage.getItem('token');
        console.log(_id)
        console.log(token)
        const response = await axios.post<any>(
          '/api/agent/entity',
          { UserData, _id },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the Authorization header
            },
          }
        );
        console.log('Response from POST request:', response.data);
        setList(response?.data?.listEntity);
      } catch (error) {
        console.error('Error making POST request:', error);
      }
    };

    fetchUserDetails();
  }, [reFetch]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const deleteEntry = async (id: any) => {
    if (window.confirm('Are you sure you want to delete this entry from the database?')) {
      try {
        console.log(id);

        const response = await axios.post(
          '/api/agent/delete-entity-agent',
          { id },
        );
        console.log('API call successful!', response.data);
        if (response.data.status === 'success') {
          setReFetch((prev) => !prev);
          showAlert('User Entry Delete successfully!', 'success');
        }
      } catch (error) {
        console.error('Error making API call:', error);
      }
    }
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
        <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5 p-2.5">
          <h5 className="text-sm font-medium uppercase xsm:text-base text-center">
            Token Number
          </h5>
          <h5 className="text-sm font-medium uppercase xsm:text-base text-center">
            Count
          </h5>
          <h5 className="text-sm font-medium uppercase xsm:text-base text-center">
            Date
          </h5>
          <h5 className="text-sm font-medium uppercase xsm:text-base text-center">
            Draw Time
          </h5>

          <h5 className="text-sm font-medium uppercase xsm:text-base text-center">
            Action
          </h5>
        </div>

        {list.map((person) => (
          <div
            key={person._id}
            className="grid grid-cols-5 border-b border-stroke dark:border-strokedark sm:grid-cols-5 p-2.5"
          >
            <div className="flex items-center justify-center">
              <p className="text-black dark:text-white">{person.tokenNumber}</p>
            </div>
            <div className="flex items-center justify-center">
              <p className="text-black dark:text-white">{person.count}</p>
            </div>

            <div className="flex items-center justify-center ">
              <p className="text-black dark:text-white">
                {formatDate(person.date)}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <p className="text-black dark:text-white">{person.drawTime}</p>
            </div>
            <div className="flex items-center justify-center">
              <p className="text-meta-5">
                <button
                  onClick={() => deleteEntry(person._id)}
                  >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardAgent;

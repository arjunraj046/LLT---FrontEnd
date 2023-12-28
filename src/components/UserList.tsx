import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  faUnlockKeyhole,
  faUser,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
interface Person {
  _id: string;
  profileImage: string;
  name: string;
  userName: string;
  email: string;
  contactNumber: string;
  status: boolean;
}

const UserList: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get<any>(
          'http://localhost:5000/api/admin/agent-list/',
        );
        setPeople(response.data?.agentList);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className=" flex justify-end mb-7">
        <button className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-semibold text-white hover:bg-opacity-90 lg:px-5 xl:px-5">
          <Link to="/admin/register">
            <FontAwesomeIcon icon={faUserPlus} /> Add User
          </Link>
        </button>
      </div>
      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-7">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              UserName
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Email
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Contact
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Status
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Edit Profile
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Change Password
            </h5>
          </div>
        </div>

        {people.map((person) => (
          <div
            key={person._id}
            className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-7"
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              {/* <div className="flex-shrink-0">
                <img
                  src={person.profileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              </div> */}
              <p className="hidden text-black dark:text-white sm:block">
                {person.name}
              </p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{person.userName}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="m-2">{person.email}</p>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">
                {person.contactNumber}
              </p>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p
              // className={`text- ${  person.status ? 'text-green-500' : 'text-red-500'}`}
              // className={`${person.status ? 'text-green-500' : 'text-red-500'}`}
              >
                {person.status ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <button className="inline-flex items-center justify-center rounded-full bg-form-strokedark py-1.5 px-3 text-center font-semibold text-white hover:bg-opacity-90 l">
                <Link to={`/admin/editprofile/${person._id}`}>
                  <FontAwesomeIcon icon={faUser} /> Edit
                </Link>
              </button>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <button className="inline-flex items-center justify-center rounded-full bg-form-strokedark py-1.5 px-3 text-center font-semibold text-white hover:bg-opacity-90 l">
                <Link to={`/admin/changepassword/${person._id}`}>
                  <FontAwesomeIcon icon={faUnlockKeyhole} /> Edit
                </Link>
              </button>
            </div>
            {/* <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">
               
                {person.status ? 'Active' : 'Inactive'}
              </p>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;

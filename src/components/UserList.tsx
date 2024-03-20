import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { backend_Url } from '../api/server';
import {
  faUnlockKeyhole,
  faUser,
  faUserPlus,
  faEdit,
  faMagnifyingGlass,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { showAlert } from '../components/tosterComponents/tost';
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
          `${backend_Url}/api/admin/agent-list/`,
        );
        setPeople(response.data?.agentList);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const deleteEntry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        const response = await axios.post(
          `${backend_Url}/api/admin/delete-user`,
          { id },
        );

        if (response.data.status === 'success') {
          setPeople((prevList) => prevList.filter((entry) => entry._id !== id));
          showAlert('User Entry Deleted successfully!', 'success');
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
          <Link to="/admin/register">
            <FontAwesomeIcon icon={faUserPlus} /> Add User
          </Link>
        </button>
      </div>
      <div className="flex flex-col">
        <div className="grid grid-cols-5 rounded-sm bg-black dark:bg-meta-4 sm:grid-cols-8">
          <div className=" p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase  xsm:text-base ">
              Sl No
            </h5>
          </div>
          <div className="  hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase  xsm:text-base">
              Name
            </h5>
          </div>
          <div className=" p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              User
            </h5>
          </div>
          {/* <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Email
            </h5>
          </div> */}
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Contact
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Status
            </h5>
          </div>
          {/* <div className=" p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Edit Profile
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Change Password
            </h5>
          </div>
          <div className="p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Delete
            </h5>
          </div> */}
        </div>

        {people.map((person, index) => (
          <div
            key={person._id}
            className="grid grid-cols-5 border-b border-stroke dark:border-strokedark sm:grid-cols-8"
          >
            <div className="items-center justify p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{index + 1}</p>
            </div>
            <div className=" hidden w-auto items-center justify-center p-2.5 sm:flex xl:p-5">
              {/* <div className="flex-shrink-0">
                <img
                  src={person.profileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              </div> */}
              <p className=" text-black dark:text-white sm:block">
                {person.name}
              </p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{person.userName}</p>
            </div>
            {/* <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="m-2">{person.email}</p>
            </div> */}
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">
                {person.contactNumber}
              </p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p
              // className={`text- ${  person.status ? 'text-green-500' : 'text-red-500'}`}
              // className={`${person.status ? 'text-green-500' : 'text-red-500'}`}
              >
                {person.status ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className=" flex items-center justify-center p-2.5 sm:flex xl:p-5">
              <button>
                <Link to={`/admin/editprofile/${person._id}`}>
                  <FontAwesomeIcon icon={faEdit} />
                </Link>
              </button>
            </div>
            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <button>
                <Link to={`/admin/changepassword/${person._id}`}>
                  <FontAwesomeIcon icon={faUnlockKeyhole} />
                </Link>
              </button>
            </div>
            <div className="flex items-center justify-center  p-2.5 sm:flex xl:p-5">
              <p className="text-grey">
                <button onClick={() => deleteEntry(person._id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </p>
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

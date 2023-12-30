import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers';
import { yupResolver } from '@hookform/resolvers/yup';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {  faMagnifyingGlass,   faPenToSquare, } from '@fortawesome/free-solid-svg-icons';
// import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface Person {
  _id: string;
  name: string;
  userName: string;
  colour: string;
  count: string;
  tokenNumber: string;
  email: string;
  contactNumber: string;
  date: string;
}

interface Range {
  _id: string;
  startRange: number;
  endRange: number;
  color: string;
  date: string;
}

const TableTwo: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [rangeList, setRangeList] = useState<Range[]>([]);
  const [totalCount, setTotalCount] = useState<any>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        searchTerm: Yup.string().required('Search term is required'),
      }),
    ),
  });

  const onSubmit = async (data: any) => {
    try {
      console.log('Search data', data?.searchTerm);
      let token = data?.searchTerm;
      const tokenObj = {
        tokenNumber: token,
      };

      console.log('axios is calling', token);

      const response = await axios.get<any>(
        'http://13.233.114.61:5000/api/admin/search-list-entity',
        { params: tokenObj },
      );
      console.log(response);
      setPeople(response.data.list);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const fetchUserDetailsandRange = async () => {
      const fetchRangeList = async () => {
        try {
          console.log('axios is calling');
          const response = await axios.get<any>(
            'http://13.233.114.61:5000/api/admin/enitity-rang-list',
          );
          console.log(response);

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
      try {
        const response = await axios.get<any>(
          'http://13.233.114.61:5000/api/admin/list-entity',
        );

        console.log(response);

        setPeople(response.data.list);
        setTotalCount(response.data.totalCount);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetailsandRange();
  }, []);
  console.log(people);
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  console.log(totalCount);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-4">
        <div className="  ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              <input
                type="text"
                placeholder="Type token to search..."
                {...register('searchTerm')}
                // value={searchQuery}
                // onChange={handleInputChange}
                className="w-full bg-transparent pr-4 pl-9 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute  top-1/2 left-0 -translate-y-1/2"
              >
                <svg
                  className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                    fill=""
                  />
                </svg>
              </button>
            </div>
            {errors.searchTerm && (
              <div className="text-red-500 mt-2">
                {errors.searchTerm.message}
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-7 p-2.5">
          <h5 className="hidden text-sm font-medium uppercase xsm:text-base text-center sm:block">
            Agent Name
          </h5>
          <h5 className="text-sm font-medium uppercase xsm:text-base text-center">
            UserName
          </h5>
          <h5 className="text-sm font-medium uppercase xsm:text-base text-center">
            Token Number
          </h5>
          <h5 className="text-sm font-medium uppercase xsm:text-base text-center">
            Count
          </h5>
          <h5 className="hidden text-sm font-medium uppercase xsm:text-base text-center sm:block">
            Email
          </h5>
          <h5 className="hidden text-sm font-medium uppercase xsm:text-base text-center sm:block">
            Date
          </h5>
          <h5 className="hidden text-sm font-medium uppercase xsm:text-base text-center sm:block">
            Phone
          </h5>
        </div>

        {people.map((person) => (
          <div>
            {rangeList.map((range) => {
              const numberToCheck = parseInt(person.tokenNumber);
              const isInRange =
                numberToCheck >= range.startRange &&
                numberToCheck <= range.endRange;
              if (isInRange) {
                return (
                  <div
                    key={person._id}
                    className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-7 p-2.5"
                    style={{ backgroundColor: range.color }}
                  >
                    <div className="hidden items-center justify-center sm:flex">
                      <p className="text-black dark:text-white">
                        {person.name}
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <p className="text-black dark:text-white">
                        {person.userName}
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <p className="text-black dark:text-white">
                        {person.tokenNumber}
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <p className="text-black dark:text-white">
                        {person.count}
                      </p>
                    </div>
                    <div className="hidden items-center justify-center sm:flex">
                      <p className="text-black dark:text-white">
                        {person.email}
                      </p>
                    </div>
                    <div className="hidden items-center justify-center sm:flex">
                      <p className="text-black dark:text-white">
                        {formatDate(person.date)}
                      </p>
                    </div>
                    <div className="hidden items-center justify-center sm:flex">
                      <p className="text-black dark:text-white">
                        {person.contactNumber}
                      </p>
                    </div>
                  </div>
                );
              }
              // return null
            })}
          </div>
        ))}
        <h2>Total Count : {totalCount}</h2>
      </div>
    </div>
  );
};

export default TableTwo;

// (
//   <div
//   key={person._id}
//   className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-7 p-2.5"
//   // style={{ backgroundColor: range
// >
//   <div className="flex items-center gap-3">
//     <p className="text-black dark:text-white">
//       {person.name}
//     </p>
//   </div>
//   <div className="flex items-center justify-center">
//     <p className="text-black dark:text-white">
//       {person.userName}
//     </p>
//   </div>
//   <div className="flex items-center justify-center">
//     <p className="text-black dark:text-white">{person.tokenNumber}</p>
//   </div>
//   <div className="hidden items-center justify-center sm:flex">
//     <p className="text-black dark:text-white">
//       {person.count}
//     </p>
//   </div>
//   <div className="hidden items-center justify-center sm:flex">
//     <p className="text-black dark:text-white">{person.email}</p>
//   </div>
//   <div className="hidden items-center justify-center sm:flex">
//     <p className="text-black dark:text-white">{formatDate(person.date)}</p>
//   </div>
//   <div className="hidden items-center justify-center sm:flex">
//     <p className="text-black dark:text-white">{person.contactNumber}</p>
//   </div>
// </div>
// )

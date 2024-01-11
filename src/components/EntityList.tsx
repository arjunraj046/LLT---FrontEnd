import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';
import { showAlert } from '../components/tosterComponents/tost';
import { Formik, Form, Field, ErrorMessage } from 'formik';

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

interface FormData {
  searchTerm: string;
  dateFilter: string;
}

const validationSchema = Yup.object().shape({
  searchTerm: Yup.string().matches(
    /^[0-9]+$/,
    'Search term must contain only numbers',
  ),
  dateFilter: Yup.string(), // You can add validation for the dateFilter here if needed
});

const EntityList: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [rangeList, setRangeList] = useState<Range[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [reFetch, setReFetch] = useState<boolean>(false);
  const [noRecordsFound, setNoRecordsFound] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<string>(getInitialDate());
  const [searchTerm, setSearchTerm] = useState<string>('');

  const isInitialRender = useRef(true);

  function getInitialDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  const fetchData = async (params?: { dateFilter?: string; tokenNumber?: string }) => {
    try {
      const responsePeople = await axios.get(
        'http://13.200.244.122/api/admin/search-list-entity',
        {
          params: params || {},
        }
      );

      const responseRange = await axios.get<any>(
        'http://13.200.244.122/api/admin/enitity-rang-list',
      );

      if (
        responsePeople.data.status === 'success'&& 
        responseRange.data.status === 'success'
      ) {
        const peopleList = responsePeople.data.list || [];
        const rangeListData = responseRange.data.rangeList || [];
        const totalCountData = responsePeople.data.totalCount || 0;

        if (isInitialRender.current) {
          setPeople(peopleList);
          setRangeList(rangeListData);
          setTotalCount(totalCountData);
          isInitialRender.current = false;
        } else {
          setPeople(peopleList);
          setRangeList(rangeListData);
          setTotalCount(totalCountData);
        }
      } else {
        console.error(
          'API request failed with status:',
          responsePeople.data.status,
          responseRange.data.status,
        );
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
  }, []);

  useEffect(() => {
    if (!isInitialRender.current) {
      fetchData({ dateFilter, tokenNumber: searchTerm });
    }
  }, [dateFilter, searchTerm, reFetch]);

  const deleteEntry = async (id: any) => {
    if (window.confirm('Are you sure you want to delete ?')) {
      try {
        const response = await axios.post(
          'http://13.200.244.122/api/admin/delete-entity-admin',
          { id },
        );

        if (response.data.status === 'success') {
          setReFetch((prev) => !prev);
          showAlert('User Entry Deleted successfully!', 'success');
        }
      } catch (error) {
        console.error('Error making API call:', error);
      }
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-5">
          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            placeholder="Select date"
          />
        </div>
        <div className="mb-5">
          {/* Token Number Filter */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter token number"
          />
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-8 p-2.5">
            <h5 className="hidden text-sm font-medium uppercase xsm:text-base text-center sm:block">
              Sl No
            </h5>
            <h5 className="text-sm font-medium uppercase xsm:text-base text-center sm:block">
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
              Date
            </h5>
            <h5 className="hidden text-sm font-medium uppercase xsm:text-base text-center sm:block">
              Phone
            </h5>
            <h5 className=" text-sm font-medium uppercase xsm:text-base text-center sm:block">
              Action
            </h5>
          </div>
          {people.length === 0 && noRecordsFound ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
              No records found.
            </div>
          ) : (
            people.map((person, index) => {
              const matchingRange = rangeList.find(
                (range) =>
                  parseInt(person.tokenNumber) >= range.startRange &&
                  parseInt(person.tokenNumber) <= range.endRange,
              );

              if (matchingRange) {
                return (
                  <div
                    key={person._id}
                    className={`grid grid-cols-5 border-b border-stroke dark:border-strokedark sm:grid-cols-8 p-2.5`}
                    style={{ backgroundColor: matchingRange.color }}
                  >
                    <div className="hidden items-center justify-center sm:flex">
                      <p className="text-white">{index + 1}</p>
                    </div>
                    <div className=" items-center justify-center sm:flex">
                      <p className="text-white dark:text-white">
                        {person.name}
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <p className="text-white dark:text-white">
                        {person.userName}
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <p className="text-white dark:text-white">
                        {person.tokenNumber}
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <p className="text-white dark:text-white">
                        {person.count}
                      </p>
                    </div>
                    <div className="hidden items-center justify-center sm:flex">
                      <p className="text-white dark:text-white">
                        {person.date}
                      </p>
                    </div>
                    <div className="hidden items-center justify-center sm:flex">
                      <p className="text-white dark:text-white">
                        {person.contactNumber}
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <p className="text-white">
                        <button
                          onClick={() => deleteEntry(person._id)}
                          >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </p>
                    </div>
                  </div>
                );
              }
              else{
                return (
                  <div
                    key={person._id}
                    className={`grid grid-cols-5 border-b border-stroke dark:border-strokedark sm:grid-cols-8 p-2.5`}
                    style={{ backgroundColor: 'white' }}
                  >
                    <div className="hidden items-center justify-center sm:flex">
                      <p className="text-graydark">{index + 1}</p>
                    </div>
                    <div className=" items-center justify-center sm:flex">
                      <p className="text-graydark dark:text-white">
                        {person.name}
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <p className="text-graydark dark:text-white">
                        {person.userName}
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <p className="text-graydark dark:text-white">
                        {person.tokenNumber}
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <p className="text-graydark dark:text-white">
                        {person.count}
                      </p>
                    </div>
                    <div className="hidden items-center justify-center sm:flex">
                      <p className="text-graydark dark:text-white">
                        {person.date}
                      </p>
                    </div>
                    <div className="hidden items-center justify-center sm:flex">
                      <p className="text-graydark dark:text-white">
                        {person.contactNumber}
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <p className="text-graydark">
                        <button
                          onClick={() => deleteEntry(person._id)}
                          >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </p>
                    </div>
                  </div>
                );

              }

              
            })
          )}
          <h2>Total Count: {totalCount}</h2>
        </div>
      </div>
    </div>
  );
};

export default EntityList;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { showAlert } from '../components/tosterComponents/tost';
import DataTable, { Column } from 'react-data-table-component';
import { backend_Url } from '../../src/api/server';
import { user } from '../redux/reducer/userSlice';
// import DataTableExtensions from 'react-data-table-component-extensions';
// import 'react-data-table-component-extensions/dist/index.css';
// import Pagination from 'react-data-table-component-extensions';

interface Person {
  drawTime: string;
  _id: string;
  name: string;
  username: string;
  userFullName: string;
  colour: string;
  tokenCount: string;
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

interface DrawTime {
  _id: string;
  drawTime: string;
}

const validationSchema = Yup.object().shape({
  searchTerm: Yup.string().matches(
    /^[0-9]+$/,
    'Search term must contain only numbers',
  ),
  dateFilter: Yup.string(),
});

const EntityList: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [rangeList, setRangeList] = useState<Range[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [reFetch, setReFetch] = useState<boolean>(false);
  const [noRecordsFound, setNoRecordsFound] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<string>(getInitialDate());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [username, setUserName] = useState<string>('');
  const [drawTimeList, setDrawTimeList] = useState<DrawTime[]>([]);
  const [drawTime, setDrawTime] = useState<string>('');

  const isInitialRender = useRef(true);

  function getInitialDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  const fetchData = async (params?: {
    dateFilter?: string;
    tokenNumber?: string;
    drawTime?: string;
    username?:string;
    isImport?:number;
  }) => {
    try {
      const responsePeople = await axios.get(`${backend_Url}/api/admin/search-list-entity`, { params: {
        ...params,
        isImport: 0, } });
      const responseRange = await axios.get<any>(`${backend_Url}/api/admin/enitity-rang-list`);
      const drawTimeRange = await axios.get<any>(`${backend_Url}/api/admin/enitity-draw-time-rang-list`);

      if (responsePeople.data.status === 'success' && responseRange.data.status === 'success' && drawTimeRange.data.status === 'success') {
        const peopleList = responsePeople.data.list || [];
        const rangeListData = responseRange.data.rangeList || [];
        const totalCountData = responsePeople.data.totalCount || 0;
        const drawTimeListData = drawTimeRange.data.drawTimeList || [];

        if (isInitialRender.current) {
          setPeople(peopleList);
          setRangeList(rangeListData);
          setTotalCount(totalCountData);
          setDrawTimeList(drawTimeListData);
          isInitialRender.current = false;
        } else {
          setPeople(peopleList);
          setRangeList(rangeListData);
          setTotalCount(totalCountData);
          setDrawTimeList(drawTimeListData);
        }
      } else {
        console.error(
          'API request failed with status:',
          responsePeople.data.status,
          responseRange.data.status,
          drawTimeRange.data.status,
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
      fetchData({ dateFilter, tokenNumber: searchTerm, drawTime,username:username });
    }
  }, [dateFilter, searchTerm, drawTime, reFetch,username]);

  const formatDate = (isoDateString: string) => {
    const dateObject = new Date(isoDateString);

    const day = dateObject.getUTCDate().toString().padStart(2, '0');
    const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getUTCFullYear();

    return `${day}-${month}-${year}`;
  };

  const deleteEntry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        const response = await axios.post(`${backend_Url}/api/admin/delete-entity-admin`, {
          id,
        });

        if (response.data.status === 'success') {
          setReFetch((prev) => !prev);
          showAlert('User Entry Deleted successfully!', 'success');
        }
      } catch (error) {
        console.error('Error making API call:', error);
      }
    }
  };

  const columns: Column<Person>[] = [
    { name: 'Sl No', selector: (row: { index: any; }) => row.index, sortable: true },
    { name: 'User', selector: (row: { username: any; }) => row.username, sortable: true },
    { name: 'Token', selector: (row: { tokenNumber: any; }) => row.tokenNumber, sortable: true },
    { name: 'Count', selector: (row: { tokenCount: any; }) => row.tokenCount, sortable: true },
    { name: 'Date', selector: (row: { date: string; }) => formatDate(row.date), sortable: true },
    { name: 'Time', selector: (row: { drawTime: any; }) => row.drawTime, sortable: true },
   
  ];

  const data = people.map((person, index) => ({
    index: index + 1,
    username: person.username,
    tokenNumber: person.tokenNumber,
    tokenCount: person.tokenCount,
    date: person.date,
    drawTime: person.drawTime,
    _id: person._id,
  }));

  const tableData = {
    columns,
    data,
  };


  
    const conditionalRowStyles = rangeList.map(range => ({
      when: (row: { tokenCount: any }) => row.tokenCount >= range.startRange && row.tokenCount <= range.endRange,
      style: {
        backgroundColor: range.color,
      },
    }));



  return (
    <div className="container mx-auto mt-8">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        
      <h2 className="text-2xl font-bold mb-4">Tokens</h2>
        <div className="flex flex-col md:flex-row">
          <div className="mb-5 md:mr-5">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Select date"
              className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full md:w-50"
            />
          </div>

          <div className="mb-5 md:mr-5">
            <input
              type="number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter token number"
              className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full md:w-50"
            />
          </div>
          <div className="mb-5 md:mr-5">
            <input
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter user"
              className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full md:w-50"
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
        </div>

        <div className="flex flex-col mt-10">
          {/* <DataTableExtensions {...tableData}> */}
            <DataTable
              columns={columns}
              data={data}
              pagination
              // highlightOnHover
              responsive
              conditionalRowStyles={conditionalRowStyles}
              // paginationComponent={Pagination}
            />
          {/* </DataTableExtensions> */}
          <h2>Total Tickets:{totalCount}</h2>
        </div>
      </div>
    </div>
  );
};

export default EntityList;

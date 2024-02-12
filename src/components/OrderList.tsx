import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { showAlert } from '../components/tosterComponents/tost';
import { backend_Url } from '../../src/api/server';
import DataTable, { Column } from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';

interface Person {
  agent: any;
  orderId: any;
  token: any;
  drawTime: string;
  _id: string;
  userFullName: string;
  date: string;
  total:any;
  
}

interface DrawTime {
  _id: string;
  drawTime: string;
}

const validationSchema = Yup.object().shape({
  dateFilter: Yup.string(),
});

const OrderList: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [reFetch, setReFetch] = useState<boolean>(false);
  const [noRecordsFound, setNoRecordsFound] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<string>(getInitialDate());
  const [drawTimeList, setDrawTimeList] = useState<DrawTime[]>([]);
  const [drawTime, setDrawTime] = useState<string>('');
  const navigate = useNavigate();

  const isInitialRender = useRef(true);

  function getInitialDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  const fetchData = async (params?: {
    dateFilter?: string;
    drawTime?: string;
  }) => {
    try {
      const responsePeople = await axios.get(
        `${backend_Url}/api/admin/search-list-order`,
        { params: params || {} },
      );
      const drawTimeRange = await axios.get<any>(
        `${backend_Url}/api/admin/enitity-draw-time-rang-list`,
      );

      if (
        responsePeople.data.status === 'success' &&
        drawTimeRange.data.status === 'success'
      ) {
        const peopleList = responsePeople.data.list || [];

        const drawTimeListData = drawTimeRange.data.drawTimeList || [];

        if (isInitialRender.current) {
          setPeople(peopleList);
          setDrawTimeList(drawTimeListData);
          isInitialRender.current = false;
        } else {
          setPeople(peopleList);
          setDrawTimeList(drawTimeListData);
        }
      } else {
        console.error(
          'API request failed with status:',
          responsePeople.data.status,
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
      fetchData({ dateFilter, drawTime });
    }
  }, [dateFilter, drawTime, reFetch]);

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
        const response = await axios.post(
          `${backend_Url}/api/admin/delete-entity-admin`,
          {
            id,
          },
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

  const columns: Column<any>[] = [
    {
      name: 'Sl No',
      selector: (row: { index: any }) => row.index,
      sortable: true,
    },
    {
      name: 'User',
      selector: (row: { name: any }) => row.name,
      sortable: true,
    },
    {
      name: 'Date',
      selector: (row: { formattedDate: any }) => row.formattedDate,
      sortable: true,
    },
    {
      name: 'Time',
      selector: (row: { drawTime: any }) => row.drawTime,
      sortable: true,
    },
    {
      name: 'Orders',
      selector: (row: { orderId: any }) => row.orderId,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row: {
        userFullName: any;
        agent: any;
        orderId: any;
        token: any;
        drawTime: any;
        total:any;
        formattedDate: any; _id: string 
}) => (
        <div className="flex items-center justify-center">
          <button
            onClick={() => deleteEntry(row._id)}
            style={{ marginRight: '10px' }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <button
            onClick={() =>
              navigate('/admin/orderlist/listTokens', { state: { token: row.token ,drawTime:row.drawTime,date:row.formattedDate,orderId:row.orderId,total:row.total,agent:row.userFullName} })
            }
            style={{ marginRight: '10px' }}
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
        </div>
      ),
    },
  ];
  //   const customStyles = {
  //     headRow: {
  //       style: {
  //         backgroundColor: '#909090',
  //       },
  //     },
  //     headCells: {
  //       style: {
  //         fontSize: '16px',
  //         // borderRadius: '8px', // Equivalent to rounded-lg
  //         // border: '1.5px solid #303030', // Replace 'yourBorderColor' with the desired border color
  //         // backgroundColor: 'transparent',
  //       },
  //     },
  //   };

  const data = people.map((person, index) => ({
    index: index + 1,
    name: person.userFullName,
    formattedDate: formatDate(person.date),
    drawTime: person.drawTime,
    _id: person._id,
    token:person.token,
    orderId:person.orderId,
    total: person.total,
    userFullName: person.userFullName,
  }));

  return (
    <div className="container mx-auto mt-8">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
       
      <h2 className="text-2xl font-bold mb-4">Order List</h2>
        <div className="flex flex-col md:flex-row justify-end">
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
            <select
              name="drawTime"
              value={drawTime}
              onChange={(e) => setDrawTime(e.target.value)}
              className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark pb-4 dark:bg-form-input dark:focus:border-primary w-full md:w-50"
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
          <DataTable
            columns={columns}
            data={data}
            pagination
            highlightOnHover
            responsive
            // customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderList;

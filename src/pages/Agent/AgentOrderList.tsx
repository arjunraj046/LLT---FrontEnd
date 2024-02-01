import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { showAlert } from '../../components/tosterComponents/tost';
import { backend_Url } from '../../api/server';
import DataTable, { Column } from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
interface Person {
  token: any;
  drawTime: string;
  _id: string;
  name: string;
  date: string;
}

interface DrawTime {
  _id: string;
  drawTime: string;
}

const AgentOrderList: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [reFetch, setReFetch] = useState<boolean>(false);
  const [noRecordsFound, setNoRecordsFound] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<string>(getInitialDate());
  const [drawTimeList, setDrawTimeList] = useState<DrawTime[]>([]);
  const [drawTime, setDrawTime] = useState<string>('');
  const navigate = useNavigate();

  function getInitialDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  const fetchData = async () => {
    const _id = localStorage.getItem('agentID');
    try {
      const responsePeople = await axios.post(
        `${backend_Url}/api/agent/order`,
        { _id },
      );
      const drawTimeRange = await axios.get<any>(
        `${backend_Url}/api/admin/enitity-draw-time-rang-list`,
      );

      if (
        responsePeople.data.status === 'success' &&
        drawTimeRange.data.status === 'success'
      ) {
        const peopleList = responsePeople.data.listOrder || [];
        const drawTimeListData = drawTimeRange.data.drawTimeList || [];

        setPeople(peopleList);
        setDrawTimeList(drawTimeListData);
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
    fetchData();
  }, [reFetch]);

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
        const response = await axios.post('/api/admin/delete-entity-admin', {
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

  console.log('data:', people.map(item => item.token));

  const data: {
    index: number;
    formattedDate: string;
    drawTime: any;
    _id: any;
    token: any; // Change 'any' to the actual type of token
  }[] = people.map((person, index) => ({
    index: index + 1,
    formattedDate: formatDate(person.date),
    drawTime: person.drawTime,
    _id: person._id,
    token: person.token,
  }));
  
  const columns: Column<any>[] = [
    {
      name: 'Orders',
      selector: (row: { _id: any }) => row._id,
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
      name: 'Action',
      cell: (row: { _id: string; token: any }) => (
       
          <div className="flex items-center justify-center">
            <button onClick={() => deleteEntry(row._id)} style={{ marginRight: '10px' }}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button onClick={() => navigate('/listTokens', { state: { token: row.token } })}>
            <FontAwesomeIcon icon={faEye} />
          </button>
          </div>
      ),
    },
  ];
  

  


  return (
    <div className="container mx-auto mt-8">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-col mt-10">
          <DataTable
            columns={columns}
            data={data}
            pagination
            highlightOnHover
            responsive
          />
        </div>
      </div>
    </div>
  );
};

export default AgentOrderList;

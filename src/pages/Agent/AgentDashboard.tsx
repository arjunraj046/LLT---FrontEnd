import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { user } from '../../redux/reducer/userSlice';
import DataTable, { Column } from 'react-data-table-component';
import { backend_Url } from '../../api/server';

interface Range {
  _id: string;
  startRange: number;
  endRange: number;
  color: string;
  date: string;
}


const DashboardAgent: React.FC = () => {
  const UserData = useSelector(user);
  console.log('redux data agent dash ', UserData);

  const [list, setList] = useState<any[]>([]);
  const [reFetch, setReFetch] = useState<boolean>(false);
  const [rangeList, setRangeList] = useState<Range[]>([]);
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const _id = localStorage.getItem('agentID');
        const token = localStorage.getItem('token');
        console.log(_id);
        console.log(token);
        const response = await axios.post<any>(
          `${backend_Url}/api/agent/entity`,
          {
            UserData,
            _id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the Authorization header
            },
          },
        );
        
        console.log('Response from POST request:', response.data);
        setList(response?.data?.listEntity);
        const responseRange = await axios.get<any>(`${backend_Url}/api/admin/enitity-rang-list`);
        const rangeListData = responseRange.data.rangeList || [];
        setRangeList(rangeListData);
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
  const formatTime = (timeString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString(
      'en-US',
      options,
    );
  };

  // const deleteEntry = async (id: any) => {
  //   if (
  //     window.confirm(
  //       'Are you sure you want to delete this entry from the database?',
  //     )
  //   ) {
  //     try {
  //       console.log(id);

  //       const response = await axios.post(
  //         `${backend_Url}/api/agent/delete-entity-agent`,
  //         { id },
  //       );
  //       console.log('API call successful!', response.data);
  //       if (response.data.status === 'success') {
  //         setReFetch((prev) => !prev);
  //         showAlert('User Entry Delete successfully!', 'success');
  //       }
  //     } catch (error) {
  //       console.error('Error making API call:', error);
  //     }
  //   }
  // };
  let serialNumber = 0;

  const columns: Column<any>[] = [
    {
      name: 'Sl No',
      selector: (row: any) => ++serialNumber,
      sortable: true,
    },
    {
      name: 'Token Number',
      selector: (row: { tokenNumber: any }) => row.tokenNumber,
      sortable: true,
    },
    {
      name: 'Count',
      selector: (row: { tokenCount: any; count: any }) => row.tokenCount,
      sortable: true,
    },
    {
      name: 'Date',
      selector: (row: { date: string }) => formatDate(row.date),
      sortable: true,
    },
    {
      name: 'Draw Time',
      selector: (row: { drawTime: any }) => formatTime(row.drawTime),
      sortable: true,
    },
    // {
    //   name: 'Actions',
    //   cell: (row: { tokenId: any }) => (
    //     <div>
    //       {/* <button
    //         onClick={() => deleteEntry(row.tokenId)}
    //         style={{ marginRight: '10px' }}
    //       >
    //         <FontAwesomeIcon icon={faTrash} />
    //       </button> */}
    //       {/* <button onClick={() => handlePrint(row)}>
    //         <FontAwesomeIcon icon={faPrint} />
    //       </button> */}
    //     </div>
    //   ),
    // },
  ];
  const conditionalRowStyles = rangeList.map(range => ({
    when: (row: { tokenCount: any }) => row.tokenCount >= range.startRange && row.tokenCount <= range.endRange,
    style: {
      backgroundColor: range.color,
    },
  }));

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
     < h2 className="text-2xl font-bold mb-4">Tokens</h2>

      <DataTable
        columns={columns}
        data={list}
        noHeader
        defaultSortFieldId="count"
        pagination
        paginationPerPage={10}
        conditionalRowStyles={conditionalRowStyles}
      />
    </div>
  );
};

export default DashboardAgent;

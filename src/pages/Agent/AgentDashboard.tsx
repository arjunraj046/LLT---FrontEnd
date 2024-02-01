import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faTrash, faPrint } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { user } from '../../redux/reducer/userSlice';
import { Link } from 'react-router-dom';
import { showAlert } from '../../components/tosterComponents/tost';
import jsPDF from 'jspdf';
import DataTable, { Column } from 'react-data-table-component';
import { backend_Url } from '../../api/server';

const DashboardAgent: React.FC = () => {
  const UserData = useSelector(user);
  console.log('redux data agent dash ', UserData);

  const [list, setList] = useState<any[]>([]);
  const [reFetch, setReFetch] = useState<boolean>(false);

  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);

  const handlePrint = (person: any) => {
    setSelectedPerson(person);
    generatePDF(person);
  };

  const generatePDF = (person: any) => {
    const pdf = new jsPDF();

    const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
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

    // Add a clean border to the entire page
    pdf.rect(
      5,
      5,
      pdf.internal.pageSize.getWidth() - 10,
      pdf.internal.pageSize.getHeight() - 10,
    );

    // Add a header
    pdf.setFontSize(16);
    pdf.text('Token Details', pdf.internal.pageSize.getWidth() / 2, 15, {
      align: 'center',
    });

    // Reset font size for the content
    pdf.setFontSize(12);

    pdf.text(`Agent Name: ${person.userName}`, 10, 30);
    pdf.text(`Token Number: ${person.tokenNumber}`, 10, 40);
    pdf.text(`Count: ${person.count}`, 10, 50);
    pdf.text(`Date: ${formatDate(person.date)}`, 10, 60);
    pdf.text(`Draw Time: ${formatTime(person.drawTime)}`, 10, 70);

    // Add more content as needed

    pdf.save('invoice.pdf');
  };

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

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-end mb-7">
        <button className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-semibold text-white hover:bg-opacity-90 lg:px-5 xl:px-5">
          <Link to="/addtoken">
            <FontAwesomeIcon icon={faTicket} /> Add Order
          </Link>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={list}
        noHeader
        defaultSortFieldId="count"
        pagination
        paginationPerPage={10}
      />
    </div>
  );
};

export default DashboardAgent;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faEye,
  faTicket,
  faPrint,
} from '@fortawesome/free-solid-svg-icons';
import { showAlert } from '../../components/tosterComponents/tost';
import { backend_Url } from '../../api/server';
import DataTable, { Column } from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
interface Person {
  orderId: any;
  token: any;
  drawTime: string;
  _id: string;
  name: string;
  date: string;
  total: any;
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

  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);
  const [list, setList] = useState<any[]>([]); 

  // const handlePrint = (row: { _id: string; token: any }) => {
  //   console.log("hii",row);
  //   const { _id, token } = row;
  //   if (token && token.length > 0) {
  //     const orderId = token[0].orderId; 
  //     const orderDetails = list.find((order: { _id: string }) => order._id === orderId);
  
  //     if (orderDetails) {
  //       setSelectedPerson(orderDetails);
  //       generatePDF(orderDetails);
  //     }
  //   }
  // };
  
 

  // const generatePDF = (orderDetails: any) => {
  //   const pdf = new jsPDF();
  
  //   const formatDate = (dateString: string) => {
  //     const options: Intl.DateTimeFormatOptions = {
  //       year: 'numeric',
  //       month: 'long',
  //       day: 'numeric',
  //     };
  //     return new Date(dateString).toLocaleDateString('en-US', options);
  //   };
  
  //   const formatTime = (timeString: string) => {
  //     const options: Intl.DateTimeFormatOptions = {
  //       hour: 'numeric',
  //       minute: 'numeric',
  //       hour12: true,
  //     };
  //     return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString(
  //       'en-US',
  //       options,
  //     );
  //   };
  
 
  //   pdf.rect(
  //     5,
  //     5,
  //     pdf.internal.pageSize.getWidth() - 10,
  //     pdf.internal.pageSize.getHeight() - 10,
  //   );
  
    
  //   pdf.setFontSize(16);
  //   pdf.text('Order Details', pdf.internal.pageSize.getWidth() / 2, 15, {
  //     align: 'center',
  //   });
  
  //   pdf.setFontSize(12);
  
  //   pdf.text(`Order ID: ${orderDetails._id}`, 10, 30);
  //   pdf.text(`Date: ${formatDate(orderDetails.date)}`, 10, 40);
  //   pdf.text(`Draw Time: ${formatTime(orderDetails.drawTime)}`, 10, 50);
  
  //   // Tokens
  //   pdf.text('Tokens:', 10, 70);
  //   orderDetails.token.forEach((token: any, index: number) => {
  //     const tokenText = `${index + 1}. Token Number: ${token.tokenNumber}, Count: ${token.count}`;
  //     pdf.text(tokenText, 10, 80 + index * 10);
  //   });
  
  //   // Save the PDF
  //   pdf.save(`OrderNo_${orderDetails._id}.pdf`);
  // };
  

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
        setList(responsePeople?.data?.listOrder);
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
        const response = await axios.post(`${backend_Url}/api/agent/delete-entity-agent`, {
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

  console.log(
    'data:',
    people.map((item) => item.token),
  );

  const data: {
    index: number;
    formattedDate: string;
    drawTime: any;
    _id:any;
    orderId: any;
    token: any; 
    total:any;// Change 'any' to the actual type of token
  }[] = people.map((person, index) => ({
    index: index + 1,
    formattedDate: formatDate(person.date),
    drawTime: person.drawTime,
    orderId: person.orderId,
    _id:person._id,
    token: person.token,
    total: person.total,
  }));

  const columns: Column<any>[] = [
    {
      name: 'SlNo',
      selector: (row: { index: any }) => row.index,
      sortable: true,
    },
    {
      name: 'Orders',
      selector: (row: { orderId: any }) => row.orderId,
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
      cell: (row: {
        [x: string]: any; _id: string; token: any ; total:any;
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
              navigate('/listTokens', { state: { token: row.token ,drawTime:row.drawTime,date:row.formattedDate,orderId:row.orderId,total:row.total} })
            }
            style={{ marginRight: '10px' }}
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          {/* <button onClick={() => handlePrint(row)}>
          <FontAwesomeIcon icon={faPrint} />
        </button> */}
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto mt-8">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-col mt-10">
          <div className="flex justify-end mb-7">
            <button className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-semibold text-white hover:bg-opacity-90 lg:px-5 xl:px-5">
              <Link to="/addtoken">
                <FontAwesomeIcon icon={faTicket} /> Add Order
              </Link>
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-4">Order List</h2>
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

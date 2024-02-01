import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import DataTable, { Column } from 'react-data-table-component';
import { backend_Url } from '../api/server';

interface Token {
  count: string;
  orderId: string;
  tokenNumber: string;
}

const OrderTokens: React.FC = () => {
  const location = useLocation();
  const tokens: Token[] = location.state ? location.state.token : [];
  const [noRecordsFound, setNoRecordsFound] = useState<boolean>(false);

  const isInitialRender = useRef(true);
  console.log(location);

  useEffect(() => {
    if (isInitialRender.current && tokens.length > 0) {
      isInitialRender.current = false;
    }
  }, [tokens]);
  let serialNumber = 0;
  const columns: Column<Token>[] = [
    {
      name: 'Sl No',
      selector: (row: any) => ++serialNumber,
      sortable: true,
    },
    {
      name: 'Token Number',
      selector: (row: Token) => row.tokenNumber,
      sortable: true,
    },
    { name: 'Count', selector: (row: Token) => row.count, sortable: true },
    { name: 'Order ID', selector: (row: Token) => row.orderId, sortable: true },
    {
      name: 'Action',
      cell: (row: Token) => (
        <div className="flex items-center justify-center">
          <button onClick={() => console.log('Delete token:', row)}>
            {' '}
            {/* Add your delete logic here */}
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto mt-8">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-col mt-10">
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
          <DataTable
          // title='Order Details'
            columns={columns}
            data={tokens}
            pagination
            highlightOnHover
            responsive
          />
        </div>
      </div>
    </div>
  );
};

export default OrderTokens;

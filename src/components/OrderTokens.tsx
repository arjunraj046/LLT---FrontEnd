import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactToPrint from 'react-to-print';

export interface Token {
  count: string;
  orderId: string;
  tokenNumber: string;
}

const OrderTokens: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tokens: Token[] = location.state ? location.state.token : [];
  const orderId = location.state ? location.state.orderId : '';
  const drawTime = location.state ? location.state.drawTime : '';
  const date = location.state ? location.state.date : '';
  const total = location.state ? location.state.total:'';
  const agent = location.state ? location.state.agent:'';
  const printableOrderDetailsRef = useRef<any>();

  const isInitialRender = useRef(true);
  console.log(location);

  useEffect(() => {
    if (isInitialRender.current && tokens.length > 0) {
      isInitialRender.current = false;
    }
  }, [tokens]);
  const formatTime = (timeString: { split: (arg0: string) => [any, any] }) => {
    const [hours, minutes] = timeString.split(':');
    let period = 'AM';
    let formattedHours = parseInt(hours, 10);

    if (formattedHours > 12) {
      formattedHours -= 12;
      period = 'PM';
    }

    return `${formattedHours}:${minutes} ${period}`;
  };

  const handleNavigate = () => {
    if (localStorage.getItem('admin')) {
      navigate('/admin/entity');
      console.log('admin', localStorage.getItem('admin'));
    } else if (localStorage.getItem('agent')) {
      navigate('/');
      console.log('agent', localStorage.getItem('agent'));
    }
  };

  const printStyle = `
    @page {
      size: 80mm 100mm; // Adjust based on your ESC/POS printer paper size
      margin: 0;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif; // Adjust the font as needed
      font-size: 10px; // Adjust the font size as needed
      color: black !important;
    }

    .token-list {
      list-style: none;
      padding: 0;
      
    }

    .token-item {
      margin-bottom: 4px;
    }
  `;

  return (
    <div className="container mx-auto mt-8">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-end mb-7">
          <ReactToPrint
            trigger={() => (
              <button className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-semibold text-white hover:bg-opacity-90 lg:px-5 xl:px-5">
                Print <FontAwesomeIcon icon={faPrint} />
              </button>
            )}
            content={() => printableOrderDetailsRef.current}
          />
          <button
            className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-semibold text-white hover:bg-opacity-90 lg:px-5 xl:px-5"
            onClick={handleNavigate}
          >
            {'Back'}
          </button>
        </div>
        <div>
          <style>{printStyle}</style>
          <div ref={printableOrderDetailsRef}>
            <ul className="token-list text-black-2">
              <tr>
                <th>Order No: {orderId}</th>
                </tr>
              <tr><th>Agent:{agent}</th></tr>
              <li className="token-item">
               <th>Draw Time:{formatTime(drawTime)}</th>
                <tr>
                  <th>Date: {date}</th>
                </tr>
              </li>
              {tokens.map((token, index) => (
                <li key={index} className="token-item">
                  <tr>
                    <td>Token: {token.tokenNumber},</td>
                    <td> </td>
                    <td>Count: {token.count}</td>
                  </tr>
                </li>
              ))}
              <tr>-----------------------------</tr>
              <tr>
              <th>Total: {total}</th>
              </tr>
             
            </ul>

            {/* <p className="token-list">Order ID: {_id}</p>
            <p className="token-list">DrawTime: {drawTime}</p>
            <p className="token-list">Date: {date}</p>
            <ul className="token-list">
              {tokens.map((token, index) => (
                <li key={index} className="token-item">
                  <p>Token Number: {token.tokenNumber}</p>
                  <p>Count: {token.count}</p>
                </li>
              ))}
            </ul> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTokens;

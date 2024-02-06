// PrintableOrderDetails.tsx
import React, { forwardRef, Ref } from 'react';
import { Token } from './OrderTokens';

interface PrintableOrderDetailsProps {
  tokens: Token[];
  drawTime: any;
  date: any;
}

const PrintableOrderDetails = forwardRef(
  ({ tokens, drawTime, date }: PrintableOrderDetailsProps, ref: Ref<any>) => {
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
      color: black;
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
      <div ref={ref} className="invoice-container">
        <style>{printStyle}</style>
        <div className="header">Invoice</div>
        <p>DrawTime: {drawTime}</p>
        <p>Date: {date}</p>
        <ul className="token-list">
          {tokens.map((token, index) => (
            <li key={index} className="token-item">
              <p>Token Number: {token.tokenNumber}</p>
              <p>Count: {token.count}</p>
              <p>Order ID: {token.orderId}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

export default PrintableOrderDetails;

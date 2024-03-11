import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { backend_Url } from '../api/server';
import * as XLSX from 'xlsx';

interface ExcelRow {
  date: string;
  drawTime: string;
  count: string;
  Token: string;
  [key: string]: string; // Index signature to allow any string key
}

const ImportOrder: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (file) {
      try {
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        // Read Excel file and get the first sheet
        const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(firstSheet);

        // Append each row to formData
        jsonData.forEach((row) => {
          Object.keys(row).forEach((key) => {
            formData.append(key, row[key]);
          });
        });

        console.log('FormData before sending:', formData);
        const response = await axios.post(
          `${backend_Url}/api/admin/add-order`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        if (response.status === 200) {
          const data = response.data;
          console.log('Data from server:', data);
        } else {
          console.error(
            'Failed to upload file. Server responded with:',
            response.status,
            response.statusText,
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error:', error.message);
        } else {
          console.error('Unknown error:', error);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h2 className="text-2xl font-bold mb-4">Add Orders</h2>
              <div className="flex justify-center">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-semibold text-white hover:bg-opacity-90 lg:px-5 xl:px-5 cursor-pointer"
                >
                  Upload
                </label>
                {file && (
                  <div className="flex items-center ml-4">
                    <span className="mr-2">{file.name}</span>
                    {loading && <div className="loader"></div>}
                  </div>
                )}
                <button
                  onClick={handleImport}
                  className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-semibold text-white hover:bg-opacity-90 lg:px-5 xl:px-5"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportOrder;

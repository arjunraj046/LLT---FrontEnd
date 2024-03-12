import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { backend_Url } from '../api/server';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';

interface ExcelRow {
  date: string;
  drawTime: string;
  count: string;
  Token: string;
  [key: string]: string; // Index signature to allow any string key
}
interface DrawTime {
  _id: string;
  drawTime: string;
}

const ImportOrder: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawTimeList, setDrawTimeList] = useState<DrawTime[]>([]);
  const [defaultDrawTime, setDefaultDrawTime] = useState<string>('');
  const [drawTime, setDrawTime] = useState<string>('none');
  const [errors, setErrors] = useState<any>({});
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch draw time list
        const drawTimeResponse = await axios.get<any>(
          `${backend_Url}/api/admin/enitity-draw-time-rang-list`,
        );
        if (drawTimeResponse.data.status === 'success') {
          setDrawTimeList(drawTimeResponse.data.drawTimeList);

          if (drawTimeResponse.data.drawTimeList.length > 0) {
            const currentTime = new Date();
            const currentMinutes =
              currentTime.getHours() * 60 + currentTime.getMinutes();

            let closestDrawTime: DrawTime | null = null;
            let minTimeDifference = Infinity;

            drawTimeResponse.data.drawTimeList.forEach((drawTime: DrawTime) => {
              if (typeof drawTime.drawTime === 'string') {
                const drawTimeDate = new Date(
                  `2000-01-01T${drawTime.drawTime}`,
                );
                const drawTimeMinutes =
                  drawTimeDate.getHours() * 60 + drawTimeDate.getMinutes();

                if (drawTimeMinutes >= currentMinutes) {
                  const timeDifference = Math.abs(
                    drawTimeMinutes - currentMinutes,
                  );

                  if (timeDifference < minTimeDifference) {
                    closestDrawTime = drawTime;
                    minTimeDifference = timeDifference;
                  }
                }
              }
            });

            if (closestDrawTime) {
              setDefaultDrawTime(closestDrawTime.drawTime);
              setDrawTime(closestDrawTime.drawTime);
            }
          }
        } else {
          console.error(
            'API request failed with status:',
            drawTimeResponse.data.status,
          );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
        
  const userId = localStorage.getItem('adminId');
  console.log(userId)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('date', date.toISOString()); // Convert date to ISO string
        formData.append('drawTime', drawTime);
        formData.append('isImport', 1);
        formData.append('userId', userId);

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
          // Display success alert
          alert('Order successfully added!');

          // Clear form fields
          setFile(null);
          setDrawTime(defaultDrawTime);
          setDate(new Date());
          setErrors({});
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
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Draw Time
                </label>
                <select
                  name="drawTime"
                  value={drawTime || defaultDrawTime}
                  onChange={(e) => setDrawTime(e.target.value)}
                  className={`rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-2/3`}
                >
                  {drawTimeList.map((drawTime) => {
                    // Convert 24-hour format to 12-hour format with AM/PM
                    const time12hr = new Date(
                      `1970-01-01T${drawTime.drawTime}:00`,
                    );
                    const formattedTime = time12hr.toLocaleString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    });

                    return (
                      <option key={drawTime._id} value={drawTime.drawTime}>
                        {formattedTime}
                      </option>
                    );
                  })}
                </select>
                {errors.drawTime && (
                  <div className="text-meta-1">{errors.drawTime}</div>
                )}
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Select date
                </label>
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date as Date)}
                  className={`rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-2/3`}
                  dateFormat="dd/MM/yyyy"
                />
                {errors.date && (
                  <div className="text-meta-1">{errors.date}</div>
                )}
              </div>

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

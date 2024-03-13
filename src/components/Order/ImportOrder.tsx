import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { backend_Url } from '../../api/server';
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

  const generateSampleFile = () => {
    const sampleData: ExcelRow[] = [
      { Token: '78', Count: '10' },
      { Token: '66', Count: '13' },
      // Add more sample data as needed
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Create a new workbook writer
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    // Convert workbook to binary string
    const s2ab = (s: any) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };

    // Convert binary string to Blob
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

    // Create a download link and trigger the download
    const fileName = 'sample-file.xlsx';
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

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
        console.log(userId);
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
                  className={`rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-1/3`}
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
                <label className="mb-3 mt-3 block text-black dark:text-white">
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
              <div className="mt-3 flex ">
                {/* <button onClick={generateSampleFile}>Download Sample</button> */}
                <label className="mb-3 mt-3 mr-3 block text-black dark:text-white">
                  Sample file
                </label>
                <button
                  className="hover:text-primary "
                  onClick={generateSampleFile}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                      fill=""
                    />
                    <path
                      d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                      fill=""
                    />
                  </svg>
                </button>
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
                  className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-semibold text-white hover:bg-opacity-90 lg:px-5 xl:px-5 cursor-pointer mr-3"
                >
                  Upload
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                      fill="#f5faf8"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                      fill="#f5faf8"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                      fill="#f5faf8"
                    />
                  </svg>
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

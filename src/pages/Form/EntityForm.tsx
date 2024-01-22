import axios from 'axios';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link, useNavigate } from 'react-router-dom';
import { showAlert } from '../../components/tosterComponents/tost';

interface DrawTime {
  _id: string;
  drawTime: string;
}

const EntityForm: React.FC = () => {
  const [drawTimeList, setDrawTimeList] = useState<DrawTime[]>([]);
  const [tokenNumber, setTokenNumber] = useState<string>('');
  const [count, setCount] = useState('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [drawTime, setDrawTime] = useState<string>('');
  const navigate = useNavigate();
  const [defaultDrawTime, setDefaultDrawTime] = useState<string>('');

  // const timeProbability = () => {
  //   const now = new Date();
  //   const nowHours = now.getHours().toString().padStart(2, '0');
  //   const nowMinutes = now.getMinutes().toString().padStart(2, '0');

  //   function stringTimetoInt(timeString: string) {
  //     const [hoursStr, minutesStr] = timeString.split(':');
  //     const hours = parseInt(hoursStr, 10);
  //     const minutes = parseInt(minutesStr, 10);
    
  //     return { hours, minutes };
  //   }

  //   for (let i = 0; i < drawTimeList.length; i++) {
  //     const { hours, minutes } = stringTimetoInt(drawTimeList[i].drawTime);

  //     if (
  //       parseInt(nowHours) < hours ||
  //       (parseInt(nowHours) == hours && parseInt(nowMinutes) < minutes)
  //     ) {
  //       console.log('selection in if  ', drawTimeList[i].drawTime);
  //       let data = drawTimeList[i].drawTime;
  //       setDefaultDrawTime(data);
  //       console.log(' if  ', defaultDrawTime);
  //       break;
  //     }
  //   }

  //   console.log('after loop ', defaultDrawTime);
  //   if (!defaultDrawTime) {
  //     setDefaultDrawTime(drawTimeList[0].drawTime);
  //   }
  //   console.log('defaultDrawTime is ', defaultDrawTime);
  // };

  useEffect(() => {
    const fetchDrawTimeList = async () => {
      try {
        const response = await axios.get<any>(
          '/api/admin/enitity-draw-time-rang-list'
        );
        if (response.data.status === 'success') {
          setDrawTimeList(response.data.drawTimeList);

          // Set the default draw time and draw time when the drawTimeList changes
          if (response.data.drawTimeList.length > 0) {
            // Get the current time
            const currentTime = new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            });

            // Find the closest draw time
            const closestDrawTime: DrawTime = response.data.drawTimeList.reduce(
              (closest: DrawTime, drawTime: DrawTime) => {
                const drawTimeDate = new Date(`2000-01-01T${drawTime.drawTime}`);
                const closestDate = new Date(`2000-01-01T${closest.drawTime}`);
                const currentDate = new Date(`2000-01-01T${currentTime}`);

                const drawTimeDiff = Math.abs(
                  drawTimeDate.getTime() - currentDate.getTime()
                );
                const closestDiff = Math.abs(
                  closestDate.getTime() - currentDate.getTime()
                );

                return drawTimeDiff < closestDiff ? drawTime : closest;
              },
              response.data.drawTimeList[0]
            );

            setDefaultDrawTime(closestDrawTime.drawTime);
            setDrawTime(closestDrawTime.drawTime);
          }
        } else {
          console.error('API request failed with status:', response.data.status);
        }
      } catch (error) {
        console.error('Error fetching draw time list:', error);
      }
    };

    fetchDrawTimeList();
  }, []);
  const handleDrawTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDrawTime(e.target.value.toString());
  };

  const handleTokenNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenNumber(e.target.value);
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCount(e.target.value);
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    const _id = localStorage.getItem('agentID');

    try {
      const formattedDate = date?.toISOString().split('T')[0];
      const response = await axios.post('/api/agent/add-entity', {
        _id: _id,
        date: formattedDate,
        tokenNumber,
        count,
        drawTime,
      });

      console.log('Entry Added', response.data);
      navigate('/');
    } catch (error: any) {
      console.error('Error adding entry:', error);
      showAlert(error?.response?.data?.error, 'error');
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-9 ">
        <div className="flex flex-col gap-9 ">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form onSubmit={handleRegistration}>
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Add Token
                </h3>
              </div>

              <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Token Number
                  </label>
                  <input
                    type="text"
                    name="tokenNumber"
                    value={tokenNumber}
                    placeholder="Token Number"
                    onChange={handleTokenNumberChange}
                    className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-2/3"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Token Count
                  </label>
                  <input
                    type="number"
                    name="count"
                    placeholder="Token Count"
                    value={count}
                    onChange={handleCountChange}
                    className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-2/3"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Draw Time
                  </label>
                  <select
                    name="drawTime"
                    value={drawTime || defaultDrawTime} // Use drawTime or defaultDrawTime as the value
                    onChange={handleDrawTimeChange}
                    className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-50"
                  >
                    {drawTimeList.map((drawTime) => (
                      <option key={drawTime._id} value={drawTime.drawTime}>
                        {drawTime.drawTime}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-3 block text-black dark:text-white">
                    Select date
                  </label>
                  <DatePicker
                    selected={date}
                    onChange={(date) => setDate(date)}
                    className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-50"
                  />
                </div>
              </div>

              <div className="flex justify-center mb-10">
                <button
                  type="submit"
                  className="flex justify-center rounded bg-primary p-3 font-medium text-gray ml-5"
                >
                  Save
                </button>
                <Link
                  to="/"
                  className="flex justify-center rounded bg-primary p-3 font-medium text-gray ml-3"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EntityForm;

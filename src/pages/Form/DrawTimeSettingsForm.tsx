import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { showAlert } from '../../components/tosterComponents/tost';
import { backend_Url } from '../../api/server';

const DrawTimeSettingsForm: React.FC = () => {
  const [time, setTime] = useState<string>('');
  const navigate = useNavigate();

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  // const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   // You can use the 'time' state for further processing or validation
  //   console.log('Selected Time:', time);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const _id = localStorage.getItem('adminID');

    try {
      const response = await axios.post(
        `${backend_Url}/api/admin/draw-time`,
        {
          time: time,
        },
      );

      console.log('Time Added:', response.data);
      // alert('User registered successfully!');
      showAlert("Time Added successfully!", 'success');

      navigate('/admin/settings');
    } catch (error: any) {
      console.error('Error adding draw time:', error);
      // alert('Something went wrong. Please try again.');
      showAlert(error?.response?.data?.error, 'error');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-9 ">
      <div className="flex flex-col gap-9 ">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form onSubmit={handleSubmit}>
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Add Draw Time
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Select Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={handleTimeChange}
                  step="60" // 60 seconds = 1 minute
                  className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-1/3"
                 
                />
              </div>
            </div>
            <div className="flex justify-center mb-10">
              <button
                type="submit"
                className="flex justify-center rounded bg-primary p-3 font-medium text-gray ml-50"
              >
                Save
              </button>
              <Link
                to='/admin/settings'
                className="flex justify-center rounded bg-primary p-3 font-medium text-gray ml-3"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DrawTimeSettingsForm;

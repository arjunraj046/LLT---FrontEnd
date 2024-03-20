import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { HexColorPicker } from 'react-colorful';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { showAlert } from '../../components/tosterComponents/tost';
import { backend_Url } from '../../api/server';

interface FormValues {
  startRange: number | null;
  endRange: number | null;
}

const SettingsForm = () => {
  const navigate = useNavigate();
  const [color, setColor] = useState('#ff0000');

  const schema = yup.object().shape({
    startRange: yup
      .number()
      .required('Start Range is required')
      .positive('Start Range must be a positive number')
      .lessThan(
        yup.ref('endRange'),
        'Start Range must be smaller than End Range',
      )
      .nullable(),
    endRange: yup
      .number()
      .required('End Range is required')
      .positive('End Range must be a positive number')
      .moreThan(
        yup.ref('startRange'),
        'End Range must be greater than Start Range',
      )
      .nullable(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      startRange: null,
      endRange: null,
    },
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    const userWithColor = { ...data, color };

    try {
      const response = await axios.post(
        `${backend_Url}/api/admin/enitity-rang`,
        userWithColor,
      );
      console.log('User registered:', response.data);
      if (response.data.status === 'success') {
        showAlert('New Rang is Added ! ', 'success');
        navigate('/admin/settings');
      }
    } catch (error: any) {
      console.error('Error registering user:', error);
      showAlert(error?.response?.data?.error, 'error');
    }
  };

  return (
    <>
      <div className="flex flex-col gap-9">
        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Range Form
            </h3>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Start Range
              </label>
              <input
                type="number"
                placeholder="Enter the start range"
                {...register('startRange')}
                onChange={() => trigger('startRange')}
                className="w-2/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              {errors.startRange && (
                <p className="text-red">{errors.startRange.message}</p>
              )}
            </div>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                End Range
              </label>
              <input
                type="number"
                placeholder="Enter the end range"
                {...register('endRange')}
                onChange={() => trigger('endRange')}
                className="w-2/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              {errors.endRange && (
                <p className="text-red">{errors.endRange.message}</p>
              )}
            </div>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Select Color
              </label>
              <HexColorPicker color={color} onChange={setColor} />
            </div>

            <div className="flex justify-center m-8">
              <button
                type="submit"
                className="flex justify-center rounded bg-primary p-3 font-medium text-gray ml-30"
              >
                Save
              </button>
              <Link
                to="/admin/settings"
                className="flex justify-center rounded bg-primary p-3 font-medium text-gray ml-3"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SettingsForm;

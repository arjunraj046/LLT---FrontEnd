import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { showAlert } from '../../components/tosterComponents/tost';

const FormLayout = () => {
  const navigate = useNavigate();
  interface FormValues {
    name: string;
    userName: string;
    email: string;
    contactNumber: string;
    password: string;
    confirmPassword: string;
  }

  const schema = yup.object().shape({
    name: yup
      .string()
      .required('Name is required')
      .min(4, 'Name should be at least 4 characters'),
    userName: yup
      .string()
      .required('UserName is required')
      .matches(/^[a-z0-9]+$/, 'Username must be in lowercase and number.')
      .min(4, 'Username should be at least 4 characters'),
    email: yup.string().email('Invalid email').required('Email is required'),
    contactNumber: yup
      .string()
      .required('Contact Number is required')
      .matches(
        /^\d{10}$/,
        'Contact number must be 10 digits and contain only numbers',
      ),
    password: yup
      .string()
      .required('Password is required')
      .min(4, 'Password should be at least 4 characters'),
    confirmPassword: yup
      .string()
      .required('Confirm password is required')
      .oneOf([yup.ref('password')], 'Passwords must match')
      .min(4, 'Confirm Password should be at least 4 characters'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await axios.post(
        '/api/admin/agent-register',
        data,
      );
      console.log('User registered:', response.data);
      if (response.data.status == 'success') {
        showAlert('User created successfully!', 'success');
        navigate('/admin/userlist');
      }
    } catch (error: any) {
      console.error('Error registering user:', error);
      showAlert(error?.response?.data?.error, 'error');
    }
  };

  const handleChange = (fieldName: keyof FormValues) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      trigger(fieldName);
    };
  };

  return (
    <>
      <div className="flex flex-col gap-9">
        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Add User Form
            </h3>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your  name"
                {...register('name')}
                onChange={handleChange('name')}
                className="w-5/6 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary "
              />
              {errors.name && <p className="text-red">{errors.name.message}</p>}
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                User Name
              </label>
              <input
                type="text"
                placeholder="Enter your user name"
                {...register('userName')}
                onChange={handleChange('userName')}
                className="w-5/6 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              {errors.userName && (
                <p className="text-red">{errors.userName.message}</p>
              )}
            </div>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                {...register('email')}
                onChange={handleChange('email')}
                className="w-5/6 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              {errors.email && (
                <p className="text-red">{errors.email.message}</p>
              )}
            </div>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Contact Number
              </label>
              <input
                placeholder="Enter your Contact number"
                type="text"
                {...register('contactNumber')}
                onChange={handleChange('contactNumber')}
                className="w-5/6 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              {errors.contactNumber && (
                <p className="text-red">{errors.contactNumber.message}</p>
              )}
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter passowrd"
                {...register('password')}
                onChange={handleChange('password')}
                className="w-5/6 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              {errors.password && (
                <p className="text-red">{errors.password.message}</p>
              )}
            </div>

            <div className="mb-5.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Re-type Password
              </label>
              <input
                type="password"
                placeholder="Enter passowrd again"
                {...register('confirmPassword')}
                onChange={handleChange('confirmPassword')}
                className="w-5/6 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              {errors.confirmPassword && (
                <p className="text-red">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="flex justify-center rounded bg-primary p-3 font-medium text-gray ml-35"
              >
                Register
              </button>
              <Link
                to="/admin/userlist"
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

export default FormLayout;

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { showAlert } from '../components/tosterComponents/tost';

const EditAgentPassword = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState({
    _id: id,
    previousPassword: '',
    password: '',
    confirmPassword: '',
  });

  const userSchema = yup.object().shape({
    previousPassword: yup
      .string()
      .required('Previous password is required')
      .min(4, 'Previous password should be at least 4 characters'),
    password: yup
      .string()
      .notOneOf(
        [yup.ref('previousPassword')],
        'New password must be different from the previous password',
      )
      .required('Password is required')
      .min(4, 'Password should be at least 4 characters'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required')
      .min(4, 'Confirm Password should be at least 4 characters'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    setUser({
      ...user,
      previousPassword: data.previousPassword,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    console.log(user);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/admin/change-agentpassword',
        user,
      );
      console.log('User registered:', response.data);
      // alert('Password changed successfully!');
      showAlert('Password changed successfully!', 'success');

      navigate('/admin/userlist');
    } catch (error: any) {
      console.error('Error registering user:', error);
      // alert('Something went wrong. Please try again.');
      showAlert(error?.response?.data?.error, 'error');
    }
  };

  return (
    <>
      <div className="flex flex-col gap-9">
        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Registration Form
            </h3>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Previous Password
              </label>
              <input
                type="password"
                placeholder="Enter your previous password"
                {...register('previousPassword')}
                className="w-2/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              {errors.previousPassword && (
                <p className="text-red">{errors.previousPassword.message}</p>
              )}
            </div>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                {...register('password')}
                className="w-2/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
                placeholder="Re-enter password"
                {...register('confirmPassword')}
                className="w-2/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              {errors.confirmPassword && (
                <p className="text-red">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="flex justify-center rounded bg-primary p-3 font-medium text-gray ml-50"
              >
                Submit
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

export default EditAgentPassword;

// const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const { name, value } = e.target;
//   setUser((prevUser) => ({
//     ...prevUser,
//     [name]: value,
//   }));
// };

// const handleRegistration = async (e: React.FormEvent) => {
//   e.preventDefault();
//   if (user.password !== user.confirmPassword) {
//     alert('Passwords do not match!');
//     return;
//   }
//   try {
//     const response = await axios.post(
//       'http://localhost:5000/api/admin/change-agentpassword',
//       user,
//     );
//     console.log(user);
//     console.log('User registered :', response.data);
//     alert('passoword chnage successfully!');
//     navigate('/admin/userlist');
//   } catch (error) {
//     console.error('Error registering user:', error);
//     alert('Something went wrong. Please try again.');
//   }
// };

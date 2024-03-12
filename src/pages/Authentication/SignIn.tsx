import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginUser } from '../../redux/reducer/userSlice';
import { showAlert } from '../../components/tosterComponents/tost';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { backend_Url } from '../../api/server';

const signInSchema = yup.object().shape({
  userName: yup
    .string()
    .required('Username is required')
    .min(4, 'Username must be at least 4 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(4, 'Password must be at least 4 characters'),
});

const SignIn = () => {
  const navigate = useNavigate();
  const admin = localStorage.getItem('admin');
  const agent = localStorage.getItem('agent');
  if (admin) {
    console.log('LOGIN PAGE ADMIN', admin);
    navigate('/admin');
  } else if (agent) {
    console.log('LOGIN PAGE AGENT', agent);
    navigate('/');
  }

  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    userName: '',
    password: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    setCredentials(data);
    try {
      const response = await axios.post(
        `${backend_Url}/api/auth/login`,
        data
      );
      const { token, user } = response.data;
      const userdata = {
        _id: user?._id,
        name: user?.name,
        userName: user?.userName,
        email: user?.email,
        contactNumber: user?.contactNumber,
        userRole: user?.userRole,
      };
      console.log(token, user);
      dispatch(loginUser(userdata));

      if (user.userRole === 1) {
        localStorage.setItem('admin', token);
        localStorage.setItem('adminId', user?._id);

        navigate('/admin');
      } else if (user.userRole === 2) {
        localStorage.setItem('agent', token);
        localStorage.setItem('agentID', user?._id);
        console.log('working');

        navigate('/');
        console.log('working');
      } else {
        console.error('Unknown user role:', user.userRole);
        showAlert('Unknown user !', 'info');
      }

      console.log('Login successful!', response.data);
    } catch (error:any) {
      showAlert(error?.response?.data?.error, 'error');
      console.error('Error logging in:' + error?.response?.data?.error, error);
    }
  };

  return (
    <>
      <div>
        <div className="flex flex-wrap justify-evenly">
          <div className="w-full xl:w-1/2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2  ml-60">
                Sign In
              </h2>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    UserName
                  </label>
                  <div className="relative">
                    <input
                      type="userName"
                      {...register('userName')}
                      placeholder="Enter your userName"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />

                    {errors.userName && (
                      <p className="text-red">{errors.userName.message}</p>
                    )}
                    <span className="absolute right-4 top-4"></span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      {...register('password')}
                      placeholder="Enter Your Password"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    {errors.password && (
                      <p className="text-red">{errors.password.message}</p>
                    )}
                    <span className="absolute right-4 top-4"></span>
                  </div>
                </div>

                <div className="mb-5">
                  <button
                    type="submit"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { showAlert } from '../components/tosterComponents/tost';
import { backend_Url } from '../api/server';

interface FormValues {
  _id: string;
  name: string;
  userName: string;
  email: string;
  contactNumber: string;
  status: boolean;
}

const EditAgentProfile = () => {
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<FormValues>();
  // const [isFormEdited] = useState<boolean>(false);
  const { id } = useParams();

  const buildValidationSchema = () => {
    return yup.object().shape({
      name: yup
        .string()
        .required('Name is required')
        .min(4, 'Name should be at least 4 characters'),
      userName: yup
        .string()
        .required('Username is required')
        .matches(/^[a-z0-9]+$/, 'Username must be in lowercase and number.')
        .min(4, 'Username should be at least 4 characters'),
      email: yup.string().email('Invalid email').required('Email is required'),
      contactNumber: yup
        .string()
        .required('Contact Number is required')
        .matches(
          /^\d{10}$/,
          'Contact number must be 10 digits and contain only numbers'
        ),
      status: yup.boolean(),
    });
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(buildValidationSchema()) as any,
  });

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const response = await axios.get(
          `${backend_Url}/api/admin/agent/${id}`
        );
        const {
          _id,
          name,
          userName,
          email,
          contactNumber,
          status,
        } = response.data.agentDetails;

        setInitialValues({
          _id: _id,
          name: name || '',
          userName: userName || '',
          email: email || '',
          contactNumber: contactNumber || '',
          status: status ,
        });

        setValue('name', name);
        setValue('userName', userName);
        setValue('email', email);
        setValue('contactNumber', contactNumber);
        setValue('status', status);
      } catch (error) {
        console.error('Error fetching agent data:', error);
      }
    };

    fetchAgentData();
  }, [id, setValue]);

  const onSubmit = async (data: FormValues) => {
    console.log(data);

    const isFormEdited =
      data.name !== initialValues?.name ||
      data.userName !== initialValues?.userName ||
      data.email !== initialValues?.email ||
      data.contactNumber !== initialValues?.contactNumber 
      || data.status !== initialValues?.status;

    if (!isFormEdited) {
      showAlert('No changes made, form will not be submitted.!', 'info');
      return;
    }
    try {
      // console.log(data,id);
      const newData = { ...data, _id: id };
      console.log(newData);

      const response = await axios.post(
        `${backend_Url}/api/admin/edit-agent`,
        newData
      );
      console.log('User updated:', response.data);
      showAlert('User updated successfully!', 'success');
      navigate('/admin/userlist');
    } catch (error:any) {
      console.error('Error updating user:', error);
      showAlert(error?.response?.data?.error, 'error');
    }
  };

  return (
    <>
      <div className="flex flex-col gap-9">
        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Edit User Form
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
                className="w-2/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
                className="w-2/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
                {...register('email')}
                placeholder="Enter your email address"
                className="w-2/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
                type="text"
                {...register('contactNumber')}
                placeholder="Enter your Contact number"
                className="w-2/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              {errors.contactNumber && (
                <p className="text-red">{errors.contactNumber.message}</p>
              )}
            </div>
            <div className="mb-16">
              <label className="mb-2.5 block text-black dark:text-white">
                Status Change
              </label>
              <select
                {...register('status')}
                className="w-2/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option
                  value={String(true)}
                  style={{
                    padding: '8px',
                    backgroundColor: 'lightgreen',
                    color: 'black',
                  }}
                >
                  Active
                </option>
                <option
                  value={String(false)}
                  style={{
                    padding: '8px',
                    backgroundColor: 'lightcoral',
                    color: 'black',
                  }}
                >
                  Inactive
                </option>
              </select>
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

export default EditAgentProfile;
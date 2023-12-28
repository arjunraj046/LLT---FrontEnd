import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { showAlert } from '../components/tosterComponents/tost';

interface FormValues {
  name: string;
  userName: string;
  email: string;
  contactNumber: string;
}

const EditAgentProfile = () => {
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<FormValues>();
  const [isFormEdited, setIsFormEdited] = useState<boolean>(false);
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
          'Contact number must be 10 digits and contain only numbers',
        ),
    });
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(buildValidationSchema()),
  });

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/admin/agent/${id}`,
        );
        const { name, userName, email, contactNumber } =
          response.data.agentDetails;

        setInitialValues({
          name: name || '',
          userName: userName || '',
          email: email || '',
          contactNumber: contactNumber || '',
        });

        setValue('name', name);
        setValue('userName', userName);
        setValue('email', email);
        setValue('contactNumber', contactNumber);
      } catch (error) {
        console.error('Error fetching agent data:', error);
      }
    };

    fetchAgentData();
  }, [id, setValue]);

  const onSubmit = async (data: FormValues) => {
    if (!isFormEdited) {
      // alert('No changes made, form will not be submitted.');
      showAlert('No changes made, form will not be submitted.!', 'info');

      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:5000/api/admin/edit-agent',
        data,
      );
      console.log('User updated:', response.data);
      // alert('User updated successfully!');
      showAlert('User updated successfully!', 'success');

      navigate('/admin/userlist');
    } catch (error: any) {
      console.error('Error updating user:', error);
      showAlert(error?.response?.data?.error, 'error');

      // alert('Something went wrong. Please try again.');
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

            {/* Similar pattern for other input fields with error display */}

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                User Name
              </label>
              <input
                type="text"
                // name="userName"
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
                // name="email"
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
                // name="contactNumber"
                {...register('contactNumber')}
                placeholder="Enter your Contact number"
                className="w-2/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              {errors.contactNumber && (
                <p className="text-red">{errors.contactNumber.message}</p>
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

export default EditAgentProfile;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link, useNavigate, useParams } from 'react-router-dom';

// const EditAgentProfile = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   console.log(id);

//   const [user, setUser] = useState({
//     _id:'',
//     name: '',
//     userName: '',
//     email: '',
//     contactNumber: '',
//   });

//   useEffect(() => {
//     const fetchAgentData = async () => {
//       try {
//         const response = await axios.get<any>(
//           `http://localhost:5000/api/admin/agent/${id}`,
//         );
//         console.log('API Response:', response.data);
//         setUser(response.data.agentDetails);
//         console.log(user);
//       } catch (error) {
//         console.error('Error fetching agent data:', error);
//       }
//     };

//     fetchAgentData();
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setUser((prevUser) => ({
//       ...prevUser,
//       [name]: value,
//     }));
//   };

//   const handleRegistration = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       // Replace the URL with your actual registration endpoint
//       const response = await axios.post(
//         'http://localhost:5000/api/admin//edit-agent',
//         user,
//       );
//       console.log(user);

//       console.log('User registered:', response.data);
//       alert('User registered successfully!');
//       navigate('/admin/userlist');
//     } catch (error) {
//       console.error('Error registering user:', error);
//       alert('Something went wrong. Please try again.');
//     }
//   };

//   return (
//     <>
//       {/* <Breadcrumb pageName="Add User" /> */}

//       <div className="flex flex-col gap-9">
//         <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
//           <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
//             <h3 className="font-medium text-black dark:text-white">
//               Registration Form
//             </h3>
//           </div>
//           <form onSubmit={handleRegistration} className="p-6.5">
//             <div className="mb-4.5">
//               <label className="mb-2.5 block text-black dark:text-white">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Enter your full name"
//                 value={user.name}
//                 onChange={handleChange}
//                 className="w-2/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
//               />
//             </div>
// <div className="mb-4.5">
//   <label className="mb-2.5 block text-black dark:text-white">
//     User Name
//   </label>
//   <input
//     type="text"
//     name="userName"
//     placeholder="Enter your user name"
//     value={user.userName}
//     onChange={handleChange}
//     className="w-2/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
//   />
// </div>
// <div className="mb-4.5">
//   <label className="mb-2.5 block text-black dark:text-white">
//     Email
//   </label>
//   <input
//     type="email"
//     name="email"
//     placeholder="Enter your email address"
//     value={user.email}
//     onChange={handleChange}
//     className="w-2/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
//   />
// </div>
// <div className="mb-4.5">
//   <label className="mb-2.5 block text-black dark:text-white">
//     Contact Number
//   </label>
//   <input
//     type="number"
//     name="contactNumber"
//     placeholder="Enter your Contact number"
//     value={user.contactNumber}
//     onChange={handleChange}
//     className="w-2/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
//   />
// </div>

//             <div className="flex justify-center">
//               <button
//                 type="submit"
//                 className="flex justify-center rounded bg-primary p-3 font-medium text-gray ml-50"
//               >
//                 Submit
//               </button>
//               <Link
//                 to="/admin/userlist"
//                 className="flex justify-center rounded bg-primary p-3 font-medium text-gray ml-3"
//               >
//                 Cancel
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EditAgentProfile;

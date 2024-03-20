import axios from 'axios';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { showAlert } from '../../components/tosterComponents/tost';
import { backend_Url } from '../../api/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface DrawTime {
  _id: string;
  drawTime: string;
}

interface TokenSet {
  tokenNumber: string;
  count: string;
}

const validationSchema = Yup.object().shape({
  drawTime: Yup.string().required('Draw Time is required'),
  date: Yup.date().required('Date is required'),
  tokenSets: Yup.array().of(
    Yup.object().shape({
      tokenNumber: Yup.string()
        .required('Token Number is required')
        .matches(
          /^(0*[0-9]{1,3}|0+)$/,
          'Token Number must be a number between 1 and 999 with optional leading zeros',
        ),
      count: Yup.string()
        .required('Token Count is required')
        .matches(
          /^[1-9][0-9]{0,2}$/,
          'Token Count must be a number between 1 and 1000',
        ),
    }),
  ),
});

const EntityForm: React.FC = () => {
  const [drawTimeList, setDrawTimeList] = useState<DrawTime[]>([]);
  const [defaultDrawTime, setDefaultDrawTime] = useState<string>('');
  const [drawTime, setDrawTime] = useState<string>('none');
  const [date, setDate] = useState<Date>(new Date());
  const [tokenSets, setTokenSets] = useState<TokenSet[]>([
    { tokenNumber: '', count: '' },
  ]);

  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();
  const [existingOrders, setExistingOrders] = useState<string[]>([]);
  const [orderId, setOrderId] = useState<string>('');


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

      // Fetch existing OrderIds
    const ordersResponse = await axios.get(`${backend_Url}/api/agent/get-orders`);
    const existingOrders = ordersResponse.data.orderIds.map((order: { orderId: any; }) => order.orderId);
    console.log(ordersResponse);
    setExistingOrders(existingOrders);
   
    

    // Determine the next OrderId
    let nextOrderNumber = 1;
    const regex = /^ORD(\d+)$/;

    existingOrders.forEach((orderId: string) => {
      const match = orderId.match(regex);
      if (match) {
        const orderNumber = parseInt(match[1]);
        nextOrderNumber = Math.max(nextOrderNumber, orderNumber + 1);
      }
    });

    const orderId = `ORD${nextOrderNumber}`;
    setOrderId(orderId);

    console.log(orderId);
    
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const handleSubmit = async () => {
    try {
      await validationSchema.validate(
        { drawTime, date, tokenSets },
        { abortEarly: false },
      );

      const _id = localStorage.getItem('agentID');
      let ddtime;
      if (drawTime.length > 0) {
        ddtime = drawTime;
      } else {
        ddtime = defaultDrawTime;
      }

      const response = await axios.post(`${backend_Url}/api/agent/add-entity`, {
        _id: _id,
        orderId: orderId,
        drawTime: ddtime,
        date: date.toISOString().split('T')[0],
        tokenSets: tokenSets.map((tokenSet) => ({
          tokenNumber: tokenSet.tokenNumber,
          count: tokenSet.count,
        })),
      });

      console.log('Entry Added', response.data);
      navigate('/');
    } catch (error) {
      // Handle errors as before
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-9 ">
        <div className="flex flex-col gap-9 ">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Add Token
                </h3>
              </div>
              <div className="flex flex-col gap-1 pl-6.5">
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
              </div>

              {tokenSets.map((tokenSet, index) => (
                <div key={index} className="flex flex-col gap-1 pl-6.5">
                  <h2>Token {index + 1}</h2>

                  <div>
                    <label className="mb-3 block text-black dark:text-white">
                      Token Number
                    </label>
                    <input
                      type="text"
                      name={`tokenSets.${index}.tokenNumber`}
                      value={tokenSet.tokenNumber}
                      placeholder="Token Number"
                      onChange={(e) => {
                        const newTokenSets = [...tokenSets];
                        newTokenSets[index].tokenNumber = e.target.value;
                        setTokenSets(newTokenSets);
                      }}
                      className={`rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-2/3`}
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-black dark:text-white">
                      Token Count
                    </label>
                    <input
                      type="number"
                      name={`tokenSets.${index}.count`}
                      placeholder="Token Count"
                      value={tokenSet.count}
                      onChange={(e) => {
                        const newTokenSets = [...tokenSets];
                        newTokenSets[index].count = e.target.value;
                        setTokenSets(newTokenSets);
                      }}
                      className={`rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-2/3`}
                    />
                  </div>

                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setTokenSets((prevTokenSets) =>
                          prevTokenSets.filter((_, i) => i !== index),
                        );
                      }}
                      className="w-50 m-2 flex justify-center rounded bg-meta-1 p-3 font-medium text-gray mb-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <div className="flex ml-6 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setTokenSets((prevTokenSets) => [
                      ...prevTokenSets,
                      { tokenNumber: '', count: '' },
                    ]);
                  }}
                  className="w-50 m-2 flex justify-center rounded bg-black p-3 font-medium text-gray mb-2"
                >
                  <span className="mr-2">
                    <FontAwesomeIcon icon={faPlus} />
                  </span>
                  Add Another Token
                </button>
              </div>

              <div className="flex justify-center mb-10 ">
                <button
                  type="submit"
                  className=" w-24 flex justify-center rounded bg-primary p-3 font-medium text-gray ml-5 "
                >
                  Save
                </button>
                <Link
                  to="/"
                  className=" w-24 flex justify-center rounded bg-primary p-3 font-medium text-gray ml-3"
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

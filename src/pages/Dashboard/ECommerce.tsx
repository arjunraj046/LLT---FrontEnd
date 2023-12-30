// import { showToast, ToastTypes } from "../../components/tosterComponents/tost";
import { showAlert } from '../../components/tosterComponents/tost'; // Replace with the path to your custom toast component
import fireToast from '../../hooks/fireToast';

const ECommerce = () => {
  const admin = localStorage.getItem('admin');
  const agent = localStorage.getItem('agent');
  console.log('ecommerceeeeeeeeeeeee');

  const handleButtonClick = () => {
    console.log('Button clicked!');
    // showToast('some message', ToastTypes.ERROR);
    // showAlert('This is an information message!', 'success');
    fireToast();
  };

  return (
    <>
      <div className="flex justify-center ">
        <p className="mt-24 text-lg text-black-2">
          Welcome {admin ? 'admin' : 'agent'}
        </p>
        {/* <button
          type="button"
          onClick={handleButtonClick}
          className="flex justify-center rounded bg-primary p-3 font-medium text-gray ml-50"
        >
          show tost
        </button> */}
      </div>
    </>
  );
};

export default ECommerce;

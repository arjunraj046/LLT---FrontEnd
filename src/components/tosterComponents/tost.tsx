import { toast } from 'react-hot-toast';

type AlertType = 'info' | 'success' | 'error';

export const showAlert = (message: string, type: AlertType) => {
  let alertColor: string;
  let icon: JSX.Element;

  switch (type) {
    case 'info':
      alertColor = 'bg-blue-500';
      icon = <svg /* Info icon SVG */ />;
      break;
    case 'success':
      alertColor = 'bg-green-500';
      icon = <svg /* Success icon SVG */ />;
      break;
    case 'error':
      alertColor = 'bg-red-500';
      icon = <svg /* Error icon SVG */ />;
      break;
    default:
      alertColor = 'bg-gray-500';
      icon = <svg /* Default icon SVG */ />;
      break;
  }

  toast((t) => (
    // <div className={`rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark md:p-6 xl:p-9 ${alertColor}`}>
      <div className={`flex w-full border-l-6 ${alertColor} px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9`}>
        <div className="mr-5 flex h-6 w-9 items-center justify-center rounded-lg bg-[15%]">
          {icon}
        </div>
        <div className="w-full">
          <h5 className="mb-3 text-lg font-semibold text-[#9D5425]">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </h5>
          <p className="leading-relaxed text-[#D0915C]">{message}</p>
        </div>
      </div>
    // </div>
  ));
};

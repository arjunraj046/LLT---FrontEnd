import { useNavigate } from 'react-router-dom';

const DropdownUser = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (localStorage.getItem('admin')) {
      localStorage.removeItem('admin');
      console.log("logout",localStorage.getItem('admin'));
    } else if (localStorage.getItem('agent')) {
      localStorage.removeItem('agent');
      console.log("logout",localStorage.getItem('agent'));
    }
    navigate('/login');
  };

  return (
    <div className="relative">
      <div
        className="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base cursor-pointer"
        onClick={handleLogout}
      >
        Log Out
      </div>
    </div>
  );
};

export default DropdownUser;

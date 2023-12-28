import { Suspense, lazy, useEffect, useState } from 'react';
// import { Route, Router, Routes, useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import SignIn from './pages/Authentication/SignIn';
import Loader from './common/Loader';
import AdminRoute from './routes/adminRoute';
import AgentRoute from './routes/agentRoute';
import { ToastContainer } from 'react-toastify';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/*" element={<AgentRoute />} />
          <Route path="/admin/*" element={<AdminRoute />} />
        </Routes>
        <Toaster />
        {/* <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        /> */}
      </Router>
    </>
  );
}

export default App;

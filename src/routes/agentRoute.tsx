import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Loader from '../common/Loader';
// import routes from './admin';
// import adminRoutes from './admin';
import agentRouteSet from './agent';
// import EntityForm from '../pages/Form/EntityForm';
import EntityForm from '../pages/Form/fff';
// import DashboardAgent from '../pages/Agent/AgentDashboard';

const DefaultLayout = lazy(() => import('../layout/DefaultLayout'));



const Agent = lazy(() => import('../pages/Agent/Agent'));
const OrderTokens = lazy(() => import('../components/OrderTokens'));

function AgentRoute() {
  // const [loading, setLoading] = useState<boolean>(true);
  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 1000);
  // }, []);

  const agent = localStorage.getItem('agent');
  console.log('agent -----------', agent, agentRouteSet);

  if (!agent) {
    return <Navigate to="/login" />;
  } else  {
    return (
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route index element={<Agent />} />
            <Route path='/listTokens' element={<OrderTokens/>} />
            <Route path='/addtoken' element={<EntityForm />} />
            

            {/* 
            {agentRouteSet.map(({ path, component: Component }, index) => (
              <Route key={index} path={path} element={<Component />} />
            ))} */}
          </Route>
        </Routes>
      </Suspense>
    );
  }
}

export default AgentRoute;

import { lazy } from 'react';
const EntityForm = lazy(() => import('../pages/Form/EntityForm'));

const coreRoutes = [
  {
    path: '/addtoken',
    title: 'addToken ',
    component: EntityForm,
  },
];

const agentRouteSet = [...coreRoutes];
export default agentRouteSet;

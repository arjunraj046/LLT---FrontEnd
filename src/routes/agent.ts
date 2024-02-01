import { lazy } from 'react';
const EntityForm = lazy(() => import('../pages/Form/EntityForm'));
const OrderTokens = lazy(() => import('../components/OrderTokens'));

const coreRoutes = [
  {
    path: '/addtoken',
    title: 'addToken ',
    component: EntityForm,
  },
  {
    path: '/listTokens',
    title: 'listTokens ',
    component: OrderTokens,
  },
];

const agentRouteSet = [...coreRoutes];
export default agentRouteSet;

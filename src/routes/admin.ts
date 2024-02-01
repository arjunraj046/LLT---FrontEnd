import { lazy } from 'react';

// import ECommerce from '../pages/Dashboard/ECommerce';
// const EntityForm = lazy(() => import('../pages/Form/EntityForm'));
const RegistrationForm = lazy(() => import('../pages/Form/RegistrationForm'));
const SettingsForm = lazy(() => import('../pages/Form/SettingsForm'));
const DrawTimeSettingsForm = lazy(() => import('../pages/Form/DrawTimeSettingsForm'));
const entity = lazy(() => import('../components/Entries'));
const Settings = lazy(() => import('../pages/Settings'));
const Users = lazy(() => import('../pages/Users'));
const EditAgentProfile= lazy(() => import('../pages/editProfile'));
const EditAgentPassword = lazy(() => import('../pages/editpassword')); 
const OrderTokens = lazy(() => import('../components/OrderTokens')); 

const coreRoutes = [
  {
    path: '/entity',
    title: 'entity',
    component: entity,
  },
  {
    path: '/userlist',
    title: 'Users',
    component: Users,
  },
  {
    path: '/settings',
    title: 'Settings',
    component: Settings,
  },
  {
    path: '/register',
    title: 'register',
    component: RegistrationForm,
  },
  {
    path: '/editprofile/:id',
    title: 'register',
    component: EditAgentProfile,
  },
  {
    path: '/changepassword/:id',
    title: 'register',
    component: EditAgentPassword,
  },
  {
    path: '/addrange',
    title: 'AddRange',
    component: SettingsForm,
  },
  {
    path: '/addDrawTime',
    title: 'AddRange',
    component: DrawTimeSettingsForm,
  },
  {
    path: '/orderlist/listTokens',
    title: 'listTokens',
    component: OrderTokens,
  },
 
];

const adminRouteSet = [...coreRoutes];
export default adminRouteSet;
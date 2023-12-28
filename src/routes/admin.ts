import { lazy } from 'react';

// import ECommerce from '../pages/Dashboard/ECommerce';
// const EntityForm = lazy(() => import('../pages/Form/EntityForm'));
const RegistrationForm = lazy(() => import('../pages/Form/RegistrationForm'));
const SettingsForm = lazy(() => import('../pages/Form/SettingsForm'));
const entity = lazy(() => import('../components/EntityList'));
const Settings = lazy(() => import('../pages/Settings'));
const Users = lazy(() => import('../pages/Users'));
const EditAgentProfile= lazy(() => import('../pages/editProfile'));
const EditAgentPassword = lazy(() => import('../pages/editpassword')); 

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
];

const adminRouteSet = [...coreRoutes];
export default adminRouteSet;
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginRegister, Notes, NotesArquiveds } from '../pages';
const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginRegister />
  },
  {
    path: '/notes',
    element: <Notes />
  },
  {
    path: '/register',
    element: <LoginRegister />
  },
  {
    path: 'arquived',
    element: <NotesArquiveds />
  }
]);

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;

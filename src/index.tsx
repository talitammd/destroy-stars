import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import routers from './router';
import { RouterProvider } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={routers} />
  </React.StrictMode>,
  document.getElementById('root')
);



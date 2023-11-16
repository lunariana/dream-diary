import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';
import { SAPIBase } from './tools/api';

axios.defaults.baseURL = SAPIBase;
axios.defaults.withCredentials = true;    // makes axios automatically send cookies in api requests

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

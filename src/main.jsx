import React from 'react'
import ReactDOM from 'react-dom/client'

// 1. D'ABORD AMPLIFY (Très important que ce soit avant App)
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json'; 
Amplify.configure(outputs);

// 2. ENSUITE VOTRE APP
import App from './App.jsx'
import './index.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
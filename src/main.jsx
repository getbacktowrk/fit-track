import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// --- AJOUTE CES 3 LIGNES POUR CONNECTER LE BACKEND ---
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json'; // Vérifie que le chemin est correct selon l'emplacement de ton fichier
Amplify.configure(outputs);
// ----------------------------------------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
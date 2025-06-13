import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import {ColorProvider} from "./context/ColorContext"

import './index.css';
import AppRouter from './routers/router';
import { AuthProvider } from './context/AuthContext';

// ReactDOM.createRoot(document.getElementById('root')).render(
 
 createRoot(document.getElementById("root")).render(
 <ColorProvider>
    <AuthProvider>
     <AppRouter />
    </AuthProvider>
 
 
 </ColorProvider>  


     
 
);

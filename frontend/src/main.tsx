import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-toastify/dist/ReactToastify.css";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
   <BrowserRouter>
    <App />
  </BrowserRouter>
)

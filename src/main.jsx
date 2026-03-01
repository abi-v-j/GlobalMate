import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import MainRouter from './Routers/MainRouter';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <MainRouter />
  </BrowserRouter>
);
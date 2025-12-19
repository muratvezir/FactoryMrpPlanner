import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Materials from './pages/Materials.tsx';
import MaterialsDetail from './pages/MaterialsDetail.tsx';
import Orders from './pages/Orders.tsx';
import Forecasts from './pages/Forecasts.tsx';
import Planning from './pages/Planning.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="materials" element={<Materials />} />
          <Route path="materials/:code" element={<MaterialsDetail />} />
          <Route path="orders" element={<Orders />} />
          <Route path="forecasts" element={<Forecasts />} />
          <Route path="planning" element={<Planning />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

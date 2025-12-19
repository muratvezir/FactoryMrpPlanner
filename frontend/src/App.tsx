import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Materials from './pages/Materials';
import MaterialsDetail from './pages/MaterialsDetail';
import Orders from './pages/Orders';
import Planning from './pages/Planning';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="materials" element={<Materials />} />
          <Route path="materials/:code" element={<MaterialsDetail />} />
          <Route path="orders" element={<Orders />} />
          <Route path="planning" element={<Planning />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

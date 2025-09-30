import { Outlet } from 'react-router-dom';
import TopBar from '../components/TopBar_temp';

export default function AppLayout() {
  return (
    <>
      <TopBar />
      <Outlet />
      {/* (opsional) Footer di sini */}
    </>
  );
}
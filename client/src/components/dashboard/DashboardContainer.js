import React from 'react';
import DeveloperDashboard from './developer/DeveloperDashboard';
import AdminDashboard from './admin/AdminDashboard';
import { AuthContext } from '../../context/auth/AuthContext';

export default function Dashboard(props) {
  const { user } = useContext(AuthContext);

  return (
    // if developer or manager role, display regular dashboard (will need to modify this later). if admin role display admin dashboard.

    user.role === 'admin' ? <AdminDashboard /> : <DeveloperDashboard />
  );
}

import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import TopBar from "../components/TopBar";
import UserManagement from "../components/UserManagement";
import DashboardSidebar from "../components/DashboardSidebar";
import UserSettings from "../components/UserSettings";
import Spinners from "../components/Spinner";

const AdminDashboard = () => {
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) <Spinners />;

  return (
    <div>
      <TopBar />
      <div className="wrapper d-flex gap-2 mt-1">
        <DashboardSidebar />
        <div className="content bg-white px-3 rounded w-4/5 mt-1 px-2 h-custom-screen overflow-y-scroll pb-8">
          <Routes>
            <Route path="/" exact element={<UserManagement />} />
            <Route path="" exact element={<UserManagement />} />
            <Route path="user" exact element={<UserManagement />} />

            <Route path="settings" exact element={<UserSettings />} />
            <Route path="settings/" exact element={<UserSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

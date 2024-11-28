import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar";
import Home from "../components/Home";
import AllFiles from "../components/AllFiles";
import Directories from "../components/Directories";
import Shared from "../components/ShareFiles";
import Bin from "../components/Bin";

import Spinner from "../components/Spinner";
import handleLogout from "../services/Auth.service";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false); // Set loading to false after the delay
    }, 700); // .7 seconds delay. can be removed only for testing

    const token = localStorage.getItem("token");

    if (token) {
      // Check for token expiry
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (currentTime > decodedToken.exp) {
          handleLogout();
        }
      } catch (error) {
        console.error("Error in getting token:", error);
        localStorage.removeItem("token");
      }
    } else {
      navigate("/login");
    }

    return () => clearTimeout(timeoutId);
  }, [navigate]);

  if (loading) return <Spinner />;

  return (
    <div>
      <TopBar />
      <div className="wrapper d-flex gap-2 mt-1">
        <SideBar />
        <div className="content bg-white px-3 rounded w-4/5 mt-1 px-2 h-custom-screen overflow-y-scroll pb-8">
          <Routes>
            <Route path="/" exact Component={Home} />
            <Route path="/files" exact Component={AllFiles} />
            <Route path="/directories" exact Component={Directories} />
            <Route path="/shared" exact Component={Shared} />
            <Route path="/bin" exact Component={Bin} />

            <Route path="*" element={<navigate to="/NotFound" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar";

import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../components/Home";
import AllFiles from "../components/AllFiles";
import Directories from "../components/Directories";
import Shared from "../components/ShareFiles";
import Bin from "../components/Bin";

import { NotFound } from "../components/NotFound";
import { ServerError } from "../components/ServerError";

const DashboardPage = () => {
  return (
    <div>
      <TopBar />
      <div className="wrapper d-flex gap-2 mt-2">
        <SideBar />
        <div className="content bg-white px-3 rounded w-4/5 mt-1 px-2 h-custom-screen overflow-y-scroll pb-8">
          <Routes>
            <Route path="/" exact Component={Home} />
            <Route path="/files" exact Component={AllFiles} />
            <Route path="/directories" exact Component={Directories} />
            <Route path="/shared" exact Component={Shared} />
            <Route path="/bin" exact Component={Bin} />

            <Route path="/404" Component={NotFound} />
            <Route path="/500" Component={ServerError} />

            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

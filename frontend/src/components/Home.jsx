import React from "react";
import { FileCards } from "./FileCards";

const Home = () => {
  return (
    <div className="">
      <div>
        <div className="title">
          <h2 className="text-2xl mb-2 mt-1">Recent</h2>
        </div>
        <div className="fileList">
          <div className="flex flex-wrap items-center gap-4 w-full">
            <FileCards />
            <FileCards />
            <FileCards />
            <FileCards />
            <FileCards />
          </div>
        </div>
      </div>
      <div>
        <div className="title">
          <h2 className="text-2xl mb-2 mt-3">Another Section</h2>
        </div>
        <div className="fileList">
          <div className="flex flex-wrap items-center gap-4 w-full">
            <FileCards />
            <FileCards />
            <FileCards />
            <FileCards />
            <FileCards />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

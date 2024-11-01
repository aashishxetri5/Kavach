import React from "react";
import { FileCards } from "./FileCards";

const AllFiles = () => {
  return (
    <div className="">
      <div className="title">
        <h2 className="text-2xl mb-3 mt-1">All Files</h2>
      </div>
      <div className="fileList">
        <div className="flex flex-wrap items-center gap-4 w-full">
          <FileCards />
          <FileCards />
          <FileCards />
          <FileCards />
          <FileCards />
          <FileCards />
          <FileCards />
          <FileCards />
          <FileCards />
          <FileCards />
          <FileCards />
          <FileCards />
          <FileCards />
          <FileCards />
          <FileCards />
          <FileCards />
          <FileCards />
          <FileCards />
          <FileCards />
          <FileCards />
          <FileCards />
        </div>
      </div>
    </div>
  );
};

export default AllFiles;

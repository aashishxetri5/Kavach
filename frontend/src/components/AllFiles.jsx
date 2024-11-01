import React from "react";
import { FileCards } from "./FileCards";

const AllFiles = () => {
  return (
    <div class="">
      <div class="title">
        <h2 class="text-2xl mb-3 mt-1">All Files</h2>
      </div>
      <div class="fileList">
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

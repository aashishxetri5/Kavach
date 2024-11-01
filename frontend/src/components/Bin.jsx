import React from "react";
import {Link} from "react-router-dom";

const Bin = () => {
  return (
    <div className="">
      <div className="title">
        <h2 className="text-2xl mb-3 mt-1">Bin</h2>
        <p>You recently delete these files. <Link to="/bin/empty">Empty Bin</Link> </p>
      </div>
      <div className="fileList">
        <div className="flex flex-wrap items-center gap-4 w-full"></div>
      </div>
    </div>
  );
};

export default Bin;

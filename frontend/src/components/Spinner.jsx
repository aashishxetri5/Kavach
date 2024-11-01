import React from "react";
import "../styles/spinner.css";

const Spinners = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Spinners;

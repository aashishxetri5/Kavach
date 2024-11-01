import React from "react";
import ContextMenu from "./ContextMenu";
import { truncateName } from "../utils/truncateName.utils";

const FileCards = () => {
  const fileName = truncateName(
    `New File ${window.crypto.getRandomValues(new Uint8Array(14))}`,
    15
  );

  return (
    <div
      className="card px-0 h-48 border-0 shadow-xl rounded-2xl cursor-pointer"
      style={{ width: "calc(20% - 1.2rem)" }}
    >
      <div
        className="card-body d-flex flex-column justify-content-between align-items-center"
        title="ENTIRE FILE NAME CAN BE VERY LENGHTY"
      >
        <ContextMenu />
        <div className="fileIcon mx-auto w-2/5">
          <img src={require("../assets/PDF.svg").default} alt="PDF Icon" />
          {/* <img src={require(`../assets/${fileType}.svg`).default} alt={`${fileType} Icon`} /> */}
        </div>
        <h5 className="card-title text-center text-base">{fileName}</h5>
      </div>
    </div>
  );
};

export { FileCards };

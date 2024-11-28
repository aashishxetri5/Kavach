import React from "react";
import ContextMenu from "./ContextMenu";
import { truncateName } from "../utils/truncateName.utils";

const FileCards = ({ file }) => {
  return (
    <div
      className="card px-0 h-48 border-0 shadow-xl rounded-2xl cursor-pointer"
      style={{ width: "calc(20% - 1.2rem)" }}
    >
      <div
        className="card-body d-flex flex-column justify-content-between align-items-center"
        title={file.filename}
      >
        <ContextMenu file={{ file }} />

        <div className="fileIcon mx-auto w-2/5">
          <img
            src={require(`../assets/${file.fileType}.svg`)}
            alt={`${file.fileType} Icon`}
          />
        </div>
        <h5 className="card-title text-center text-base">
          {truncateName(file.filename)}
        </h5>
      </div>
    </div>
  );
};

export { FileCards };

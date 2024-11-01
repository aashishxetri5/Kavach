import React from "react";
import { truncateName } from "../utils/truncateName.utils";

const FolderCard = () => {
  const displayName = truncateName(
    `New Folder ${window.crypto.getRandomValues(new Uint8Array(14))}`,
    15
  );

  return (
    <div
      className="directoryCard card px-0 border-0 shadow-xl rounded-2xl cursor-pointer"
      style={{ width: "calc(20% - 1.2rem)" }}
    >
      <div className="card-body py-2 flex items-center gap-2">
        <div className="fileIcon">
          <img
            src={require("../assets/Folder.svg").default}
            alt="Folder Icon"
          />
          {/* <img src={require(`../assets/${fileType}.svg`).default} alt={`${fileType} Icon`} /> */}
        </div>
        <h5 className="card-title text-center mb-0 text-sm">{displayName}</h5>
      </div>
    </div>
  );
};

export { FolderCard };

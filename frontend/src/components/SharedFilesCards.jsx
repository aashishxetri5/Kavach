import React from "react";
import SharedContextMenu from "./SharedContextMenu";
import { truncateName } from "../utils/truncateName.utils";

const SharedFilesCards = ({ userData, email }) => {
  const { fullname, files } = userData;

  return (
    <div className="w-full">
      <div className="mt-4">
        <h5 className="sharedByName mb-0">{fullname}</h5>
        <span className="sharedByEmail block text-xs">{email}</span>
      </div>
      <div className="flex flex-wrap gap-3 pt-3">
        {Object.entries(files).map(([fileKey, fileDetails]) => (
          <div
            className="card px-0 h-48 border-0 shadow-xl rounded-2xl cursor-pointer items-center "
            style={{ width: "calc(20% - 1.2rem)" }}
          >
            <div
              className="card-body d-flex flex-column justify-content-between align-items-center w-full"
              title={fileDetails.filename}
            >
              <SharedContextMenu key={fileDetails._id} file={fileDetails} />

              <div className="fileIcon mx-auto w-2/5">
                <img
                  src={require(`../assets/${fileDetails.fileType}.svg`)}
                  alt={`${fileDetails.fileType} Icon`}
                />
              </div>
              <h5 className="card-title text-center text-base">
                {truncateName(fileDetails.filename)}
              </h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { SharedFilesCards };

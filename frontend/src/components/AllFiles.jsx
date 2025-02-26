import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileCards } from "./FileCards";

import Spinners from "../components/Spinner";

const AllFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const instance = axios.create({
          baseURL: "http://localhost:3000",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await instance.get("/api/file/all");
        setFiles(data.data.files);
      } catch (error) {
        setError(error);
        if (error.response.status === 403) {
          localStorage.removeItem("token");
          window.location.reload();
        }
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, []);

  if (loading) return <Spinners />;

  return (
    <div className="">
      <div className="title">
        <h2 className="text-2xl mb-3 mt-1">All Files</h2>
      </div>
      <div className="fileList">
        <div className="flex flex-wrap items-center gap-4 w-full">
          {files.length !== 0 ? (
            Array.isArray(files) &&
            files.map((file) => <FileCards key={file._id} file={file} />)
          ) : (
            <div className="text-center w-full">
              <h2 className="text-2xl">No files found</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllFiles;

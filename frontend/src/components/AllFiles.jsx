import React, { useEffect } from "react";
import axios from "axios";
import { FileCards } from "./FileCards";

import Spinners from "../components/Spinner";

const AllFiles = () => {
  const [files, setFiles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

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
        if(data.status === 403) {
          localStorage.removeItem("token");
          window.location.reload();
        }
        setFiles(data.data.files);
      } catch (error) {
        setError(error);
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
          {files.map((file) => (
            <FileCards key={file._id} file={file} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllFiles;

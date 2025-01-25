import React, { useEffect, useState } from "react";
import axios from "axios";

import { BinFileCards } from "../components/BinFileCards";
import Spinners from "../components/Spinner";

const Bin = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const cleanTrash = async () => {
    try {
      const instance = axios.create({
        baseURL: "http://localhost:3000",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const response = await instance.post("/api/file/bin/empty");

      if (response.status === 200) {
        alert(response.data.message);
        window.location.reload();
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const instance = axios.create({
          baseURL: "http://localhost:3000",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await instance.get("/api/file/bin");
        console.log(data);
        setFiles(data.data.files);
      } catch (error) {
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
    <div className="select-none">
      <div className="title">
        <h2 className="text-2xl mb-3 mt-1">Bin</h2>
        {files.length !== 0 ? (
          <div className="flex justify-between items-center bg-gray-100 rounded-md p-2">
            <p className="text-gray-500 mb-0">
              Files in the bin are automatically deleted after 14 days.
            </p>
            <span
              onClick={cleanTrash}
              className=" px-3 rounded-md cursor-pointer link-danger underline"
            >
              Empty Bin
            </span>
          </div>
        ) : null}
      </div>
      <div className="fileList">
        <div className="flex flex-wrap items-center gap-4 w-full">
          {files.length !== 0 ? (
            Array.isArray(files) &&
            files.map((file) => <BinFileCards key={file._id} file={file} />)
          ) : (
            <div className=" w-full ">
              <p className="">Hurrah! Your bin is empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bin;

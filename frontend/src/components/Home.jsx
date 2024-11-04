import React, { useEffect, useState } from "react";
import { FileCards } from "./FileCards";

import axios from "axios";

const Home = () => {
  const [resources, setResources] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const instance = axios.create({
          baseURL: "http://localhost:3000",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const response = await instance.get("/api/file/home");

        console.log("response file");
        setResources(response.data);
        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, [hasFetched]);

  return (
    <div className="">
      <div>
        <div className="title">
          <h2 className="text-2xl mb-2 mt-1">Recent</h2>
        </div>
        <div className="fileList">
          <div className="flex flex-wrap items-center gap-4 w-full">
            {/* File cards */}
          </div>
        </div>
      </div>
      <div>
        <div className="title">
          <h2 className="text-2xl mb-2 mt-3">Another Section</h2>
        </div>
        <div className="fileList">
          <div className="flex flex-wrap items-center gap-4 w-full">
            {/* FIle cards */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

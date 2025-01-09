import React, { useEffect, useState } from "react";
import { FileCards } from "./FileCards";

import axios from "axios";

const Home = () => {
  const [resources, setResources] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    document.title = "Kavach | Home";

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

        if (response.status === 200) {
          setResources(response.data.data);
          setHasFetched(true);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
        if (error.response.status === 403) {
          localStorage.removeItem("token");
          window.location.reload();
        }
      }
    };
    fetchFiles();
  }, [hasFetched]);

  return (
    <div className="">
      <div>
        <div className="title">
          <h2 className="text-2xl mb-2 mt-1">Encrypted Files</h2>
        </div>
        {resources?.encryptedFiles?.length > 0 ? (
          <div className="fileList">
            <div className="flex flex-wrap items-center gap-4 w-full">
              {Array.isArray(resources.encryptedFiles) &&
                resources.encryptedFiles.map((file) => (
                  <FileCards key={file._id} file={file} />
                ))}
            </div>
          </div>
        ) : (
          <p>No encrypted files available.</p>
        )}
      </div>
      <div>
        <div className="title">
          <h2 className="text-2xl mb-2 mt-3">Normal Files</h2>
        </div>
        {resources?.encryptedFiles?.length > 0 ? (
          <div className="fileList">
            <div className="flex flex-wrap items-center gap-4 w-full">
              {resources.unencryptedFiles.map((file) => (
                <FileCards key={file._id} file={file} />
              ))}
            </div>
          </div>
        ) : (
          <p>No unencrypted files available.</p>
        )}
      </div>
    </div>
  );
};

export default Home;

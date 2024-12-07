import axios from "axios";
import React, { useEffect, useState } from "react";
import { SharedFilesCards } from "./SharedFilesCards";

const ShareFiles = () => {
  const [resources, setResources] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    document.title = "Kavach | Shared Files";
  }, []);

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

        const response = await instance.get("/api/file/shared");

        if (response.status === 200) {
          setResources(response.data.data);
          setHasFetched(true);
          // console.log(response.data.data);
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
  }, []);

  return (
    <div>
      <div className="title">
        <h2 className="text-2xl mb-3 mt-1">Shared With Me</h2>
      </div>
      <div className="fileList">
        <div className="eachCol">
          {resources?.length > 0 ? (
            <div className="fileList">
              <div className="">
                {/* {console.log(resources)} */}
                {resources.map((userData, userIndex) => (
                  <SharedFilesCards key={userIndex} userData={userData} />
                ))}
              </div>
            </div>
          ) : (
            <p>No shared files found.</p> // Show a message if no files are found
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareFiles;
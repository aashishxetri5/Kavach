import axios from "axios";
import React, { useState } from "react";

const FileUploadModal = () => {
  const [file, setFile] = useState(null);
  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = () => {
    setIsChecked((prev) => {
      const statusText = !prev
        ? "File will be encrypted"
        : "File won't encrypted";

      document.getElementById("fileEncStatus").innerText = statusText;

      return !prev;
    });
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Store the selected file
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }

    formData.append("encrypted", isChecked);

    try {
      const instance = axios.create({
        baseURL: "http://localhost:3000",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const response = await instance.post("/api/file/upload", formData);

      if (response.status === 201) {
        alert("File uploaded successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div
      className="modal fade"
      id="newFileUpload"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="newFileUploadLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="newFileUploadLabel">
              Upload New File
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleFileUpload} encType="multipart/form-data">
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="file" className="form-label">
                  Upload File to Encrypt
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="file"
                  name="file"
                  accept=".pdf, .txt"
                  onChange={handleFileChange}
                  required
                />
                <span className="text-red-800 text-xs" id="fileEncStatus">
                  File will be encrypted
                </span>
              </div>

              <div
                className="btn-group"
                role="group"
                aria-labelledby="Basic checkbox toggle button group"
              >
                <input
                  type="checkbox"
                  className="btn-check"
                  id="encryptionCheck"
                  name="encryptionCheck"
                  autoComplete="off"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <label
                  className="btn btn-outline-danger"
                  style={{ fontSize: "0.75rem", padding: "5px" }}
                  htmlFor="encryptionCheck"
                >
                  Encrypted
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn primaryBtn">
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;

import React, { useState } from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
  };

  return (
    <div className="sidemenu h-custom-screen pt-5 rounded mt-1 w-1/5">
      <div className="newbtn">
        <button
          type="button"
          className="btn d-flex align-items-center quaternaryBtn"
          data-bs-toggle="modal"
          data-bs-target="#newFileUpload"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            focusable="false"
            fill="currentColor"
          >
            <path d="M20 13h-7v7h-2v-7H4v-2h7V4h2v7h7v2z"></path>
          </svg>

          <h2 className="fs-5 mb-0">New</h2>
        </button>
      </div>

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

            <form action="/newfile" method="post" encType="multipart/form-data">
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
                    required
                  />
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

      <aside className="menu mt-4 text-lg">
        <ul className="list-style-none">
          <li className="linkitem">
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 256 256"
              >
                <path
                  fill="black"
                  d="m219.31 108.68l-80-80a16 16 0 0 0-22.62 0l-80 80A15.87 15.87 0 0 0 32 120v96a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-56h32v56a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-96a15.87 15.87 0 0 0-4.69-11.32M208 208h-48v-56a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v56H48v-88l80-80l80 80Z"
                ></path>
              </svg>
              <span className="ms-2">Home</span>
            </Link>
          </li>
          <li className="linkitem">
            <Link to="/files">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 256 256"
              >
                <path
                  fill="black"
                  d="m213.66 66.34l-40-40A8 8 0 0 0 168 24H88a16 16 0 0 0-16 16v16H56a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h112a16 16 0 0 0 16-16v-16h16a16 16 0 0 0 16-16V72a8 8 0 0 0-2.34-5.66M168 216H56V72h76.69L168 107.31zm32-32h-16v-80a8 8 0 0 0-2.34-5.66l-40-40A8 8 0 0 0 136 56H88V40h76.69L200 75.31Zm-56-32a8 8 0 0 1-8 8H88a8 8 0 0 1 0-16h48a8 8 0 0 1 8 8m0 32a8 8 0 0 1-8 8H88a8 8 0 0 1 0-16h48a8 8 0 0 1 8 8"
                ></path>
              </svg>
              <span className="ms-2">All Files</span>
            </Link>
          </li>
          <li className="linkitem">
            <Link to="/directories">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M4 20C3.45 20 2.97933 19.8043 2.588 19.413C2.19667 19.0217 2.00067 18.5507 2 18V6C2 5.45 2.196 4.97933 2.588 4.588C2.98 4.19667 3.45067 4.00067 4 4H10L12 6H20C20.55 6 21.021 6.196 21.413 6.588C21.805 6.98 22.0007 7.45067 22 8V18C22 18.55 21.8043 19.021 21.413 19.413C21.0217 19.805 20.5507 20.0007 20 20H4ZM4 18H20V8H11.175L9.175 6H4V18Z"
                />
              </svg>

              <span className="ms-2">Directories</span>
            </Link>
          </li>
          <li className="linkitem">
            <Link to="/shared">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={22}
                height={22}
                viewBox="0 0 24 24"
              >
                <path
                  fill="black"
                  d="M14 14.252v2.09A6 6 0 0 0 6 22H4a8 8 0 0 1 10-7.749M12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6m0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m6.586 6l-1.829-1.828l1.415-1.415L22.414 18l-4.242 4.243l-1.415-1.415L18.586 19H15v-2z"
                />
              </svg>
              <span className="ms-2">Shared</span>
            </Link>
          </li>
          <li className="linkitem">
            <Link to="/bin">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 256 256"
              >
                <path
                  fill="black"
                  d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"
                ></path>
              </svg>
              <span className="ms-2">Bin</span>
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default SideBar;

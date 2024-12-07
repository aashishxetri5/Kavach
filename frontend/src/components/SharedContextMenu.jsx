import React from "react";
import axios from "axios";

const SharedContextMenu = ({ file }) => {
  const handleDownload = async () => {
    try {
      const instance = axios.create({
        baseURL: "http://localhost:3000",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      let url;
      if (file.filename.includes(".aes")) {
        url = `/api/file/download`;
      } else {
        url = `/api/file/normaldownload`;
      }

      const response = await instance.get(url, {
        params: {
          fileId: file._id, // Pass fileId as a query parameter
        },
        responseType: "blob",
      });
      console.log(response);
      const blob = await response.data;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      if (file.filename.includes(".aes")) {
        link.download = file.filename.replace(".aes", ""); // Set the default download file name
      } else {
        link.download = file.filename;
      }
      link.click();
    } catch (error) {
      console.error("Error downloading file:", error);
      const text = await error.response.data.text();
      alert(JSON.parse(text).message);
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center ms-auto">
      <div className="dropdown ms-auto">
        <svg
          className="cursor-pointer"
          width="20"
          height="20"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <path
            d="M9.75 8C9.75 8.34612 9.64736 8.68446 9.45507 8.97225C9.26278 9.26003 8.98947 9.48434 8.6697 9.61679C8.34993 9.74924 7.99806 9.7839 7.65859 9.71637C7.31913 9.64885 7.00731 9.48218 6.76256 9.23744C6.51782 8.9927 6.35115 8.68087 6.28363 8.34141C6.2161 8.00194 6.25076 7.65007 6.38321 7.3303C6.51567 7.01053 6.73997 6.73722 7.02775 6.54493C7.31554 6.35264 7.65388 6.25 8 6.25C8.46413 6.25 8.90925 6.43437 9.23744 6.76256C9.56563 7.09075 9.75 7.53587 9.75 8ZM3 6.25C2.65388 6.25 2.31554 6.35264 2.02775 6.54493C1.73997 6.73722 1.51566 7.01053 1.38321 7.3303C1.25076 7.65007 1.2161 8.00194 1.28363 8.34141C1.35115 8.68087 1.51782 8.9927 1.76256 9.23744C2.00731 9.48218 2.31913 9.64885 2.65859 9.71637C2.99806 9.7839 3.34993 9.74924 3.6697 9.61679C3.98947 9.48434 4.26278 9.26003 4.45507 8.97225C4.64737 8.68446 4.75 8.34612 4.75 8C4.75 7.53587 4.56563 7.09075 4.23744 6.76256C3.90925 6.43437 3.46413 6.25 3 6.25ZM13 6.25C12.6539 6.25 12.3155 6.35264 12.0278 6.54493C11.74 6.73722 11.5157 7.01053 11.3832 7.3303C11.2508 7.65007 11.2161 8.00194 11.2836 8.34141C11.3512 8.68087 11.5178 8.9927 11.7626 9.23744C12.0073 9.48218 12.3191 9.64885 12.6586 9.71637C12.9981 9.7839 13.3499 9.74924 13.6697 9.61679C13.9895 9.48434 14.2628 9.26003 14.4551 8.97225C14.6474 8.68446 14.75 8.34612 14.75 8C14.75 7.77019 14.7047 7.54262 14.6168 7.3303C14.5288 7.11798 14.3999 6.92507 14.2374 6.76256C14.0749 6.60006 13.882 6.47116 13.6697 6.38321C13.4574 6.29526 13.2298 6.25 13 6.25Z"
            fill="black"
          />
        </svg>
        <ul className="dropdown-menu cursor-pointer user-select-none py-2">
          <li
            key={"Download"}
            className="contextMenuItem"
            onClick={handleDownload}
          >
            <span className="dropdown-item items-center gap-2 py-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 512 512"
              >
                <path
                  fill="black"
                  className="contextMenuIcon"
                  d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32v242.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64v-32c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352zm368 56a24 24 0 1 1 0 48a24 24 0 1 1 0-48"
                />
              </svg>
              <span>Download</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SharedContextMenu;

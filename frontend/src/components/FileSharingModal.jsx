import React, { useEffect, useState } from "react";
import axios from "axios";

const FileSharingModal = ({ file }) => {
  const [emails, setEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmails, setSelectedEmails] = useState(new Set());
  const fileId = file._id;

  const fetchEmails = async () => {
    console.log("fetch emails", file._id);
    try {
      const instance = axios.create({
        baseURL: "http://localhost:3000",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const response = await instance.get(`/api/user/emails`);
      console.log("response", response);
      if (response.data?.data) {
        const emailList = response.data.data.map((item) => ({
          email: item.email,
          fullname: item.fullname,
        }));
        setEmails(emailList); // Set emails in state
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSharedUsers = async () => {
    console.log("fetch shared users", file._id);
    try {
      const instance = axios.create({
        baseURL: "http://localhost:3000",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const response = await instance.get(`/api/file/sharedWith/${file._id}`);

      if (response.data?.sharedWith) {
        const sharedWith = response.data.sharedWith.map((user) => user.email);

        // Set the checked emails state
        setSelectedEmails(new Set(sharedWith)); // pre-select emails that are already shared
      }
    } catch (error) {
      console.error("Error fetching shared users", error);
    }
  };

  const filteredEmails = emails.filter(
    (emailObj) =>
      emailObj.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emailObj.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChange = (email) => {
    console.log("checkbox change", file._id);
    setSelectedEmails((prevSelected) => {
      const newCheckedEmails = new Set(prevSelected);
      if (newCheckedEmails.has(email)) {
        newCheckedEmails.delete(email); // Unselect the email
      } else {
        newCheckedEmails.add(email); // Select the email
      }
      return newCheckedEmails;
    });
  };

  const handleModalClose = () => {
    console.log("close modal", file._id);
    setSearchQuery("");
    setSelectedEmails(new Set());
  };

  const handleFileShare = async () => {
    console.log("file share", fileId);
    try {
      // Send the selected emails to the backend API
      const instance = axios.create({
        baseURL: "http://localhost:3000",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const response = await instance.post("/api/file/share", {
        emails: Array.from(selectedEmails),
        fileId,
      });

      if (response.status === 200) {
        document.getElementById("modalCloseBtn").click();
        alert("File shared successfully " + fileId);
      }
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  };

  const beginEmailTasks = async () => {
    console.log("tasks", file._id);
    await fetchEmails();
    await fetchSharedUsers();
  };

  useEffect(() => {
    beginEmailTasks();
    console.log("Modal received file ID:", file._id);
  }, [file]);

  return (
    <div
      className="modal fade"
      id="staticShareModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="staticShareModalLabel"
      aria-hidden="true"
      onShow={beginEmailTasks}
    >
      <div className="modal-dialog modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="staticShareModalLabel">
              Share Files
            </h1>
            <button
              type="button"
              id="modalCloseBtn"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleModalClose}
            ></button>
          </div>

          <div className="modal-body">
            {/* Search box */}
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search by fullname or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {filteredEmails.map((emailObj, index) => (
              <div
                className="form-check form-switch mb-2 d-flex items-center gap-2"
                key={index}
              >
                {console.log(file._id, index)}
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  style={{ width: "3em", height: "1.5em" }}
                  id={emailObj.email}
                  checked={selectedEmails.has(emailObj.email)}
                  onChange={() => handleCheckboxChange(emailObj.email)}
                />

                <label className="form-check-label" htmlFor={emailObj.email}>
                  {emailObj.fullname}
                  <span className="block text-xs">{emailObj.email}</span>
                </label>
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleFileShare}
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileSharingModal;

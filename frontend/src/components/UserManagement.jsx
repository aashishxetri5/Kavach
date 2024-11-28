import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import getUserRole from "../services/Roles.services";
import Spinners from "../components/Spinner";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isChecked, setIsChecked] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRadioChange = (event) => {
    setIsChecked(event.target.id === "adminRole" ? "Admin" : "Employee");
  };

  const fetchUsers = async () => {
    try {
      const instance = axios.create({
        baseURL: "http://localhost:3000",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const response = await instance.get("/api/user/list");

      if (response.status === 200) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    document.title = "Kavach | Admin Dashboard";

    const checkUserRole = async () => {
      try {
        const role = getUserRole();
        if (role !== "ADMIN") {
          return navigate("/profile/settings");
        }
        fetchUsers();
      } catch (error) {
        console.error("Error checking user role:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [navigate]);

  if (loading) return <Spinners />;

  const handleUserRegistration = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();

    const name = e.target.fullname.value;
    const email = e.target.email.value;

    formData.append("fullname", name);
    formData.append("email", email);
    formData.append("role", isChecked);

    try {
      const instance = axios.create({
        baseURL: "http://localhost:3000",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const response = await instance.post("/api/user/register", formData);

      if (response.status === 201) {
        alert("User registered successfully");
        window.location.reload();
      }
    } catch (error) {
      if (error.response.status === 400) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div>
      <div className="my-4">
        <button
          className="flex items-center gap-2 quaternaryBtn px-3 py-2 rounded new-user-btn"
          data-bs-toggle="modal"
          data-bs-target="#newuserbtn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 26 26"
          >
            <path
              fill="#f0f3f4"
              d="M10.5.156c-3.017 0-5.438 2.072-5.438 6.032c0 2.586 1.03 5.22 2.594 6.843c.61 1.623-.49 2.227-.718 2.313C3.781 16.502.093 18.602.093 20.688v.78c0 2.843 5.414 3.5 10.437 3.5a46 46 0 0 0 3.281-.124a7.75 7.75 0 0 1-2.124-5.344c0-1.791.61-3.432 1.624-4.75c-.15-.352-.21-.907.063-1.75c1.555-1.625 2.563-4.236 2.563-6.813c0-3.959-2.424-6.03-5.438-6.03zm9 13.031a6.312 6.312 0 1 0 0 12.625a6.312 6.312 0 0 0 0-12.625M18.625 16h1.75v2.594h2.594v1.812h-2.594V23h-1.75v-2.594H16v-1.812h2.625z"
            />
          </svg>
          <span className="text-xl font-semibold">New user</span>
        </button>
        <div>
          <div
            className="modal fade"
            id="newuserbtn"
            tabIndex="-1"
            aria-labelledby="newuserbtnLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="newuserbtnLabel">
                    Modal title
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <form method="POST" onSubmit={handleUserRegistration}>
                  <div className="modal-body">
                    {/* Field: Fullname */}
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="fullname"
                        placeholder="Eg. John Doe"
                        required
                      />
                    </div>

                    {/* Field: email */}
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="example@mail.com"
                        required
                      />
                      <span
                        className="block mb-1 text-sm text-red-700 mt-2"
                        id="error-msg"
                      >
                        {error && <p style={{ color: "red" }}>{error}</p>}
                      </span>
                    </div>

                    {/* Field: Roles */}
                    <label htmlFor="email" className="form-label d-block">
                      Role
                    </label>
                    <div
                      className="btn-group gap-2"
                      role="group"
                      aria-labelledby="Basic checkbox toggle button group"
                    >
                      <div className="mb-3">
                        <input
                          type="radio"
                          className="btn-check"
                          id="adminRole"
                          name="roleAssigned"
                          autoComplete="off"
                          checked={isChecked === "Admin"}
                          onChange={handleRadioChange}
                        />
                        <label
                          className="btn btn-outline-danger"
                          htmlFor="adminRole"
                        >
                          Admin
                        </label>
                      </div>
                      <div className="mb-3">
                        <input
                          type="radio"
                          className="btn-check"
                          id="employeeRole"
                          name="roleAssigned"
                          autoComplete="off"
                          checked={isChecked === "Employee"}
                          onChange={handleRadioChange}
                        />
                        <label
                          className="btn btn-outline-danger"
                          htmlFor="employeeRole"
                        >
                          Employee
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn primaryBtn">
                      Add User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="desc flex gap-1 items-center mb-2 text-sm text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={18}
          height={18}
          viewBox="0 0 24 24"
        >
          <path
            fill="#9ca3af"
            d="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8t-.288-.712T12 7t-.712.288T11 8t.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
          ></path>
        </svg>
        <p className="mb-0">Your Data is not included here.</p>
      </div>
      <table
        className="table table-striped table-hover table-bordered userMgmtTbl sticky-top"
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Authority</th>
            <th scope="col">Joined date</th>
            <th scope="col" colSpan={2}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.fullname}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{new Date(user.joined_at).toLocaleDateString("en-IN")}</td>
              <td>
                {/* Edit Icon */}
                {user.role === "EMPLOYEE" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    className="cursor-pointer"
                    title="Promote to Admin"
                  >
                    <path
                      fill="#3498db"
                      d="M12 2.15q.2 0 .363.025t.337.1l6 2.25q.575.225.938.725T20 6.375V9.5q0 .425-.287.713T19 10.5t-.712-.288T18 9.5V6.4l-6-2.25L6 6.4v4.7q0 1.25.363 2.5t1 2.375T8.913 18t1.987 1.475q.375.2.538.575t.012.75q-.175.4-.562.55t-.763-.05Q7.3 19.9 5.65 17.075T4 11.1V6.375q0-.625.363-1.125t.937-.725l6-2.25q.175-.075.35-.1T12 2.15M17 22q-2.075 0-3.537-1.463T12 17t1.463-3.537T17 12t3.538 1.463T22 17t-1.463 3.538T17 22m0-5q.625 0 1.063-.437T18.5 15.5t-.437-1.062T17 14t-1.062.438T15.5 15.5t.438 1.063T17 17m0 3q.625 0 1.175-.238t.975-.687q.125-.15.1-.337t-.225-.288q-.475-.225-.987-.337T17 18t-1.037.113t-.988.337q-.2.1-.225.288t.1.337q.425.45.975.688T17 20"
                    ></path>
                  </svg>
                )}
                {user.role === "ADMIN" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    className="cursor-pointer"
                    title="Demote to Employee"
                  >
                    <path
                      fill="#3498db"
                      d="M18 13.25a.75.75 0 0 1 .75.75v4.725l1.727-1.68a.75.75 0 1 1 1.046 1.076L18 21.546l-3.523-3.425a.75.75 0 1 1 1.046-1.075l1.727 1.679V14a.75.75 0 0 1 .75-.75"
                      opacity={0.5}
                    ></path>
                    <path
                      fill="#3498db"
                      d="M10 3.75C8.695 3.75 7.671 4.776 7.671 6S8.695 8.25 10 8.25S12.329 7.224 12.329 6S11.305 3.75 10 3.75M6.171 6c0-2.09 1.733-3.75 3.829-3.75S13.829 3.91 13.829 6S12.096 9.75 10 9.75S6.171 8.09 6.171 6m1.3 5.966c-.182-.117-.32-.124-.384-.107q-.215.06-.428.128l-.985.315a2.27 2.27 0 0 0-1.468 1.404a1.3 1.3 0 0 0-.052.272l-.39 3.699l-.003.013c-.074.527.207.93.634 1.03c1.077.25 2.89.53 5.605.53a.75.75 0 1 1 0 1.5c-2.818 0-4.746-.292-5.945-.57c-1.288-.299-1.941-1.51-1.78-2.687l.388-3.673c.018-.172.05-.385.125-.604a3.77 3.77 0 0 1 2.429-2.342l.984-.316q.243-.077.488-.145c.612-.168 1.193.033 1.596.294c.37.24.974.529 1.715.529c.74 0 1.345-.29 1.715-.53c.403-.26.984-.461 1.596-.293q.245.068.488.145l.984.316a.75.75 0 1 1-.457 1.428l-.985-.315a11 11 0 0 0-.428-.128c-.065-.017-.202-.01-.384.107c-.512.332-1.4.77-2.529.77s-2.017-.438-2.53-.77"
                    ></path>
                  </svg>
                )}
              </td>
              <td>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 256 256"
                  className="cursor-pointer"
                >
                  <path
                    fill="#e74c3c"
                    d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"
                  ></path>
                </svg>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;

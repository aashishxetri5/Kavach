import axios from "axios";
import React, { useEffect, useState } from "react";
import Spinners from "./Spinner";

const UserSettings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    document.title = "Kavach | Admin Dashboard";

    const fetchUser = async () => {
      try {
        const instance = axios.create({
          baseURL: "http://localhost:3000",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const response = await instance.get("/api/user/loggedInUser");
        if (response.status === 200) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <Spinners />;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("fullname", user.fullname);
    formData.append("email", user.email);

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      const instance = axios.create({
        baseURL: "http://localhost:3000",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const response = await instance.post(
        "/api/user/updateProfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("response from server: ", response);
      if (response.status === 200) {
        alert("Profile updated successfully!");
        // localStorage.removeItem("token");
        // window.location.reload();
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    document.getElementById("oldPasswordError").innerText = "";
    document.getElementById("newPasswordError").innerText = "";
    document.getElementById("confirmPasswordError").innerText = "";

    const oldPassword = e.target.oldpassword.value;
    const newPassword = e.target.newpassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword.length < 8) {
      document.getElementById("newPasswordError").innerText =
        "Password too short";
      return;
    }

    if (newPassword === oldPassword) {
      document.getElementById("newPasswordError").innerText =
        "New password must be different from old password.";
      return;
    }

    if (newPassword !== confirmPassword) {
      document.getElementById("confirmPasswordError").innerText =
        "Passwords do not match.";
      return;
    }

    try {
      const instance = axios.create({
        baseURL: "http://localhost:3000",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const response = await instance.post("/api/user/change-password", {
        oldPassword,
        newPassword,
      });

      console.log("response from server: ", response);

      if (response.status === 200) {
        alert("Password changed successfully! Please login again.");
        localStorage.removeItem("token");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      document.getElementById("oldPasswordError").innerText =
        "Incorrect old password.";
    }
  };

  return (
    <div className="mx-12 my-4 select-none">
      <h2 className="mt-8 mb-4">Profile Information</h2>
      <form
        onSubmit={handleProfileUpdate}
        encType="multipart/form-data"
        className="mr-20"
      >
        <div className="mb-3">
          <div
            className="h-32 w-32 border-3 border-solid rounded-full"
            style={{ borderColor: "#4e79b0" }}
          >
            <img
              src={
                user?.profilePic ||
                "https://ui-avatars.com/api/?name=?&background=e74c3c&color=f0f3f4&font-wieght=800`"
              }
              alt=""
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              className="aspect-square "
            />
          </div>
          <input
            type="file"
            className="mt-3"
            name="profilePicture"
            accept=".jpg, .png, .jpeg"
            onChange={handleFileChange}
          />
        </div>

        <div className="columns-2 gap-8">
          <div className="mb-3">
            <label htmlFor="fullname" className="form-label">
              Fullname
            </label>
            <input
              type="text"
              className="form-control border-solid border-slate-400"
              id="fullname"
              name="fullname"
              placeholder="Eg. John Doe"
              value={user?.fullname || ""}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control border-solid border-slate-400"
              id="email"
              name="email"
              placeholder="johndoe@example.com"
              value={user?.email || ""}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <input
            type="submit"
            className="form-control w-auto px-5 mt-3 bg-red-700 text-white"
            id="submit"
            name="submit"
            required
            value={"Update Profile"}
          />
        </div>
      </form>

      <hr className="my-8" />

      <h2 className="mt-8 mb-4">Change Password</h2>
      <form className="" onSubmit={handlePasswordChange}>
        <div className="columns-3 gap-4">
          <div className="mb-3">
            <label htmlFor="oldpassword" className="form-label">
              Old Password
            </label>
            <input
              type="password"
              className="form-control border-solid border-slate-400"
              id="oldpassword"
              name="oldpassword"
              placeholder={"*************"}
              required
            />
            <span
              className="error text-danger"
              style={{ fontSize: "0.85rem" }}
              id="oldPasswordError"
            ></span>
          </div>
          <div className="mb-3">
            <label htmlFor="newpassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              className="form-control border-solid border-slate-400"
              id="newpassword"
              name="newpassword"
              placeholder={"*************"}
              required
            />
            <span
              className="error text-danger"
              style={{ fontSize: "0.85rem" }}
              id="newPasswordError"
            ></span>
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control border-solid border-slate-400"
              id="confirmPassword"
              name="confirmPassword"
              placeholder={"*************"}
              required
            />
            <span
              className="error text-danger"
              style={{ fontSize: "0.85rem" }}
              id="confirmPasswordError"
            ></span>
          </div>
        </div>
        <div className="mb-3">
          <input
            type="submit"
            className="form-control w-auto px-5 mt-3 bg-red-700 text-white"
            id="changepwd"
            name="submit"
            required
            value={"Change Password"}
          />
        </div>
      </form>
    </div>
  );
};

export default UserSettings;

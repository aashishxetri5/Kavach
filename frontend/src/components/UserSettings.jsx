import React, { useEffect } from "react";

const UserSettings = () => {
  useEffect(() => {
    document.title = "Kavach | Admin Dashboard";
  }, []);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
  };

  return (
    <div className="mx-12 my-4">
      <h2 className="mt-8 mb-4">Profile Information</h2>
      <form
        onSubmit={handleProfileUpdate}
        encType="multipart/form-data"
        className="mr-20"
      >
        <div className="mb-3">
          <div
            className="h-32 w-32 border-2 border-solid rounded-full"
            style={{ borderColor: "#e74c3c" }}
          >
            <img
              src="https://dummyimage.com/400x400/d0d0d0/fff"
              alt=""
              style={{ height: "100%", width: "100%", borderRadius: "50%" }}
              className="aspect-square "
            />
          </div>
          <input type="file" className="mt-3" name="profilePicture" />
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
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <input
            type="submit"
            className="form-control w-auto px-5 mt-3 bg-red-700 text-white"
            id="email"
            name="submit"
            required
            value={"Update Profile"}
          />
        </div>
      </form>

      <hr className="my-8" />

      <h2 className="mt-8 mb-4">Change Password</h2>
      <form className="">
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
              required
            />
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
              required
            />
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
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <input
            type="submit"
            className="form-control w-auto px-5 mt-3 bg-red-700 text-white"
            id="email"
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

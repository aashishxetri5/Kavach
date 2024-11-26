import React, { useEffect } from "react";

const UserManagement = () => {
  useEffect(() => {
    document.title = "Kavach | Admin Dashboard";
  }, []);

  return (
    <div>
      <p>UserManagement.JSX</p>
    </div>
  );
};

export default UserManagement;

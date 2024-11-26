import { Link } from "react-router-dom";
import getUserRole from "../services/Roles.services";

const DashboardSidebar = () => {
  getUserRole();
  return (
    <div className="sidemenu h-custom-screen pt-5 rounded mt-1 w-1/5">
      <aside className="menu text-lg">
        <ul className="list-style-none">
          <li className="linkitem mb-12 text-sm">
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 16 16"
              >
                <path
                  fill="black"
                  fill-rule="evenodd"
                  d="m2.87 7.75l1.97 1.97a.75.75 0 1 1-1.06 1.06L.53 7.53L0 7l.53-.53l3.25-3.25a.75.75 0 0 1 1.06 1.06L2.87 6.25h9.88a3.25 3.25 0 0 1 0 6.5h-2a.75.75 0 0 1 0-1.5h2a1.75 1.75 0 1 0 0-3.5z"
                  clip-rule="evenodd"
                />
              </svg>
              <span className="ms-2 ">Back to Website</span>
            </Link>
          </li>

          {"ADMIN" === "ADMIN" && (
            <li className="linkitem">
              <Link to="user">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="#e74c3c"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2m1-17.87a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85"
                  />
                </svg>
                <span className="ms-2">User Management</span>
              </Link>
            </li>
          )}

          <li className="linkitem">
            <Link to="settings">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="#e74c3c"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M7.05 6.462a2 2 0 0 0 2.63-1.519l.32-1.72a9 9 0 0 1 3.998 0l.322 1.72a2 2 0 0 0 2.63 1.519l1.649-.58a9 9 0 0 1 2.001 3.46l-1.33 1.14a2 2 0 0 0 0 3.037l1.33 1.139a9 9 0 0 1-2.001 3.46l-1.65-.58a2 2 0 0 0-2.63 1.519L14 20.777a9 9 0 0 1-3.998 0l-.322-1.72a2 2 0 0 0-2.63-1.519l-1.649.58a9 9 0 0 1-2.001-3.46l1.33-1.14a2 2 0 0 0 0-3.036L3.4 9.342a9 9 0 0 1 2-3.46zM12 9a3 3 0 1 1 0 6a3 3 0 0 1 0-6"
                  clip-rule="evenodd"
                />
              </svg>

              <span className="ms-2">Account</span>
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default DashboardSidebar;

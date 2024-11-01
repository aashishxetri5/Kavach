import { Link } from "react-router-dom";

import logo from "../logo.svg";

const TopBar = () => {
  return (
    <div>
      <div className="topbar">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className="searchbar" style={{ width: "65%" }}>
          <form action="/search">
            <input
              type="text"
              className="w-full form-control outline-none"
              name="search"
              placeholder="Search for files"
            />
          </form>
        </div>
        <div className="right flex items-center gap-3 cursor-pointer">
          <div
            className="settings-ico"
            data-bs-toggle="modal"
            data-bs-target="#settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M7.05 6.462a2 2 0 0 0 2.63-1.519l.32-1.72a9 9 0 0 1 3.998 0l.322 1.72a2 2 0 0 0 2.63 1.519l1.649-.58a9 9 0 0 1 2.001 3.46l-1.33 1.14a2 2 0 0 0 0 3.037l1.33 1.139a9 9 0 0 1-2.001 3.46l-1.65-.58a2 2 0 0 0-2.63 1.519L14 20.777a9 9 0 0 1-3.998 0l-.322-1.72a2 2 0 0 0-2.63-1.519l-1.649.58a9 9 0 0 1-2.001-3.46l1.33-1.14a2 2 0 0 0 0-3.036L3.4 9.342a9 9 0 0 1 2-3.46zM12 9a3 3 0 1 1 0 6a3 3 0 0 1 0-6"
                clipRule="evenodd"
              ></path>
            </svg>
            <div
              className="modal fade"
              id="settings"
              tabIndex="-1"
              aria-labelledby="settingsLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="settingsLabel">
                      Modal title
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Ab minus quod aperiam tenetur nihil animi expedita aliquid
                      voluptatum a odit reprehenderit, quasi optio, ullam
                      officia, adipisci neque rem doloremque accusamus!
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Ab minus quod aperiam tenetur nihil animi expedita aliquid
                      voluptatum a odit reprehenderit, quasi optio, ullam
                      officia, adipisci neque rem doloremque accusamus!
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Ab minus quod aperiam tenetur nihil animi expedita aliquid
                      voluptatum a odit reprehenderit, quasi optio, ullam
                      officia, adipisci neque rem doloremque accusamus!
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Ab minus quod aperiam tenetur nihil animi expedita aliquid
                      voluptatum a odit reprehenderit, quasi optio, ullam
                      officia, adipisci neque rem doloremque accusamus!
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn primaryBtn">
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="userdd dropdown">
            <div
              className="dropdown-toggle userProfile"
              style={{ height: "40px", width: "40px" }}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://dummyimage.com/400x400/d0d0d0/fff"
                alt=""
                style={{ height: "100%", width: "100%", borderRadius: "50%" }}
              />
            </div>
            <ul className="dropdown-menu">
              <li>
                <Link className="dropdown-item py-2" to="#">
                  Action
                </Link>
              </li>
              <li>
                <Link className="dropdown-item py-2" to="#">
                  Another action
                </Link>
              </li>
              <li>
                <Link className="dropdown-item py-2" to="#">
                  Something else here
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link className="dropdown-item py-2" to="/logout">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

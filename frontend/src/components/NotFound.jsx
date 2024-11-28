import React from "react";
import { Link } from "react-router-dom";

import "../styles/output.css";

const NotFound = () => {
  return (
    <div className="h-screen mx-auto flex justify-center items-center text-center px-8">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={48}
          height={48}
          viewBox="0 0 512 512"
          className="w-20 h-20 mx-auto"
        >
          <path
            fill="black"
            d="M80 480a16 16 0 0 1-16-16V68.13a24 24 0 0 1 11.9-20.72C88 40.38 112.38 32 160 32c37.21 0 78.83 14.71 115.55 27.68C305.12 70.13 333.05 80 352 80a183.8 183.8 0 0 0 71-14.5a18 18 0 0 1 25 16.58v219.36a20 20 0 0 1-12 18.31c-8.71 3.81-40.51 16.25-84 16.25c-24.14 0-54.38-7.14-86.39-14.71C229.63 312.79 192.43 304 160 304c-36.87 0-55.74 5.58-64 9.11V464a16 16 0 0 1-16 16"
          ></path>
        </svg>

        <h1 className="mt-10 text-4xl leading-snug font-bold">
          Error 404 <br /> It looks like page you're requesting doesn't exist.
        </h1>

        <p className="mt-8 mb-14 text-lg font-normal text-gray-500 mx-auto md:max-w-sm">
          Don't worry, our team is already on it. Please try refreshing the page
          or come back later.
        </p>
        <p className="mt-12">
          <Link
            to="/"
            className="w-full p-3 rounded shadow-lg text-lg text-white font-bold text-center cursor-pointer"
            style={{ backgroundColor: "var(--quaternary-color)" }}
          >
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export { NotFound };

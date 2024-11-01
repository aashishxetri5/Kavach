import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Spinner from "../components/Spinner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State for error messages
  const [success, setSuccess] = useState(null); // State for success messages
  const [loading, setLoading] = useState(true); // State for loading
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/";
    } else {
      const timeoutId = setTimeout(() => {
        setLoading(false); // Set loading to false after the delay
      }, 700); // .7 seconds delay. can be removed only for testing

      return () => clearTimeout(timeoutId);
    }
  }, [navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(`/api/auth/login`, {
        email,
        password,
      });

      const { success, message, token } = response.data.result;

      if (success) {
        localStorage.setItem("token", token);
        setSuccess(message);
        navigate("/");
      } else {
        setError(message);
      }

      console.log("Login Response:", response.data.result);
    } catch (error) {
      console.error("Error in handleFormSubmit:", error);
      setError("Something went wrong!! Try again.");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md px-12 py-8 bg-white/[.95] rounded-lg shadow-lg">
        <section>
          <h1 className="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-2xl">
            Sign In
          </h1>
          <br />
          <form onSubmit={handleFormSubmit} className="lato">
            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-semibold text-gray-900"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                className="bg-gray-200 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                placeholder="john@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-bold text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                placeholder="••••••••••••"
                className="bg-gray-200 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pr-10"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="">
              <span
                className="block mb-1 text-sm text-red-700 text-center mt-2"
                id="error-msg"
              >
                {error && <p style={{ color: "red" }}>{error}</p>}
              </span>
            </div>

            <div className="flex items-center justify-end">
              <div className="forgotpwd">
                <Link
                  to="#"
                  className="text-sm font-light text-gray-700 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                type="submit"
                className="bg-primary w-2/6 text-white bg-blue-600 font-medium rounded-lg text-sm px-4 py-2 transition ease-in-out hover:scale-110"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-4 flex justify-center">
            <Link
              to="/"
              className="text-gray-800 font-medium rounded-lg text-sm px-4 py-2 flex justify-center items-center underline hover:bg-gray-200/[.5] transition ease-in-out hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="black"
                  d="m12 5.561l-7 5.6V19h5v-4h4v4h5v-7.358a1 1 0 0 0-.375-.781zM12 3l7.874 6.3A3 3 0 0 1 21 11.641V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7.839A2 2 0 0 1 3.75 9.6z"
                ></path>
              </svg>
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;

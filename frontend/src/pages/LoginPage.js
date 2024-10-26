import React from "react";

function LoginPage() {
  return (
    <div className="w-full max-w-md px-12 py-8 bg-white/[.95] rounded-lg shadow-lg">
      <section>
        <h1 className="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-2xl">
          Sign In
        </h1>
        <br />
        <form action="login" method="post" className="lato">
          <div>
            <label
              for="email"
              className="block mb-1 text-sm font-semibold text-gray-900"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-gray-200 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
              placeholder="john@example.com"
              required
            />
            <span
              className="block mb-1 text-sm text-red-700"
              id="email-error-msg"
            ></span>
          </div>
          <div className="mt-4">
            <label
              for="password"
              className="block mb-1 text-sm font-bold text-gray-900"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="bg-gray-200 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 pr-10"
              required
            />
            <span
              className="block mb-3 text-sm text-red-700"
              id="pwd-error-msg"
            ></span>
            <span
              id="togglePassword"
              className="password-toggle-icon absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-700 dark:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 23 23"
                stroke-width="2"
                stroke="#c2c2c2"
                width="15"
                height="15"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </span>
          </div>
          <div className="flex items-center justify-end">
            <div className="forgotpwd">
              <a
                href="#"
                className="text-sm font-light text-gray-700 hover:underline"
              >
                Forgot Password?
              </a>
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
          <a
            href="/"
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
          </a>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;
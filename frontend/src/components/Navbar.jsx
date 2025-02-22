import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-100">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Left Section - Branding */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center group">
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent">
                    LaLa
                  </span>
                  <span className="ml-2 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                    Properties
                  </span>
                </Link>
              </div>

              {/* Right Section - User Controls */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center focus:outline-none">
                      <div className="relative">
                        <img
                          className="h-9 w-9 rounded-full ring-2 ring-primary-100 hover:ring-primary-200 transition-all"
                          src={user.profilePicture}
                          alt="User profile"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                    </Menu.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                        {/* User Info */}
                        <div className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>

                        {/* Navigation Links */}
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/dashboard"
                                className={`${
                                  active
                                    ? "bg-gray-50 text-primary-600"
                                    : "text-gray-700"
                                } flex items-center px-4 py-2.5 text-sm transition-colors`}
                              >
                                <svg
                                  className="w-5 h-5 mr-3 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                                Dashboard
                              </Link>
                            )}
                          </Menu.Item>
                          {user?.role === "host" && (
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/host"
                                  className={`${
                                    active
                                      ? "bg-gray-50 text-primary-600"
                                      : "text-gray-700"
                                  } flex items-center px-4 py-2.5 text-sm transition-colors`}
                                >
                                  <svg
                                    className="w-5 h-5 mr-3 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                  </svg>
                                  Host Dashboard
                                </Link>
                              )}
                            </Menu.Item>
                          )}
                        </div>

                        {/* Logout */}
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={logout}
                                className={`${
                                  active
                                    ? "bg-gray-50 text-red-600"
                                    : "text-gray-700"
                                } w-full text-left flex items-center px-4 py-2.5 text-sm transition-colors`}
                              >
                                <svg
                                  className="w-5 h-5 mr-3 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                  />
                                </svg>
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:to-primary-700 shadow-sm transition-all"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}

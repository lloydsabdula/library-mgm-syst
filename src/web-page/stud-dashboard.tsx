import React, { useState } from "react";
import DashboardHome from "./stud-dashhome";
import MyBooks from "./mybooks";
import BorrowHistory from "./borrow-history";
import Profile from "./profilepage";
import BookRequest from "./bookrequest";

interface StudentDashboardProps {
  onLogout: () => void;
}

type Page = "home" | "mybooks" | "borrowhistory" | "profile" | "bookrequest";

export default function StudentDashboard({ onLogout }: StudentDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <DashboardHome />;
      case "mybooks":
        return <MyBooks onReturn={() => {}} />; // replace with actual callback if needed
      case "bookrequest":
        return <BookRequest />;
      case "borrowhistory":
        return <BorrowHistory returnedBooks={[]} />; // replace with actual state
      case "profile":
        return <Profile />; // self-contained now
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <nav className="flex flex-col mt-4 space-y-2">
          <button
            className="text-left px-4 py-2 rounded hover:bg-gray-100 w-full text-gray-700"
            onClick={() => setCurrentPage("home")}
          >
            Home
          </button>
          <button
            className="text-left px-4 py-2 rounded hover:bg-gray-100 w-full text-gray-700"
            onClick={() => setCurrentPage("mybooks")}
          >
            My Books
          </button>
          <button
  className="text-left px-4 py-2 rounded hover:bg-gray-100 w-full text-gray-700"
  onClick={() => setCurrentPage("bookrequest")}
>
  Book Request
</button>
          <button
            className="text-left px-4 py-2 rounded hover:bg-gray-100 w-full text-gray-700"
            onClick={() => setCurrentPage("borrowhistory")}
          >
            Borrow History
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-center bg-white shadow px-6 py-4 relative">
          {/* Sidebar toggle top-left */}
          <button
            className="absolute left-6 text-gray-500 hover:text-gray-800 font-bold text-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>

          {/* Header title centered */}
          <h1 className="text-xl font-bold">Student Dashboard</h1>

          {/* Profile dropdown top-right */}
          <div className="absolute right-6">
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <span>Student</span>
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl z-20">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setCurrentPage("profile");
                    setProfileOpen(false);
                  }}
                >
                  Profile
                </button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Settings
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{renderPage()}</main>
      </div>
    </div>
  );
}

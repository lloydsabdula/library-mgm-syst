import React from "react";

export default function DashboardHome() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome, Student!</h2>
      <p className="text-gray-600 mb-6">
        This is your dashboard home. You can check borrowed books and view notifications.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Books Borrowed</h3>
          <p className="text-gray-500">You have 5 books currently borrowed.</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Pending Returns</h3>
          <p className="text-gray-500">2 books are due this week.</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Notifications</h3>
          <p className="text-gray-500">No new notifications.</p>
        </div>
      </div>
    </div>
  );
}
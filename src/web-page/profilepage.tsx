import React from "react";

export default function Profile() {
  // Placeholder user data
  const name = "John Doe";
  const email = "john.doe@example.com";
  const booksRead = 12;
  const profilePictureUrl = "https://i.pravatar.cc/150?img=3";

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md text-center">
        {/* Profile Picture */}
        <div className="mb-6">
          <img
            src={profilePictureUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-600"
          />
        </div>

        {/* User Info */}
        <h1 className="text-2xl font-bold mb-2">{name}</h1>
        <p className="text-gray-600 mb-4">{email}</p>

        {/* Stats */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Books Read</h2>
          <p className="text-blue-600 text-xl font-bold">{booksRead}</p>
        </div>
      </div>
    </div>
  );
}
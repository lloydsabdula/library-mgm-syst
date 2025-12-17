import React from "react";

export default function BorrowHistory() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Borrow History</h1>
      <p className="text-gray-600 mb-4">This section will show all previously borrowed books.</p>

      <div className="bg-white rounded-xl shadow p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b px-4 py-2">Title</th>
              <th className="border-b px-4 py-2">Author</th>
              <th className="border-b px-4 py-2">Borrowed On</th>
              <th className="border-b px-4 py-2">Returned On</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-100">
              <td className="px-4 py-2">Book 1</td>
              <td className="px-4 py-2">Author 1</td>
              <td className="px-4 py-2">2023-01-10</td>
              <td className="px-4 py-2">2023-01-20</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

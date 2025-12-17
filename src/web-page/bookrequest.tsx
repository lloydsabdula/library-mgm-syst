import React, { useState } from "react";

interface BookRequestItem {
  id: number;
  title: string;
  author: string;
  reason: string;
}

export default function BookRequest() {
  const [requests, setRequests] = useState<BookRequestItem[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [reason, setReason] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      // Editing existing request
      setRequests((prev) =>
        prev.map((r) =>
          r.id === editingId ? { ...r, title, author, reason } : r
        )
      );
      setEditingId(null);
    } else {
      // Adding new request
      const newRequest: BookRequestItem = {
        id: Date.now(),
        title,
        author,
        reason,
      };
      setRequests((prev) => [...prev, newRequest]);
    }
    setTitle("");
    setAuthor("");
    setReason("");
  };

  const handleEdit = (request: BookRequestItem) => {
    setEditingId(request.id);
    setTitle(request.title);
    setAuthor(request.author);
    setReason(request.reason);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Book Request</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mb-6">
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          placeholder="Reason for request"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {editingId !== null ? "Update Request" : "Submit Request"}
        </button>
      </form>

      {/* Requests Table */}
      {requests.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b px-4 py-2">Title</th>
                <th className="border-b px-4 py-2">Author</th>
                <th className="border-b px-4 py-2">Reason</th>
                <th className="border-b px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2">{r.title}</td>
                  <td className="px-4 py-2">{r.author}</td>
                  <td className="px-4 py-2">{r.reason}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-sm"
                      onClick={() => handleEdit(r)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      onClick={() => handleDelete(r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";

const genres = ["All", "Fiction", "Non-Fiction", "Science", "History", "Biography", "Fantasy"];
const readingStatusOptions = ["Completed", "On Going", "Stopped Reading"];

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  dateReleased: string;
  isbn: string;
  dueDate: string; // YYYY-MM-DD
  status: string;
}

interface MyBooksProps {
  onReturn?: (book: Book) => void; // callback to send returned books to Borrow History
}

export default function MyBooks({ onReturn }: MyBooksProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const [books, setBooks] = useState<Book[]>([
    {
      id: 1,
      title: "Book Title 1",
      author: "Author 1",
      genre: "Fiction",
      dateReleased: "2023-01-01",
      isbn: "1234567890",
      dueDate: "2025-12-25",
      status: "On Going",
    },
    {
      id: 2,
      title: "Book Title 2",
      author: "Author 2",
      genre: "Science",
      dateReleased: "2022-05-12",
      isbn: "9876543210",
      dueDate: "2023-12-01",
      status: "Completed",
    },
  ]);

  const handleStatusChange = (bookId: number, newStatus: string) => {
    setBooks((prevBooks) =>
      prevBooks.map((b) => (b.id === bookId ? { ...b, status: newStatus } : b))
    );
  };

  const handleMarkReturned = (bookId: number) => {
    const bookToReturn = books.find((b) => b.id === bookId);
    if (!bookToReturn) return;

    const confirmReturn = window.confirm("Are you sure you want to mark this book as returned?");
    if (confirmReturn) {
      setBooks((prevBooks) => prevBooks.filter((b) => b.id !== bookId));
      if (onReturn) {
        // Send returned book to Borrow History
        const returnedBook = {
          ...bookToReturn,
          returnedDate: new Date().toISOString().split("T")[0], // add returned date
        };
        onReturn(returnedBook);
      }
    }
  };

  const statusColors = {
    Completed: "bg-green-200 text-green-800",
    "On Going": "bg-blue-200 text-blue-800",
    "Stopped Reading": "bg-red-200 text-red-800",
  };

  const isOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-6">My Books</h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-start md:items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="Type the author's name, date released, or the ISBN"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => console.log("Search:", searchTerm, selectedGenre)}
        >
          Search
        </button>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr>
              <th className="border-b px-4 py-2">Title</th>
              <th className="border-b px-4 py-2">Author</th>
              <th className="border-b px-4 py-2">Genre</th>
              <th className="border-b px-4 py-2">Date Released</th>
              <th className="border-b px-4 py-2">ISBN</th>
              <th className="border-b px-4 py-2">Due Date</th>
              <th className="border-b px-4 py-2">Status</th>
              <th className="border-b px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => {
              const overdue = isOverdue(book.dueDate);
              return (
                <tr key={book.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2">{book.title}</td>
                  <td className="px-4 py-2">{book.author}</td>
                  <td className="px-4 py-2">{book.genre}</td>
                  <td className="px-4 py-2">{book.dateReleased}</td>
                  <td className="px-4 py-2">{book.isbn}</td>
                  <td className={`px-4 py-2 font-semibold ${overdue ? "text-red-600" : ""}`}>
                    {book.dueDate}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-semibold ${
                          overdue ? "bg-red-200 text-red-800" : statusColors[book.status as keyof typeof statusColors]
                        }`}
                      >
                        {book.status}
                      </span>
                      <select
                        className="px-2 py-1 border rounded-lg text-sm"
                        value={book.status}
                        onChange={(e) => handleStatusChange(book.id, e.target.value)}
                      >
                        {readingStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      onClick={() => handleMarkReturned(book.id)}
                    >
                      Mark as Returned
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
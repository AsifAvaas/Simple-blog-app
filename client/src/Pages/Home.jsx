import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Home() {
  const [blogs, setBlogs] = useState([]); // Changed from {} to []
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]); // New state for search results

  // Fetch all blogs initially
  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getBlogs");
      if (response.data.success) {
        // Fixed condition
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle Search
  const handleSearch = async () => {
    if (!query.trim()) return; // Prevent empty searches

    try {
      const response = await axios.get(
        `http://localhost:8000/api/search?q=${query}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Home</h1>

        {/* Create Blog Button */}
        <button
          onClick={() => (window.location.href = "/blog")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Blog
        </button>

        {/* Search Input */}
        <div className="mt-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blogs"
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-green-500 text-white px-4 py-2 rounded ml-2"
          >
            Search
          </button>
        </div>

        {/* Show Search Results if any, otherwise show all blogs */}
        <div className="mt-4">
          {searchResults.length > 0
            ? searchResults.map((blog) => (
                <div key={blog._id} className="border p-4 mb-4">
                  <h2 className="text-xl font-bold">{blog.title}</h2>
                  <h3 className="text-gray-600">{blog.author}</h3>
                  <p>{blog.description}</p>
                </div>
              ))
            : blogs.map((blog) => (
                <div key={blog._id} className="border p-4 mb-4">
                  <h2 className="text-xl font-bold">{blog.title}</h2>
                  <h3 className="text-gray-600">{blog.author}</h3>
                  <p>{blog.description}</p>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

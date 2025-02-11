const express = require('express')
const router = express.Router()
const Blog = require('../Models/BlogModel')
const Fuse = require("fuse.js"); 


router.post("/createBlog", async (req, res) => {
    try {
        const { title, author, description } = req.body; // Include contentHash

        if (!title || !author || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required, including contentHash",
            });
        }

        // Create and save the new blog
        const blog = await new Blog({
            title,
            author,
            description,
        }).save();

        res.json({ success: true, message: "Blog Created Successfully", blog });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
});


router.get("/getBlogs", async (req, res) => {
    try {
        const blogs = await Blog.find()
        res.json({ success: true, blogs })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }
})



router.get("/search", async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ message: "Search query is required" });

        // Fetch all blogs from MongoDB
        const blogs = await Blog.find();

        // Convert all blog fields to lowercase for case-insensitive search
        const formattedBlogs = blogs.map(blog => ({
            ...blog.toObject(),  // Ensure we are working with plain objects
            title: blog.title.toLowerCase(),
            author: blog.author.toLowerCase(),
            description: blog.description.toLowerCase()
        }));

        // Configure Fuse.js for fuzzy searching
        const fuse = new Fuse(formattedBlogs, {
            keys: ["title", "author", "description"],
            threshold: 0.5, // Adjust for better matching (0 = strict, 1 = loose)
            findAllMatches: true, // Allow partial matches
            ignoreLocation: true, // Ignore exact word positioning
            includeScore: true, // Helps debug the search ranking
        });

        // Convert query to lowercase to match indexed text
        const results = fuse.search(query.toLowerCase()).map(result => result.item);

        res.json(results);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router
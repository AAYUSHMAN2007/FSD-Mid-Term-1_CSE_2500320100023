const express = require("express");

const app = express();

const PORT = 3000;


app.use(express.json());


let books = [
    {
        id: 101,
        title: "Java Programing",
        author: "Herbert Schildt",
        category: "Programing",
        totalCopies: 5,
        availableCopies: 5
    },
    {
        id: 102,
        title: "Atomic Habits",
        author: "James Clear",
        category: "Self Help",
        totalCopies: 3,
        availableCopies: 3
    }
];

// TASK 2: Add a new book
app.post("/api/books", (req, res) => {

    const { title, author, category, totalCopies } = req.body;

    const newBook = {
        id: books.length + 1,
        title,
        author,
        category,
        totalCopies,
        availableCopies: totalCopies
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});

// TASK 3: Get all books
app.get("/api/books", (req, res) => {

    if (books.length === 0) {
        return res.json({
            message: "No books available",
            books: []
        });
    }

    res.json(books);
});

// TASK 3: Get book by ID
app.get("/api/books/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(book);
});

// TASK 4: Update book
app.put("/api/books/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, category, totalCopies } = req.body;

    if (title) book.title = title;
    if (author) book.author = author;
    if (category) book.category = category;

    if (totalCopies) {
        book.totalCopies = totalCopies;
        book.availableCopies = totalCopies;
    }

    res.json({
        message: "Book updated successfully",
        book
    });
});

// TASK 5: Delete book
app.delete("/api/books/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.json({
        message: "Book deleted successfully"
    });
});

// TASK 6: Search books
app.get("/api/books/search", (req, res) => {

    const { title, author, category } = req.query;

    const result = books.filter(book =>
        (!title || book.title.toLowerCase().includes(title.toLowerCase())) &&
        (!author || book.author.toLowerCase().includes(author.toLowerCase())) &&
        (!category || book.category.toLowerCase().includes(category.toLowerCase()))
    );

    res.json(result);
});

// TASK 7: Issue book
app.post("/api/books/:id/issue", (req, res) => {

    const id = parseInt(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (book.availableCopies <= 0) {
        return res.status(400).json({
            message: "No copies available"
        });
    }

    book.availableCopies--;

    res.json({
        message: "Book issued successfully",
        book
    });
});

// TASK 7: Return book
app.post("/api/books/:id/return", (req, res) => {

    const id = parseInt(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (book.availableCopies >= book.totalCopies) {
        return res.status(400).json({
            message: "All copies are already available"
        });
    }

    book.availableCopies++;

    res.json({
        message: "Book returned successfully",
        book
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
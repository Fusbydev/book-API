const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());


app.get('/', (req, res) =>{
    res.send('Welcome to Bookstore API');
});
let books = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald"},
    { id: 2, title: "1984", author: "George Orwell" },
    { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee" }
    ];

app.get('/api/books/', (req, res)=>{

    res.json(books);
});

app.put('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex === -1) {
        return res.status(404).json({ error: "Book not found" });
    }

    // Update the book fields
    books[bookIndex] = {
        id: id, // Keep the same ID
        title: req.body.title || books[bookIndex].title,
        author: req.body.author || books[bookIndex].author,
    };

    // Save the updated books list back to the JSON file
    fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
    res.json(books[bookIndex]); // Send the updated book
});

app.get('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(book => book.id === id);
    
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
});

app.post('/api/books', (req, res)=>{
    const newBook = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author,
    };
    books.push(newBook);
    fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
    res.status(201).json(newBook);
});
// DELETE /api/books/:id
app.delete('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Book not found" });
    }

    // Remove the book from the array
    books.splice(index, 1);

    // Save the updated books list back to the JSON file
    try {
        fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error writing to books.json:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Bookstore API listening at http://localhost:${port}`);
});

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authServices from '../services/authServices'; 
import { Outlet } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        isbn: '',
        genre: '',
        publication_year: '',
        isAvailable: true,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editBookId, setEditBookId] = useState(null);

    useEffect(() => {
        
        const fetchBooks = async () => {
            try {
                const response = await authServices.viewAllBooks();
                setBooks(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load books');
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Update the existing book
                const response = await authServices.updateBook(editBookId, newBook);
                setBooks((prev) => prev.map(book => (book._id === editBookId ? response.data : book)));
                setIsEditing(false);
                setEditBookId(null);
                alert('Book updated successfully');
            } else {
                // Add a new book
                const response = await authServices.addBook(newBook);
                setBooks((prev) => [...prev, response.data]);
                alert('Book added successfully');
            }
            setNewBook({
                title: '',
                author: '',
                isbn: '',
                genre: '',
                publication_year: '',
                isAvailable: true,
            }); // Reset form
        } catch (error) {
            setError('Failed to add/update the book');
        }
    };

    const handleEditBook = (book) => {
        setNewBook({
            title: book.title || '',
            author: book.author || '',
            isbn: book.isbn || '',
            genre: book.genre || '',
            publication_year: book.publication_year || '',
            isAvailable: book.isAvailable || true,
        });
        setIsEditing(true);
        setEditBookId(book._id);
    };

    const handleDeleteBook = async (bookId) => {
        try {
            await authServices.deleteBook(bookId);
            setBooks((prev) => prev.filter(book => book._id !== bookId));
            alert('Book Deleted successfully');
        } catch (error) {
            setError('Failed to delete the book');
        }
    };

    const handleToggleAvailability = async (bookId, isAvailable) => {
        try {
            
            const response = await authServices.markAsAvailable(bookId, { isAvailable: !isAvailable });
            console.log("available", response.data.book.isAvailable);
            setBooks((prev) =>
                prev.map((book) =>
                    book._id === bookId ? { ...book, isAvailable: response.data.book.isAvailable } : book
                )
            );
        } catch (error) {
            setError('Failed to update book availability');
        }
    };

    const handleViewReviews = (bookId) => {
        navigate(`/reviews/${bookId}`); 
    };

    if (loading) return <p>Loading books...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="admin-dashboard">
            <Outlet /> 
            <h2 className='allbooks'>All Books</h2>
            <form onSubmit={handleAddBook}>
                <h3 className='allbooks'>{isEditing ? 'Edit Book' : 'Add New Book'}</h3>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={newBook.title}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="author"
                    placeholder="Author"
                    value={newBook.author}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="isbn"
                    placeholder="ISBN"
                    value={newBook.isbn}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="genre"
                    placeholder="Genre"
                    value={newBook.genre}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="publication_year"
                    placeholder="Publication Year"
                    value={newBook.publication_year}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit" className='addbook'>{isEditing ? 'Update Book' : 'Add Book'}</button>
            </form>
            <div className="book-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {books.length > 0 ? (
                    books.map((book) => (
                        <div key={book._id} className="card" style={{ width: '18rem' }}>
                            <img
                                src={'https://via.placeholder.com/150'}
                                className="card-img-top"
                            />
                            <div className="card-body">
                                <h5 className="card-title">{book.title || 'Untitled'}</h5>
                                <p className="card-text">Author: {book.author}</p>
                                <p className="card-text">Genre: {book.genre}</p>
                                <p className="card-text">Publication Year: {book.publication_year}</p>
                                <button
                                    type="button"
                                    className={`btn ${book.isAvailable ? 'btn-success' : 'btn-danger'}`}
                                    onClick={() => handleToggleAvailability(book._id, book.isAvailable)}
                                >
                                    {book.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleEditBook(book)}
                                    className="btn btn-warning"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteBook(book._id)}
                                    className="btn btn-danger"
                                >
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleViewReviews(book._id)}
                                    className="btn btn-info"
                                >
                                    View Reviews
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No books available</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
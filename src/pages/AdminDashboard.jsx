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
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 7;
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        ISBN: '',
        genre: '',
        subcategory: '',
        publication_year: '',
        isAvailable: true,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editBookId, setEditBookId] = useState(null);


    const [announcementMessage, setAnnouncementMessage] = useState('');
    const [announcementError, setAnnouncementError] = useState('');
    const [announcementSuccess, setAnnouncementSuccess] = useState('');

    const [filteredBooks, setFilteredBooks] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchOption, setSearchOption] = useState('title');
    const [isSearching, setIsSearching] = useState(false);

    const fetchBooks = async () => {
        try {
            const response = await authServices.viewAllBooks();
            const validBooks = response.data.filter(book => book && book._id);
            setBooks(validBooks);
            setFilteredBooks(validBooks);
            setLoading(false);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('No books found');
            } else {
                setError('Failed to load books');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);


    const totalPages = Math.ceil(filteredBooks.length / rowsPerPage);
    const indexOfLastBook = currentPage * rowsPerPage;
    const indexOfFirstBook = indexOfLastBook - rowsPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const handleSearch = () => {
        let filtered = books;

        if (searchOption === 'title') {
            filtered = books.filter(book =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else if (searchOption === 'author') {
            filtered = books.filter(book =>
                book.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else if (searchOption === 'all') {
            filtered = books.filter(book =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredBooks(filtered);
        setSearchTerm('');
        setCurrentPage(1);
        setIsSearching(true);
    };

    const handleBackButtonClick = () => {
        setIsSearching(false);
        setFilteredBooks(books);
        setSearchTerm('');
        setCurrentPage(1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddBook = async (e) => {
        e.preventDefault();

        if (!newBook.ISBN) {
            setError('ISBN is required');
            return;
        }

        try {
            if (isEditing) {
                const response = await authServices.updateBook(editBookId, newBook);

                setBooks((prev) => prev.map(book => (book._id === editBookId ? response.data : book)));
                setFilteredBooks((prev) => prev.map(book => (book._id === editBookId ? response.data : book)));
                setIsEditing(false);
                setEditBookId(null);
                alert('Book updated successfully');
            } else {
                const response = await authServices.addBook(newBook);

                setBooks((prev) => [...prev, response.data]);
                setFilteredBooks((prev) => [...prev, response.data]);
                alert('Book added successfully');
            }
            setNewBook({
                title: '',
                author: '',
                ISBN: '',
                genre: '',
                subcategory: '',
                publication_year: '',
                isAvailable: true,
            });
            fetchBooks();
            setCurrentPage(totalPages);
            setIsEditing(false);
            setEditBookId(null);
        } catch (error) {
            console.error('Error while adding/updating the book:', error);
            setError('Failed to add/update the book');
        }
    };


    const handleEditBook = (book) => {
        setNewBook({
            title: book.title || '',
            author: book.author || '',
            ISBN: book.ISBN || '',
            genre: book.genre || '',
            subcategory: book.subcategory || '',
            publication_year: book.publication_year || '',
            isAvailable: book.isAvailable || true,
        });
        fetchBooks();
        setIsEditing(true);
        setEditBookId(book._id);
    };

    const handleDeleteBook = async (bookId) => {
        try {
            await authServices.deleteBook(bookId);
            setBooks((prev) => prev.filter(book => book._id !== bookId));
            setFilteredBooks((prev) => prev.filter(book => book._id !== bookId));
            alert('Book Deleted successfully');
            fetchBooks();
        } catch (error) {
            setError('Failed to delete the book');
        }
    };

    const handleViewBook = (bookId) => {
        navigate(`/books/${bookId}`);
    };

    const handleAnnouncementSubmit = async (e) => {
        e.preventDefault();
        setAnnouncementError('');
        setAnnouncementSuccess('');

        if (!announcementMessage) {
            setAnnouncementError('Announcement message cannot be empty');
            return;
        }

        try {
            await authServices.sendAnnouncement({ message: announcementMessage });
            setAnnouncementSuccess('Announcement sent successfully!');
            setAnnouncementMessage('');
        } catch (error) {
            console.error('Error sending announcement:', error);
            setAnnouncementError('Failed to send announcement');
        }
    };

    if (loading) return <p>Loading books...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="admin-dashboard">
            <Outlet />

            <h3 className="allbooks">Send Announcement</h3>
            <form onSubmit={handleAnnouncementSubmit}>
                <textarea
                    value={announcementMessage}
                    onChange={(e) => setAnnouncementMessage(e.target.value)}
                    placeholder="Write your announcement here"
                    required
                />
                <button type="submit" className="send-announcement">Send Announcement</button>
            </form>

            {announcementError && <p className="error-message">{announcementError}</p>}
            {announcementSuccess && <p className="success-message">{announcementSuccess}</p>}

            <form onSubmit={handleAddBook}>
                <h3 className='allbooks-addbooks'>{isEditing ? 'Edit Book' : 'Add New Book'}</h3>
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
                    name="ISBN"
                    placeholder="ISBN"
                    value={newBook.ISBN}
                    onChange={handleInputChange}
                    required
                />
                <select
                    name="genre"
                    value={newBook.genre}
                    className='genre'
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Genre</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Education">Education</option>
                </select>
                <input
                    type="text"
                    name="subcategory"
                    placeholder="Subcategory"
                    value={newBook.subcategory}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="publication_year"
                    placeholder="Publication Year"
                    value={newBook.publication_year}
                    className='publication'
                    onChange={handleInputChange}
                    required
                />
                <button type="submit" className='addbook'>{isEditing ? 'Update Book' : 'Add Book'}</button>
            </form>
            <div className="search-section">
                <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)} className="search-select">
                    <option value="all">Search by All</option>
                    <option value="title">Search by Title</option>
                    <option value="author">Search by Author</option>
                </select>
                <input
                    type="text"
                    placeholder="Search books"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-btn">Search</button>


                {isSearching && (
                    <button onClick={handleBackButtonClick} className="btn btn-link">Back to Dashboard</button>
                )}
            </div>
            <h3 className="allbooks">Book Management</h3>
            <table className="book-table">
                <thead>
                    <tr><th>Title</th><th>Availability</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {currentBooks.length > 0 ? (
                        currentBooks.filter(book => book && book._id).map((book) => (
                            <tr key={book._id}>
                                <td>{book?.title || 'Unknown Title'}</td><td>{book?.isAvailable ? 'Available' : 'Unavailable'}</td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => handleEditBook(book)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDeleteBook(book._id)}>Delete</button>
                                    <button className="btn btn-link" onClick={() => handleViewBook(book._id)}>View Book</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="3">No books available</td></tr>
                    )}
                </tbody>
            </table>


            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={`page-btn ${i + 1 === currentPage ? 'active' : ''}`}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

        </div >
    );
};

export default AdminDashboard;

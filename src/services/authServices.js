import instance from "./instance";

const authServices = {
    viewAllBooks: async () => {
        return await instance.get('/books');
    },
    addBook: async (bookData) => {
        const response = await instance.post('/books', bookData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    },
    updateBook: async (id, bookData) => {
        const response = await instance.patch(`/books/${id}`, bookData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    },
    deleteBook: async (bookId) => {
        const response = await instance.delete(`/books/${bookId}`);
        return response.data;
    },
    markAsAvailable: (bookId, isAvailable) => {
        return instance.patch(`/books/available/${bookId}`, isAvailable);
    },
    getAllBooks: async () => {
        return await instance.get('/books');
    },
    userRegister: async (data) => {
        return await instance.post('/user/register', data);
    },
    userlogin: async (data) => {
        const response = await instance.post('/user/login', data);
        console.log("user auth :", response.data.token);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        if (response.data.userId) {
            localStorage.setItem('userId', response.data.userId);
        }
        return response;
    },
    adminRegister: async (data) => {
        return await instance.post('/admin/register', data);
    },
    adminlogin: async (data) => {
        const response = await instance.post('/admin/login', data);
        console.log("admin auth :", response.data.token);
        if (response.data.token) {

            document.cookie = `token=${response.data.token}; path=/; SameSite=Lax; secure;`;
        }
        if (response.data.adminId) {
            localStorage.setItem('adminId', response.data.adminId);
        }
        return response;
    },
    getAdminProfile: async () => {
        // Retrieve the token from cookies
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        const tokenValue = token ? token.split('=')[1] : null;

        if (!tokenValue) {
            throw new Error("No token found");
        }
        return await instance.get('/admin/profile', {
            headers: {
                Authorization: `Bearer ${tokenValue}`
            }
        });
    },
    me: async () => {
        // Retrieve the token from cookies
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        const tokenValue = token ? token.split('=')[1] : null;

        // Check if the token is found
        if (!tokenValue) {
            throw new Error("No token found");
        }

        // Make the request with the token
        return await instance.get('/admin/me', {
            headers: {
                Authorization: `Bearer ${tokenValue}`
            }
        });
    },
    /*me: async () => {
        const token = localStorage.getItem('token');
        return await instance.get('/admin/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },*/
    getUserProfile: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("No token found");
        }
        return await instance.get('/user/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
    borrowBook: async (bookId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("No token found");
        }
        return await instance.post(`/books/borrow/${bookId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
    getBorrowedBooks: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("No token found");
        }
        return await instance.get('/books/borrowed', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
    reserveBook: async (bookId) => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        return await instance.post(`/books/reserve/${bookId}`, { userId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
    },
    returnBook: async (bookId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("No token found");
        }
        return await instance.post(`/books/return/${bookId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
    searchBooks: async (queryParams) => {
        const queryString = new URLSearchParams(queryParams).toString();
        return await instance.get(`/books/search?${queryString}`);
    },
    submitReview: async (bookId, reviewData) => {
        return await instance.post(`/books/${bookId}/review`, reviewData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
    },
    getReviews: async (bookId) => {
        return await instance.get(`/books/${bookId}/reviews`);
    },
    deleteReview: async (bookId, reviewId) => {
        return instance.delete(`/admin/delete-review/${bookId}/${reviewId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
    },
    forgotpassword: async (data) => {
        return await instance.post('user/forgot-password', data);
    },
    enterOtp: async (otp) => {
        return await instance.post('user/verify-otp', { otp });
    },
    resetpassword: async (data) => {
        return await instance.post('user/reset-password', data);
    },
    getInventoryReport: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("No token found");
        }
        return await instance.get('/reports/inventory', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
    getBorrowingStatistics: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("No token found");
        }
        return await instance.get('/reports/borrowing-statistics', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
    getUserActivityReport: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("No token found");
        }
        return await instance.get('/reports/user-activity', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },

};

export default authServices;
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomeNav from './wrappers/HomeNav';
import UserDashboardNav from './wrappers/UserDashboardNav';
import AdminDashboardNav from './wrappers/AdminDashboardNav';
import Home from './pages/Home';
import UserRegister from "./components/UserRegister";
import UserLogin from "./components/UserLogin";
import UserDashboard from './pages/UserDashboard';
import SearchResults from './pages/SearchResults';
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import SubmitReview from './pages/SubmitReview';
import Reviews from './pages/Reviews';
import BookReviews from './pages/BookReviews';
import ForgotPassword from './components/ForgotPassword';
import EnterOtp from "./components/EnterOtp";
import ResetPassword from "./components/ResetPassword";
import MyBooks from './pages/MyBooks';
import Reports from './pages/Reports';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeNav />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'search-results',
        element: <SearchResults />
      },
      {
        path: 'user-register',
        element: <UserRegister />
      },
      {
        path: 'user-login',
        element: <UserLogin />
      },
      {
        path: 'admin-register',
        element: <AdminRegister />
      },
      {
        path: 'admin-login',
        element: <AdminLogin />
      },
    ]
  },
  {
    path: '/books/:bookId/reviews',
    element: <Reviews />,
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "enter-otp",
    element: <EnterOtp />
  },
  {
    path: "reset-password",
    element: <ResetPassword />
  },
  {
    path: 'dashboard',
    element: <UserDashboard />, 
    children: [
      {
        path: '',
        element: <UserDashboardNav />,
      },
    ]
  },
  {
    path: 'my-books',
    element: <MyBooks />,
  },
  {
    path: 'submit-review/:bookId',
    element: <SubmitReview />,
  },
  {
    path: '/admin-dashboard',
    element: <AdminDashboard />,
    children: [
      {
        path: '',
        element: <AdminDashboardNav />, 
      },
      {
        path: 'reports',
        element: <Reports />,
      },
    ]
  },
  {
    path: '/reviews/:bookId',
    element: <BookReviews />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
}

export default App;

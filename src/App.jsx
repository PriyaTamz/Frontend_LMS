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
import ForgotPassword from './components/ForgotPassword';
import EnterOtp from "./components/EnterOtp";
import ResetPassword from "./components/ResetPassword";
import Reports from './pages/Reports';
import MyProfile from './pages/MyProfile';
import Preview from './pages/Preview';
import AdminViewBooks from './pages/AdminViewBooks';
import FictionBooks from './pages/FictionBooks';
import NonFictionBooks from './pages/NonFictionBooks';
import EducationBooks from './pages/EducationBooks';
import ViewBookUser from './pages/ViewBookUser';

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
        path: 'fiction-books',
        element: <FictionBooks />,
      },
      {
        path: 'non-fiction-books',
        element: <NonFictionBooks />,
      },
      {
        path: 'education-books',
        element: <EducationBooks />,
      },
    ]
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
  {
    path: '/books/details/:bookId',
    element: <Preview />,
  },
  {
    path: '/books/:bookId',
    element: <AdminViewBooks />,
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
    path: '/dashboard',
    element: <UserDashboard />,
    children: [
      {
        path: '',
        element: <UserDashboardNav />,
      },
    ]
  },
  {
    path: "/books/auth/details/:bookId",
    element: <ViewBookUser />,
  },
  {
    path: 'my-profile',
    element: <MyProfile />,
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
]);

const App = () => {
  return <RouterProvider router={router} />;
}

export default App;

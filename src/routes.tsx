import type { ReactNode } from 'react';
import Home from './pages/Home';
import Medicines from './pages/Medicines';
import MedicineDetail from './pages/MedicineDetail';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Orders from './pages/Orders';
import PaymentSuccess from './pages/PaymentSuccess';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import HealthBlog from './pages/HealthBlog';
import BlogArticle from './pages/BlogArticle';
import Reminders from './pages/Reminders';
import Wishlist from './pages/Wishlist';
import HealthCalculator from './pages/HealthCalculator';
import MedicineComparison from './pages/MedicineComparison';
import SymptomChecker from './pages/SymptomChecker';
import InteractionChecker from './pages/InteractionChecker';
import Prescriptions from './pages/Prescriptions';
import Substitutes from './pages/Substitutes';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMedicines from './pages/admin/AdminMedicines';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import AdminBlog from './pages/admin/AdminBlog';
import AdminSymptoms from './pages/admin/AdminSymptoms';
import AdminInteractions from './pages/admin/AdminInteractions';
import AdminSubstitutes from './pages/admin/AdminSubstitutes';
import AdminReviews from './pages/admin/AdminReviews';
import AdminPrescriptions from './pages/admin/AdminPrescriptions';
import NotFound from './pages/NotFound';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />,
    visible: false
  },
  {
    name: 'Medicines',
    path: '/medicines',
    element: <Medicines />,
    visible: false
  },
  {
    name: 'Medicine Detail',
    path: '/medicines/:id',
    element: <MedicineDetail />,
    visible: false
  },
  {
    name: 'Cart',
    path: '/cart',
    element: <Cart />,
    visible: false
  },
  {
    name: 'Payment',
    path: '/payment',
    element: <Payment />,
    visible: false
  },
  {
    name: 'Orders',
    path: '/orders',
    element: <Orders />,
    visible: false
  },
  {
    name: 'Payment Success',
    path: '/payment-success',
    element: <PaymentSuccess />,
    visible: false
  },
  {
    name: 'Contact',
    path: '/contact',
    element: <Contact />,
    visible: false
  },
  {
    name: 'Profile',
    path: '/profile',
    element: <Profile />,
    visible: false
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false
  },
  {
    name: 'Register',
    path: '/register',
    element: <Register />,
    visible: false
  },
  {
    name: 'Health Blog',
    path: '/blog',
    element: <HealthBlog />,
    visible: false
  },
  {
    name: 'Blog Article',
    path: '/blog/:id',
    element: <BlogArticle />,
    visible: false
  },
  {
    name: 'Medicine Reminders',
    path: '/reminders',
    element: <Reminders />,
    visible: false
  },
  {
    name: 'Wishlist',
    path: '/wishlist',
    element: <Wishlist />,
    visible: false
  },
  {
    name: 'Health Calculator',
    path: '/calculator',
    element: <HealthCalculator />,
    visible: false
  },
  {
    name: 'Medicine Comparison',
    path: '/compare',
    element: <MedicineComparison />,
    visible: false
  },
  {
    name: 'Symptom Checker',
    path: '/symptom-checker',
    element: <SymptomChecker />,
    visible: false
  },
  {
    name: 'Interaction Checker',
    path: '/interaction-checker',
    element: <InteractionChecker />,
    visible: false
  },
  {
    name: 'Prescriptions',
    path: '/prescriptions',
    element: <Prescriptions />,
    visible: false
  },
  {
    name: 'Medicine Substitutes',
    path: '/substitutes',
    element: <Substitutes />,
    visible: false
  },
  {
    name: 'Admin Dashboard',
    path: '/admin',
    element: <AdminDashboard />,
    visible: false
  },
  {
    name: 'Admin Medicines',
    path: '/admin/medicines',
    element: <AdminMedicines />,
    visible: false
  },
  {
    name: 'Admin Orders',
    path: '/admin/orders',
    element: <AdminOrders />,
    visible: false
  },
  {
    name: 'Admin Users',
    path: '/admin/users',
    element: <AdminUsers />,
    visible: false
  },
  {
    name: 'Admin Analytics',
    path: '/admin/analytics',
    element: <AdminAnalytics />,
    visible: false
  },
  {
    name: 'Admin Settings',
    path: '/admin/settings',
    element: <AdminSettings />,
    visible: false
  },
  {
    name: 'Admin Blog',
    path: '/admin/blog',
    element: <AdminBlog />,
    visible: false
  },
  {
    name: 'Admin Symptoms',
    path: '/admin/symptoms',
    element: <AdminSymptoms />,
    visible: false
  },
  {
    name: 'Admin Interactions',
    path: '/admin/interactions',
    element: <AdminInteractions />,
    visible: false
  },
  {
    name: 'Admin Substitutes',
    path: '/admin/substitutes',
    element: <AdminSubstitutes />,
    visible: false
  },
  {
    name: 'Admin Reviews',
    path: '/admin/reviews',
    element: <AdminReviews />,
    visible: false
  },
  {
    name: 'Admin Prescriptions',
    path: '/admin/prescriptions',
    element: <AdminPrescriptions />,
    visible: false
  },
  {
    name: 'Not Found',
    path: '*',
    element: <NotFound />,
    visible: false
  }
];

export default routes;

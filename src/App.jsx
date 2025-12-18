import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Books from './pages/Books';
import AddLibrary from './pages/AddLibrary';
import Profile from './pages/Profile';
import Libraries from './pages/Libraries';
import PrivateRoute from './components/PrivateRoute';
import useAuthStore from './store/useAuthStore';
import BookDetail from './pages/BookDetail';
import LibraryDetail from './pages/LibraryDetail';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const App = () => {
  const { isAuth } = useAuthStore;
  return (
    <Routes>
      <Route path="/login" element={isAuth ? <Navigate to="/profile" replace /> : <LoginPage />} />
      <Route path="/" element={<Navigate to={'/login'} />} />
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/books" element={<Books />} />
          <Route path="/bookDetail/:id" element={<BookDetail />} />
          <Route path="/add-library" element={<AddLibrary />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/libraries" element={<Libraries />} />
          <Route path="/libraryDetail/:id" element={<LibraryDetail />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;

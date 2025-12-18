import { useQuery } from '@tanstack/react-query';
import LanguageSelect from './Language-select/LanguageSelect';
import API from './../api/API';
import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { Link } from 'react-router-dom';
const Header = () => {
  const { data, error } = useQuery({
    queryKey: ['profile-header'],
    queryFn: () => API.get('/auth/admin/profile/').then((res) => res.data),
  });
  useEffect(() => {
    if (data) {
      notifications.show({
        withCloseButton: true,
        autoClose: 3000,
        title: 'Muvaffaqiyatli yuklandi',
        message: '',
        color: 'green',
      });
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      notifications.show({
        withCloseButton: true,
        autoClose: 3000,
        title: error?.message || 'Xatolik mavjud',
        message: '',
        color: 'red',
      });
    }
  }, [error]);
  return (
    <header>
      <div className="header-left">
        <h2 className="logo-title">Ezma Admin</h2>
        <button className="burger-icon">
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>
      <div className="header-right">
        <LanguageSelect />
        <Link to="/profile">
          <button className="login-btn">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 496 512"
              className="avatar"
              height="30px"
              width="30px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M248 104c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 144c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm0-240C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-49.7 0-95.1-18.3-130.1-48.4 14.9-23 40.4-38.6 69.6-39.5 20.8 6.4 40.6 9.6 60.5 9.6s39.7-3.1 60.5-9.6c29.2 1 54.7 16.5 69.6 39.5-35 30.1-80.4 48.4-130.1 48.4zm162.7-84.1c-24.4-31.4-62.1-51.9-105.1-51.9-10.2 0-26 9.6-57.6 9.6-31.5 0-47.4-9.6-57.6-9.6-42.9 0-80.6 20.5-105.1 51.9C61.9 339.2 48 299.2 48 256c0-110.3 89.7-200 200-200s200 89.7 200 200c0 43.2-13.9 83.2-37.3 115.9z"></path>
            </svg>{' '}
            <h3>{data?.name}</h3>
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;

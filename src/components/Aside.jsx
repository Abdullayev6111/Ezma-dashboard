import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import API from './../api/API';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../store/useAuthStore';
import { useTranslation } from 'react-i18next';

const Aside = () => {
  const { t } = useTranslation();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, error } = useQuery({
    queryKey: ['profile-aside'],
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

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout/');
    } catch (err) {
      console.warn('Backend logout muvaffaqiyatsiz', err.message);
    } finally {
      logout();
      queryClient.clear();

      navigate('/login', { replace: true });
    }
  };

  return (
    <aside>
      <div className="aside-top">
        <Link className="aside-profile" to="/profile">
          <button className="login-btn">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 496 512"
              className="avatar"
              height="22px"
              width="22px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M248 104c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm0 144c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm0-240C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-49.7 0-95.1-18.3-130.1-48.4 14.9-23 40.4-38.6 69.6-39.5 20.8 6.4 40.6 9.6 60.5 9.6s39.7-3.1 60.5-9.6c29.2 1 54.7 16.5 69.6 39.5-35 30.1-80.4 48.4-130.1 48.4zm162.7-84.1c-24.4-31.4-62.1-51.9-105.1-51.9-10.2 0-26 9.6-57.6 9.6-31.5 0-47.4-9.6-57.6-9.6-42.9 0-80.6 20.5-105.1 51.9C61.9 339.2 48 299.2 48 256c0-110.3 89.7-200 200-200s200 89.7 200 200c0 43.2-13.9 83.2-37.3 115.9z"></path>
            </svg>{' '}
            <h3>{data?.name}</h3>
          </button>
        </Link>
        <NavLink to="/libraries">
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            height="22px"
            width="22px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="8" height="18" x="3" y="3" rx="1"></rect>
            <path d="M7 3v18"></path>
            <path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"></path>
          </svg>{' '}
          {t('aside.libraries')}
        </NavLink>
        <NavLink to="/books">
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            height="22px"
            width="22px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
          </svg>{' '}
          {t('aside.books')}
        </NavLink>
        <NavLink to="/add-library">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="22px"
            width="22px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"></path>
          </svg>{' '}
          {t('aside.addLibrary')}
        </NavLink>
      </div>
      <button onClick={() => handleLogout()} className="exit-btn">
        <i className="fa-solid fa-right-from-bracket"></i> {t('aside.logoutBtn')}
      </button>
    </aside>
  );
};

export default Aside;

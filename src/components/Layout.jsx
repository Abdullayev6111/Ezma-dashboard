import { Outlet } from 'react-router-dom';
import Header from './Header';
import Aside from './Aside';

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Aside />
    </>
  );
};

export default Layout;

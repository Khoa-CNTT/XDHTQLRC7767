import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import Header from "../components/Header";
import HeaderNoBanner from "../components/HeaderNoBanner";
import Footer from "../components/Footer";

const UserLayout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      {isHomePage ? <Header /> : <HeaderNoBanner />}
      <Outlet />
      <Footer />
    </>
  );
};

export default UserLayout;

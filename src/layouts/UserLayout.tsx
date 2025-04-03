import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import HeaderNoBanner from "../components/HeaderNoBanner";
import Footer from "../components/Footer";

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      {isHomePage ? <Header /> : <HeaderNoBanner />}
      {children}
      <Footer />
    </>
  );
};

export default UserLayout;

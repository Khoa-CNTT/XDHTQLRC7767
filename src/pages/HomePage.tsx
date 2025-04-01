import React from "react";
import Header from "../components/Header";
import MovieList from "../components/MovieList";
import Discount from "../components/Discount";
import Footer from "../components/Footer";

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <MovieList />
      <Discount />
      <Footer />
    </>
  );
};

export default HomePage; 
import React from "react";
import MovieList from "../../components/MovieList";
import Discount from "../../components/Discount";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const HomePage: React.FC = () => {
  useDocumentTitle("Trang chủ");

  return (
    <>
      <MovieList />
      <Discount />
    </>
  );
};

export default HomePage;

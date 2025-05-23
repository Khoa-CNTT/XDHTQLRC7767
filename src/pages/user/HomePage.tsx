import React from "react";
import MovieList from "../../components/MovieList";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const HomePage: React.FC = () => {
  useDocumentTitle("Trang chủ");

  return (
    <>
      <MovieList />
    </>
  );
};

export default HomePage;

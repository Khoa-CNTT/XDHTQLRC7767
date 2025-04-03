import React from "react";
import MovieList from "../../components/MovieList";
import Discount from "../../components/Discount";

const HomePage: React.FC = () => {
  return (
    <>
      <MovieList />
      <Discount />
    </>
  );
};

export default HomePage;

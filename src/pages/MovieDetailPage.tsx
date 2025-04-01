import React from "react";
import HeaderNoSlider from "../components/HeaderNoSlider";
import Footer from "../components/Footer";
import MovieDetail from "../components/MovieDetail";

const MovieDetailPage: React.FC = () => {
  return (
    <>
      <HeaderNoSlider />
      <MovieDetail />
      <Footer />
    </>
  );
};

export default MovieDetailPage;

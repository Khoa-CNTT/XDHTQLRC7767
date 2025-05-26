import React, { useEffect } from "react";
import MovieList from "../../components/MovieList";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const HomePage: React.FC = () => {
  useDocumentTitle("Trang chủ");

  useEffect(() => {
    // Check and clear any booking data from localStorage when home page loads
    if (localStorage.getItem("bookingData")) {
      localStorage.removeItem("bookingData");
    }
    if (localStorage.getItem("direct_booking_data")) {
      localStorage.removeItem("direct_booking_data");
    }
    if (localStorage.getItem("showtime_booking_data")) {
      localStorage.removeItem("showtime_booking_data");
    }
  }, []);

  return (
    <>
      <MovieList />
    </>
  );
};

export default HomePage;

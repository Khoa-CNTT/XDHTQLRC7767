import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Button, Empty } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "../utils/animations";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  getNowShowingMoviesRequest,
  getUpcomingMoviesRequest,
} from "../redux/slices/movieSlice";
import HomePageSkeleton from "./home/HomePageSkeleton";

// Styled Components
const MovieListContainer = styled.div`
  width: 100%;
  background: linear-gradient(to bottom, #1a1a2e, #16213e);
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MovieListContent = styled.div`
  width: 80%;
  max-width: 1200px;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
`;

const TabButton = styled(Button)<{ $active?: boolean }>`
  background-color: ${(props) =>
    props.$active ? "#00bfff" : "transparent"} !important;
  color: white !important;
  border: 2px solid ${(props) => (props.$active ? "#00bfff" : "white")} !important;
  border-radius: 25px !important;
  font-weight: bold !important;
  padding: 0 30px !important;
  height: 40px !important;
  font-size: 16px !important;

  &:hover {
    background-color: #00bfff !important;
    border-color: #00bfff !important;
  }
`;

const MoviesSlider = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const MoviesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  min-height: 500px; /* Add a minimum height to prevent layout shifts */

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const MovieCard = styled.div`
  flex: 0 0 calc(25% - 15px);
  display: flex;
  flex-direction: column;
  background-color: transparent;
`;

const MoviePoster = styled.div`
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 10px;
  position: relative;
  background-color: #000;

  &:hover img {
    transform: scale(1.05);
  }

  &:hover .overlay {
    opacity: 1;
  }
`;

const PosterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
  background-color: #000;
`;

const PosterOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  gap: 10px;
`;

const MovieTitle = styled.h3`
  height: 60px;
  color: white;
  text-align: center;
  font-weight: bold;
  margin: 0;
  font-size: 18px;
`;

const MovieInfo = styled.div`
  color: white;
  text-align: center;
  margin-bottom: 10px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
`;

const ActionButton = styled(Button)`
  background-color: #00bfff !important;
  color: white !important;
  border: none !important;
  border-radius: 20px !important;
  font-weight: bold !important;

  &:hover {
    background-color: #0099cc !important;
    transform: translateY(-2px);
  }
`;

const SliderButton = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #00bfff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  border-radius: 50%;
  z-index: 10;
  transition: all 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
    transform: translateY(-50%) scale(1.1);
  }
`;

const LeftSlideButton = styled(SliderButton)`
  left: -20px;
`;

const RightSlideButton = styled(SliderButton)`
  right: -20px;
`;

// MovieRating component used for future star rating display
// const MovieRating = styled.div`
//   position: absolute;
//   top: 10px;
//   right: 10px;
//   background-color: rgba(0, 0, 0, 0.5);
//   color: white;
//   padding: 2px 5px;
//   border-radius: 5px;
// `;

// Thêm styled component cho nút Chi tiết phim
const DetailButton = styled(Button)`
  background-color: #00bfff;
  color: white;
  border: none;
  border-radius: 20px;
  margin-right: 8px;

  &:hover {
    background-color: #0099cc;
    color: white;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  width: 100%;
`;

const MovieList: React.FC = () => {
  const [activeTab, setActiveTab] = useState("now-showing");
  const [currentPage, setCurrentPage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const moviesPerPage = 4; // Number of movies to display per page
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right"
  );

  const dispatch = useDispatch();
  const { nowShowingMovies, upcomingMovies } = useSelector(
    (state: RootState) => state.movie
  );

  useEffect(() => {
    dispatch(getNowShowingMoviesRequest());
    dispatch(getUpcomingMoviesRequest());
  }, [dispatch]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Get current movies based on active tab and pagination
  const getCurrentMovies = () => {
    const movies =
      activeTab === "now-showing" ? nowShowingMovies.data : upcomingMovies.data;

    const start = currentPage * moviesPerPage;
    const end = start + moviesPerPage;
    return movies.slice(start, end);
  };

  // Calculate total pages
  const totalMovies =
    activeTab === "now-showing"
      ? nowShowingMovies.data.length
      : upcomingMovies.data.length;

  const totalPages = Math.ceil(totalMovies / moviesPerPage);

  // Check loading status
  const isLoading =
    activeTab === "now-showing"
      ? nowShowingMovies.loading
      : upcomingMovies.loading;

  // Check if the data is empty after loading
  const isDataEmpty =
    !isLoading &&
    (activeTab === "now-showing"
      ? nowShowingMovies.data.length === 0
      : upcomingMovies.data.length === 0);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(0);
    setSlideDirection("right");
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setSlideDirection("left");
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setSlideDirection("right");
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Check if navigation buttons should be visible
  const showPrevButton = currentPage > 0;
  const showNextButton = currentPage < totalPages - 1;

  // Create custom animation variants for horizontal sliding with slower timing
  const slideAnimation = {
    hidden: (direction: "left" | "right") => ({
      x: direction === "left" ? 300 : -300,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80, // Reduced from 120 for slower movement
        damping: 25, // Increased from 20 for more smoothness
        mass: 1.2, // Increased from 1 for more weight/slowness
        duration: 0.8, // Explicitly set longer duration
      },
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "left" ? -300 : 300,
      opacity: 0,
      transition: {
        duration: 0.4, // Increased from 0.2 for slower exit
      },
    }),
  };

  // Actual render logic
  const renderMovieContent = () => {
    if (isLoading) {
      return <HomePageSkeleton />;
    }

    if (isDataEmpty) {
      return (
        <LoadingContainer>
          <Empty
            description={
              <span style={{ color: "white" }}>Không có phim nào</span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </LoadingContainer>
      );
    }

    return (
      <motion.div
        key={currentPage}
        variants={staggerContainer}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <MoviesContainer>
          {getCurrentMovies().map((movie, index) => (
            <motion.div
              key={movie.id}
              custom={slideDirection}
              variants={slideAnimation}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{
                delay: index * 0.08,
                duration: 0.6,
              }}
            >
              <MovieCard>
                <MoviePoster>
                  <PosterImage src={movie?.image} alt={movie.title} />
                  <PosterOverlay className="overlay">
                    <Link to={`/movie/${movie.id}`}>
                      <DetailButton icon={<InfoCircleOutlined />}>
                        CHI TIẾT
                      </DetailButton>
                    </Link>
                  </PosterOverlay>
                </MoviePoster>
                <MovieTitle>{movie.title}</MovieTitle>
                <MovieInfo>{movie.duration}</MovieInfo>
                <MovieInfo>
                  {activeTab === "now-showing"
                    ? "ĐANG CHIẾU"
                    : `KHỞI CHIẾU: ${new Date(
                        movie.releaseDate
                      ).toLocaleDateString("vi-VN")}`}
                </MovieInfo>
                <ButtonsContainer>
                  <Link to={`/movie/${movie.id}`}>
                    <DetailButton icon={<InfoCircleOutlined />}>
                      CHI TIẾT
                    </DetailButton>
                  </Link>
                  <Link to={`/booking/${movie.id}`}>
                    <ActionButton>ĐẶT VÉ</ActionButton>
                  </Link>
                </ButtonsContainer>
              </MovieCard>
            </motion.div>
          ))}
        </MoviesContainer>
      </motion.div>
    );
  };

  return (
    <MovieListContainer ref={sectionRef}>
      <MovieListContent>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          transition={{ delay: 0.2 }}
        >
          <TabsContainer>
            <TabButton
              $active={activeTab === "now-showing"}
              onClick={() => handleTabChange("now-showing")}
            >
              PHIM ĐANG CHIẾU
            </TabButton>
            <TabButton
              $active={activeTab === "coming-soon"}
              onClick={() => handleTabChange("coming-soon")}
            >
              PHIM SẮP CHIẾU
            </TabButton>
          </TabsContainer>
        </motion.div>

        <MoviesSlider>
          {showPrevButton && !isDataEmpty && (
            <LeftSlideButton onClick={prevPage}>
              <LeftOutlined />
            </LeftSlideButton>
          )}

          {renderMovieContent()}

          {showNextButton && !isLoading && !isDataEmpty && (
            <RightSlideButton onClick={nextPage}>
              <RightOutlined />
            </RightSlideButton>
          )}
        </MoviesSlider>

        {/* Pagination indicator */}
        {!isLoading && totalMovies > 0 && (
          <div
            style={{ textAlign: "center", marginTop: "20px", color: "white" }}
          >
            Trang {currentPage + 1} / {totalPages}
          </div>
        )}
      </MovieListContent>
    </MovieListContainer>
  );
};

export default MovieList;

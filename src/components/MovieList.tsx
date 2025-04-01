import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn, slideInUp } from "../utils/animations";

// Styled Components
const MovieListContainer = styled.div`
  width: 100%;
  background: linear-gradient(to bottom, #22461f, #6391fa);
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
    props.$active ? "#E0712C" : "transparent"} !important;
  color: white !important;
  border: 2px solid ${(props) => (props.$active ? "#E0712C" : "white")} !important;
  border-radius: 25px !important;
  font-weight: bold !important;
  padding: 0 30px !important;
  height: 40px !important;
  font-size: 16px !important;

  &:hover {
    background-color: #e0712c !important;
    border-color: #e0712c !important;
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
  object-fit: contain;
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
  background-color: #e0712c !important;
  color: white !important;
  border: none !important;
  border-radius: 20px !important;
  font-weight: bold !important;

  &:hover {
    background-color: #d86520 !important;
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
  color: #e0712c;
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

const LeftSlideButton = styled(Button)`
  position: absolute;
  top: 50%;
  left: -40px;
  transform: translateY(-50%);
  z-index: 2;

  @media (max-width: 768px) {
    left: -20px;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const RightSlideButton = styled(Button)`
  position: absolute;
  top: 50%;
  right: -40px;
  transform: translateY(-50%);
  z-index: 2;

  @media (max-width: 768px) {
    right: -20px;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const MovieRating = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 2px 5px;
  border-radius: 5px;
`;

const MovieList: React.FC = () => {
  const [activeTab, setActiveTab] = useState("now-showing");
  const [currentPage, setCurrentPage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  const movies = [
    {
      id: 1,
      title: "QUỶ NHẬP TRÀNG",
      duration: "95 PHÚT",
      releaseDate: "KHỞI CHIẾU 15-03-2025",
      image:
        "https://s3-alpha-sig.figma.com/img/3bb3/076f/2f736f47ecfe350189e25ad6e80401a0?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=rz9NYtEkSdKwNi81rsI-tmnj95CIUmTry~Q~HZvV333G-atbpa6DG3cRSVh8aitn9xVl~GROvbIddvoo8P-VGPDvZyJts8oqrTKt619l334mUS3Mm2qHauzMDIgrs5ckxrAYh1AfN5jJESmcty8k4TrmYOq7Y7z1VTsAOThuRNnNjgNgxUct3pw7~dWV3spUhgCp2DSCJ6QYMvc05eFgKf2JNz9zXSh2i9JwwPHaoa3Zw7J3GHdJOsXSVmg~01QeoWLsJnwysxaVpeY0oIVQPTRu0ItgYBy4ey7sHIRSU-sQSckW0eOiQ6gRYhp6HY5x0xBZwrL2rM3Vt9oi0MXDlA__",
    },
    {
      id: 2,
      title: "QUỶ NHẬP TRÀNG",
      duration: "95 PHÚT",
      releaseDate: "KHỞI CHIẾU 15-03-2025",
      image:
        "https://s3-alpha-sig.figma.com/img/3bb3/076f/2f736f47ecfe350189e25ad6e80401a0?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=rz9NYtEkSdKwNi81rsI-tmnj95CIUmTry~Q~HZvV333G-atbpa6DG3cRSVh8aitn9xVl~GROvbIddvoo8P-VGPDvZyJts8oqrTKt619l334mUS3Mm2qHauzMDIgrs5ckxrAYh1AfN5jJESmcty8k4TrmYOq7Y7z1VTsAOThuRNnNjgNgxUct3pw7~dWV3spUhgCp2DSCJ6QYMvc05eFgKf2JNz9zXSh2i9JwwPHaoa3Zw7J3GHdJOsXSVmg~01QeoWLsJnwysxaVpeY0oIVQPTRu0ItgYBy4ey7sHIRSU-sQSckW0eOiQ6gRYhp6HY5x0xBZwrL2rM3Vt9oi0MXDlA__",
    },
    {
      id: 3,
      title: "QUỶ NHẬP TRÀNG",
      duration: "95 PHÚT",
      releaseDate: "KHỞI CHIẾU 15-03-2025",
      image:
        "https://s3-alpha-sig.figma.com/img/3bb3/076f/2f736f47ecfe350189e25ad6e80401a0?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=rz9NYtEkSdKwNi81rsI-tmnj95CIUmTry~Q~HZvV333G-atbpa6DG3cRSVh8aitn9xVl~GROvbIddvoo8P-VGPDvZyJts8oqrTKt619l334mUS3Mm2qHauzMDIgrs5ckxrAYh1AfN5jJESmcty8k4TrmYOq7Y7z1VTsAOThuRNnNjgNgxUct3pw7~dWV3spUhgCp2DSCJ6QYMvc05eFgKf2JNz9zXSh2i9JwwPHaoa3Zw7J3GHdJOsXSVmg~01QeoWLsJnwysxaVpeY0oIVQPTRu0ItgYBy4ey7sHIRSU-sQSckW0eOiQ6gRYhp6HY5x0xBZwrL2rM3Vt9oi0MXDlA__",
    },
    {
      id: 4,
      title: "QUỶ NHẬP TRÀNG",
      duration: "95 PHÚT",
      releaseDate: "KHỞI CHIẾU 15-03-2025",
      image:
        "https://s3-alpha-sig.figma.com/img/3bb3/076f/2f736f47ecfe350189e25ad6e80401a0?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=rz9NYtEkSdKwNi81rsI-tmnj95CIUmTry~Q~HZvV333G-atbpa6DG3cRSVh8aitn9xVl~GROvbIddvoo8P-VGPDvZyJts8oqrTKt619l334mUS3Mm2qHauzMDIgrs5ckxrAYh1AfN5jJESmcty8k4TrmYOq7Y7z1VTsAOThuRNnNjgNgxUct3pw7~dWV3spUhgCp2DSCJ6QYMvc05eFgKf2JNz9zXSh2i9JwwPHaoa3Zw7J3GHdJOsXSVmg~01QeoWLsJnwysxaVpeY0oIVQPTRu0ItgYBy4ey7sHIRSU-sQSckW0eOiQ6gRYhp6HY5x0xBZwrL2rM3Vt9oi0MXDlA__",
    },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(0);
  };

  const nextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
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
              onClick={() => setActiveTab("now-showing")}
            >
              PHIM ĐANG CHIẾU
            </TabButton>
            <TabButton
              $active={activeTab === "coming-soon"}
              onClick={() => setActiveTab("coming-soon")}
            >
              PHIM SẮP CHIẾU
            </TabButton>
          </TabsContainer>
        </motion.div>

        <MoviesSlider>
          <LeftSlideButton onClick={prevPage}>
            <LeftOutlined />
          </LeftSlideButton>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            <MoviesContainer>
              {movies.map((movie) => (
                <motion.div
                  key={movie.id}
                  variants={slideInUp}
                  custom={movie.id}
                  transition={{ delay: movie.id * 0.1 }}
                >
                  <MovieCard>
                    <MoviePoster>
                      <PosterImage src={movie.image} alt={movie.title} />
                      <PosterOverlay className="overlay">
                        <ActionButton>TRAILER</ActionButton>
                        <Link to={`/booking/${movie.id}`}>
                          <ActionButton>ĐẶT VÉ</ActionButton>
                        </Link>
                      </PosterOverlay>
                    </MoviePoster>
                    <MovieTitle>{movie.title}</MovieTitle>
                    <MovieInfo>{movie.duration}</MovieInfo>
                    <MovieInfo>{movie.releaseDate}</MovieInfo>
                    <ButtonsContainer>
                      <ActionButton>TRAILER</ActionButton>
                      <Link to={`/booking/${movie.id}`}>
                        <ActionButton>ĐẶT VÉ</ActionButton>
                      </Link>
                    </ButtonsContainer>
                  </MovieCard>
                </motion.div>
              ))}
            </MoviesContainer>
          </motion.div>

          <RightSlideButton onClick={nextPage}>
            <RightOutlined />
          </RightSlideButton>
        </MoviesSlider>
      </MovieListContent>
    </MovieListContainer>
  );
};

export default MovieList;

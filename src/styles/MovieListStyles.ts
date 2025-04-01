import styled from "styled-components";
import { Button } from "antd";

export const MovieListContainer = styled.div`
  width: 100%;
  background: linear-gradient(to bottom, #22461f, #6391fa);
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const MovieListContent = styled.div`
  width: 80%;
  max-width: 1200px;
`;

export const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
`;

export const TabButton = styled(Button) <{ $active?: boolean }>`
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

export const MoviesSlider = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

export const MoviesContainer = styled.div`
  display: flex;
  gap: 20px;
  overflow: hidden;
  position: relative;
`;

export const MovieCard = styled.div`
  flex: 0 0 calc(25% - 15px);
  display: flex;
  flex-direction: column;
  background-color: transparent;
`;

export const MoviePoster = styled.div`
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

export const PosterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s;
  background-color: #000;
`;

export const PosterOverlay = styled.div`
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

export const MovieTitle = styled.h3`
  color: white;
  text-align: center;
  font-weight: bold;
  margin: 0;
  font-size: 18px;
`;

export const MovieInfo = styled.div`
  color: white;
  text-align: center;
  font-size: 14px;
  margin-bottom: 5px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
`;

export const ActionButton = styled.button`
  background-color: #e0712c;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 5px 15px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c0611c;
  }
`;

export const SliderButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

export const LeftSlideButton = styled(SliderButton)`
  left: -50px;
`;

export const RightSlideButton = styled(SliderButton)`
  right: -50px;
`; 
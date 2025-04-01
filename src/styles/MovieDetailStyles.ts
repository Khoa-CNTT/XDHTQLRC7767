import styled from "styled-components";
import { Button } from "antd";

export const MovieDetailContainer = styled.div`
  width: 100%;
  background-color: #F8FAF0;
  padding: 40px 0;
`;

export const MovieDetailContent = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

export const MovieHeader = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
`;

export const PosterContainer = styled.div`
  flex: 0 0 300px;
  height: 450px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

export const PosterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const MovieInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const MovieTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`;

export const MovieOriginalTitle = styled.h2`
  font-size: 18px;
  font-weight: normal;
  margin-bottom: 20px;
  color: #666;
  font-style: italic;
`;

export const InfoTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const InfoLabel = styled.div`
  flex: 0 0 120px;
  font-weight: bold;
  color: #333;
`;

export const InfoValue = styled.div`
  flex: 1;
  color: #555;
`;

export const AgeRestriction = styled.span`
  display: inline-block;
  background-color: #e74c3c;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  margin-right: 10px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: auto;
`;

export const ActionButton = styled(Button)`
  background-color: #FD6B0A !important;
  color: white !important;
  border: none !important;
  height: 40px !important;
  font-weight: bold !important;
  border-radius: 20px !important;
  padding: 0 25px !important;
  font-size: 16px !important;
  
  &:hover {
    background-color: #e05c00 !important;
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
`;

export const MovieContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const SectionTitle = styled.h3`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
  position: relative;
  padding-bottom: 10px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background-color: #FD6B0A;
  }
`;

export const Synopsis = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: #444;
  text-align: justify;
`;

export const TrailerContainer = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  position: relative;
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

export const TrailerIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

export const ShowtimesContainer = styled.div`
  margin-bottom: 30px;
`;

export const DateSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
`;

export const DateButton = styled(Button) <{ $active?: boolean }>`
  background-color: ${props => props.$active ? '#FD6B0A' : 'white'} !important;
  color: ${props => props.$active ? 'white' : '#333'} !important;
  border: 1px solid ${props => props.$active ? '#FD6B0A' : '#ddd'} !important;
  border-radius: 20px !important;
  min-width: 100px !important;
  
  &:hover {
    background-color: ${props => props.$active ? '#e05c00' : '#f5f5f5'} !important;
    border-color: ${props => props.$active ? '#e05c00' : '#ddd'} !important;
  }
`;

export const ShowtimesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const CinemaItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

export const CinemaHeader = styled.div`
  background-color: #f5f5f5;
  padding: 15px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CinemaLogo = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
`;

export const CinemaName = styled.div`
  font-size: 18px;
  color: #333;
`;

export const CinemaBody = styled.div`
  padding: 15px;
`;

export const ShowtimesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
`;

export const ShowtimeButton = styled(Button)`
  width: 100%;
  border: 1px solid #ddd !important;
  border-radius: 4px !important;
  
  &:hover {
    color: #FD6B0A !important;
    border-color: #FD6B0A !important;
  }
`; 
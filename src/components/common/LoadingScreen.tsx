import React from "react";
import styled, { keyframes } from "styled-components";

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(50, 135, 214, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 20px rgba(50, 135, 214, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(50, 135, 214, 0);
  }
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(-45deg, #0f172a, #1e293b, #334155, #475569);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  position: relative;
  overflow: hidden;
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${float} 3s ease-in-out infinite;
`;

const LogoContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  animation: ${pulse} 2s infinite;
`;

const Logo = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(45deg, #60a5fa, #3b82f6, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  line-height: 1;

  span {
    display: block;
    font-size: 1rem;
    margin-top: 5px;
    background: linear-gradient(45deg, #93c5fd, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const LoadingText = styled.div`
  color: #fff;
  font-size: 1.2rem;
  font-weight: 500;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  opacity: 0.9;
  margin-top: 20px;
  letter-spacing: 2px;
`;

const LoadingDots = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 20px;
  margin-top: 10px;

  div {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fff;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);

    &:nth-child(1) {
      left: 8px;
      animation: dot1 0.6s infinite;
    }
    &:nth-child(2) {
      left: 8px;
      animation: dot2 0.6s infinite;
    }
    &:nth-child(3) {
      left: 32px;
      animation: dot2 0.6s infinite;
    }
    &:nth-child(4) {
      left: 56px;
      animation: dot3 0.6s infinite;
    }
  }

  @keyframes dot1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes dot2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
  }
  @keyframes dot3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
`;

const LoadingScreen: React.FC = () => {
  return (
    <LoadingContainer>
      <LoadingContent>
        <LogoContainer>
          <Logo>
            BSCMSAAPUE
            <span>CINEMA</span>
          </Logo>
        </LogoContainer>
        <LoadingText>
          ĐANG TẢI
          <LoadingDots>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </LoadingDots>
        </LoadingText>
      </LoadingContent>
    </LoadingContainer>
  );
};

export default LoadingScreen;

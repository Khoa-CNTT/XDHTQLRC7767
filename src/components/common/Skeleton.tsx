import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const SkeletonBase = styled.div<{
  width?: string;
  height?: string;
  borderRadius?: string;
}>`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "20px"};
  border-radius: ${(props) => props.borderRadius || "4px"};
  background: linear-gradient(
    90deg,
    rgba(22, 33, 62, 0.8) 25%,
    rgba(0, 191, 255, 0.2) 50%,
    rgba(22, 33, 62, 0.8) 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite ease-in-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

export const Skeleton = {
  Box: SkeletonBase,
  Circle: styled(SkeletonBase)`
    border-radius: 50%;
  `,
  Text: styled(SkeletonBase)`
    margin: 8px 0;
    height: 16px;
  `,
  Title: styled(SkeletonBase)`
    height: 32px;
    margin-bottom: 16px;
  `,
  Image: styled(SkeletonBase)`
    width: 100%;
    height: 200px;
    border-radius: 8px;
  `,
  Card: styled(SkeletonBase)`
    width: 100%;
    height: 300px;
    border-radius: 8px;
    margin-bottom: 16px;
  `,
  Avatar: styled(SkeletonBase)`
    width: 40px;
    height: 40px;
    border-radius: 50%;
  `,
  Button: styled(SkeletonBase)`
    width: 120px;
    height: 40px;
    border-radius: 20px;
  `,
  Input: styled(SkeletonBase)`
    width: 100%;
    height: 40px;
    border-radius: 4px;
    margin-bottom: 16px;
  `,
  List: styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
  Grid: styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  `,
};

import React from "react";
import { Skeleton } from "../common/Skeleton";
import styled from "styled-components";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const HeroSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DetailSection = styled.div`
  margin-bottom: 48px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const MovieDetailSkeleton: React.FC = () => {
  return (
    <Container>
      <HeroSection>
        <Skeleton.Image height="450px" />
        <InfoSection>
          <Skeleton.Title width="70%" />
          <Skeleton.Text width="30%" />
          <Skeleton.Text width="50%" />
          <Skeleton.Text width="60%" />
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <Skeleton.Button />
            <Skeleton.Button />
          </div>
          <Skeleton.Text width="100%" height="100px" />
        </InfoSection>
      </HeroSection>

      <DetailSection>
        <Skeleton.Title width="30%" />
        <Skeleton.Text width="100%" />
        <Skeleton.Text width="100%" />
        <Skeleton.Text width="90%" />
      </DetailSection>

      <DetailSection>
        <Skeleton.Title width="40%" />
        <Grid>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton.Card key={i} />
          ))}
        </Grid>
      </DetailSection>

      <DetailSection>
        <Skeleton.Title width="35%" />
        <Grid>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton.Card key={i} height="200px" />
          ))}
        </Grid>
      </DetailSection>
    </Container>
  );
};

export default MovieDetailSkeleton;

import React from "react";
import { Skeleton } from "../common/Skeleton";
import styled from "styled-components";

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const MoviesPageSkeleton: React.FC = () => {
  return (
    <Container>
      <Skeleton.Title width="60%" />
      <FilterSection>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton.Button key={i} />
        ))}
      </FilterSection>
      <Skeleton.Grid>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton.Card key={i} />
        ))}
      </Skeleton.Grid>
    </Container>
  );
};

export default MoviesPageSkeleton;

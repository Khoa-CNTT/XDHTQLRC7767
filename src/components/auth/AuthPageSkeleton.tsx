import React from "react";
import { Skeleton } from "../common/Skeleton";
import styled from "styled-components";

const Container = styled.div`
  padding: 24px;
  max-width: 500px;
  margin: 0 auto;
`;

const AuthCard = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const AuthPageSkeleton: React.FC = () => {
  return (
    <Container>
      <AuthCard>
        <AuthHeader>
          <Skeleton.Title width="60%" />
          <Skeleton.Text width="80%" />
        </AuthHeader>

        <Skeleton.List>
          {[1, 2, 3].map((i) => (
            <Skeleton.Input key={i} />
          ))}
        </Skeleton.List>

        <div style={{ marginTop: "24px" }}>
          <Skeleton.Button />
        </div>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <Skeleton.Text width="40%" />
        </div>
      </AuthCard>
    </Container>
  );
};

export default AuthPageSkeleton;

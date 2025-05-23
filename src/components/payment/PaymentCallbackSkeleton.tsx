import React from "react";
import { Skeleton } from "../common/Skeleton";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
`;

const Card = styled.div`
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background: #fff;
  padding: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 16px;
`;

const PaymentCallbackSkeleton: React.FC = () => {
  return (
    <Container>
      <Skeleton.Title width="60%" height="40px" />
      <Card>
        <Skeleton.Image
          height="100px"
          width="100px"
          style={{ margin: "0 auto", display: "block" }}
        />
        <Skeleton.Title width="80%" style={{ margin: "20px auto" }} />
        <Skeleton.Text width="90%" style={{ margin: "0 auto" }} />
        <Skeleton.Text width="60%" style={{ margin: "0 auto" }} />

        <div style={{ margin: "30px 0" }}>
          <Skeleton.Text width="100%" />
          <Skeleton.Text width="100%" />
          <Skeleton.Text width="80%" />
        </div>

        <ButtonGroup>
          <Skeleton.Button width="150px" />
          <Skeleton.Button width="150px" />
        </ButtonGroup>
      </Card>
    </Container>
  );
};

export default PaymentCallbackSkeleton;

import React from "react";
import { Skeleton } from "../common/Skeleton";
import styled from "styled-components";

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const InvoiceCard = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const InvoiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const InvoiceDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InvoicePageSkeleton: React.FC = () => {
  return (
    <Container>
      <Skeleton.Title width="40%" />
      {[1, 2, 3].map((i) => (
        <InvoiceCard key={i}>
          <InvoiceHeader>
            <Skeleton.Title width="30%" />
            <Skeleton.Button />
          </InvoiceHeader>

          <InvoiceDetails>
            <div>
              <Skeleton.Text width="40%" />
              <Skeleton.Text width="60%" />
              <Skeleton.Text width="50%" />
            </div>
            <div>
              <Skeleton.Text width="40%" />
              <Skeleton.Text width="60%" />
              <Skeleton.Text width="50%" />
            </div>
          </InvoiceDetails>

          <Skeleton.Image height="150px" />

          <div style={{ marginTop: "24px" }}>
            <Skeleton.Text width="100%" />
            <Skeleton.Text width="100%" />
            <Skeleton.Text width="60%" />
          </div>
        </InvoiceCard>
      ))}
    </Container>
  );
};

export default InvoicePageSkeleton;

import React from "react";
import { Skeleton } from "../common/Skeleton";
import styled from "styled-components";
import { Row, Col } from "antd";

const PageContainer = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 40px 0;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 95%;
  }
`;

const StepsContainer = styled.div`
  margin-bottom: 30px;
`;

const StepContent = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin-top: 24px;
`;

const MovieInfoCard = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SeatsContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 30px;
  margin-bottom: 30px;
`;

const ScreenContainer = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const SeatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 10px;
  margin: 0 auto;
  max-width: 600px;
`;

const SummaryCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 20px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const BookingPageSkeleton: React.FC = () => {
  return (
    <PageContainer>
      <ContentWrapper>
        {/* Page Title */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Skeleton.Title
            width="40%"
            height="50px"
            style={{ margin: "0 auto" }}
          />
        </div>

        {/* Steps */}
        <StepsContainer>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Skeleton.Button width="30%" />
            <Skeleton.Button width="30%" />
            <Skeleton.Button width="30%" />
          </div>
        </StepsContainer>

        {/* Step Content */}
        <StepContent>
          {/* Movie Info */}
          <MovieInfoCard>
            <div style={{ flex: "0 0 250px" }}>
              <Skeleton.Image height="350px" />
            </div>
            <div style={{ flex: 1, padding: "20px" }}>
              <Skeleton.Title width="70%" />
              <Skeleton.Text width="40%" />
              <Skeleton.Text width="60%" />
              <Skeleton.Text width="50%" />
              <Skeleton.Text width="100%" height="100px" />
            </div>
          </MovieInfoCard>

          {/* Date and Cinema Selection */}
          <div style={{ marginBottom: "30px" }}>
            <Skeleton.Title width="30%" height="30px" />
            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
              <Col xs={24} sm={12} md={8}>
                <Skeleton.Input />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Skeleton.Input />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Skeleton.Input />
              </Col>
            </Row>
          </div>

          {/* Showtimes */}
          <div style={{ marginBottom: "30px" }}>
            <Skeleton.Title width="30%" height="30px" />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton.Button key={i} width="100px" />
              ))}
            </div>
          </div>

          {/* Seats */}
          <SeatsContainer>
            <Skeleton.Title width="30%" style={{ marginBottom: "20px" }} />

            <ScreenContainer>
              <Skeleton.Box
                width="80%"
                height="20px"
                style={{ margin: "0 auto 30px auto" }}
              />
            </ScreenContainer>

            <SeatsGrid>
              {Array.from({ length: 60 }).map((_, i) => (
                <Skeleton.Box
                  key={i}
                  width="30px"
                  height="30px"
                  borderRadius="6px"
                />
              ))}
            </SeatsGrid>

            <div
              style={{
                marginTop: "30px",
                display: "flex",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              <Skeleton.Box
                width="20px"
                height="20px"
                style={{ display: "inline-block" }}
              />
              <Skeleton.Text width="60px" style={{ display: "inline-block" }} />
              <Skeleton.Box
                width="20px"
                height="20px"
                style={{ display: "inline-block" }}
              />
              <Skeleton.Text width="60px" style={{ display: "inline-block" }} />
              <Skeleton.Box
                width="20px"
                height="20px"
                style={{ display: "inline-block" }}
              />
              <Skeleton.Text width="60px" style={{ display: "inline-block" }} />
            </div>
          </SeatsContainer>

          {/* Summary */}
          <SummaryCard>
            <Skeleton.Title width="40%" />
            <div style={{ marginTop: "20px" }}>
              <Skeleton.Text width="100%" />
              <Skeleton.Text width="100%" />
              <Skeleton.Text width="100%" />
              <Skeleton.Text width="100%" />
              <Skeleton.Text width="80%" />
            </div>
          </SummaryCard>

          {/* Buttons */}
          <ButtonsContainer>
            <Skeleton.Button width="120px" />
            <Skeleton.Button width="150px" />
          </ButtonsContainer>
        </StepContent>
      </ContentWrapper>
    </PageContainer>
  );
};

export default BookingPageSkeleton;

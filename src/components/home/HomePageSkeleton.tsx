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

const Section = styled.div`
  margin-bottom: 60px;
`;

const SectionHeader = styled.div`
  margin-bottom: 30px;
`;

const MovieCard = styled.div`
  background: rgba(22, 33, 62, 0.7);
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  margin-bottom: 20px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 191, 255, 0.08);
`;

const PromotionCard = styled.div`
  background: rgba(22, 33, 62, 0.7);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
  height: 100%;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 191, 255, 0.08);
`;

const HomePageSkeleton: React.FC = () => {
  return (
    <PageContainer>
      <ContentWrapper>
        {/* Now Showing Movies Section */}
        <Section>
          <SectionHeader>
            <Skeleton.Title width="30%" height="40px" />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "16px",
              }}
            >
              <Skeleton.Text width="40%" />
              <Skeleton.Button width="120px" />
            </div>
          </SectionHeader>

          <Row gutter={[24, 24]}>
            {[1, 2, 3, 4].map((i) => (
              <Col xs={12} sm={12} md={6} key={`now-showing-${i}`}>
                <MovieCard>
                  <Skeleton.Image height="260px" />
                  <div style={{ padding: "16px" }}>
                    <Skeleton.Title
                      width="90%"
                      style={{ marginBottom: "12px" }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <Skeleton.Box
                        width="60px"
                        height="22px"
                        borderRadius="4px"
                      />
                      <Skeleton.Box
                        width="70px"
                        height="22px"
                        borderRadius="4px"
                      />
                      <Skeleton.Box
                        width="50px"
                        height="22px"
                        borderRadius="4px"
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "12px",
                      }}
                    >
                      <Skeleton.Text width="40%" />
                      <Skeleton.Text width="30%" />
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Skeleton.Button width="50%" />
                      <Skeleton.Button width="50%" />
                    </div>
                  </div>
                </MovieCard>
              </Col>
            ))}
          </Row>
        </Section>

        {/* Coming Soon Movies Section */}
        <Section>
          <SectionHeader>
            <Skeleton.Title width="30%" height="40px" />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "16px",
              }}
            >
              <Skeleton.Text width="40%" />
              <Skeleton.Button width="120px" />
            </div>
          </SectionHeader>

          <Row gutter={[24, 24]}>
            {[1, 2, 3, 4].map((i) => (
              <Col xs={12} sm={12} md={6} key={`coming-soon-${i}`}>
                <MovieCard>
                  <Skeleton.Image height="260px" />
                  <div style={{ padding: "16px" }}>
                    <Skeleton.Title
                      width="90%"
                      style={{ marginBottom: "12px" }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <Skeleton.Box
                        width="60px"
                        height="22px"
                        borderRadius="4px"
                      />
                      <Skeleton.Box
                        width="70px"
                        height="22px"
                        borderRadius="4px"
                      />
                      <Skeleton.Box
                        width="50px"
                        height="22px"
                        borderRadius="4px"
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "12px",
                      }}
                    >
                      <Skeleton.Text width="40%" />
                      <Skeleton.Text width="30%" />
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Skeleton.Button width="50%" />
                      <Skeleton.Button width="50%" />
                    </div>
                  </div>
                </MovieCard>
              </Col>
            ))}
          </Row>
        </Section>

        {/* Promotions Section */}
        <Section>
          <SectionHeader>
            <Skeleton.Title width="30%" height="40px" />
            <Skeleton.Text width="50%" style={{ marginTop: "10px" }} />
          </SectionHeader>

          <Row gutter={[24, 24]}>
            {[1, 2, 3].map((i) => (
              <Col xs={24} sm={12} lg={8} key={`promotion-${i}`}>
                <PromotionCard>
                  <Skeleton.Image height="200px" />
                  <div style={{ padding: "20px" }}>
                    <Skeleton.Title
                      width="80%"
                      style={{ marginBottom: "12px" }}
                    />
                    <Skeleton.Text width="100%" />
                    <Skeleton.Text width="90%" />
                    <div
                      style={{
                        marginTop: "16px",
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <Skeleton.Button width="50%" />
                      <Skeleton.Box
                        width="80px"
                        height="24px"
                        borderRadius="12px"
                      />
                    </div>
                  </div>
                </PromotionCard>
              </Col>
            ))}
          </Row>
        </Section>

        {/* Cinemas Section */}
        <Section>
          <SectionHeader>
            <Skeleton.Title width="30%" height="40px" />
            <Skeleton.Text width="50%" style={{ marginTop: "10px" }} />
          </SectionHeader>

          <Row gutter={[24, 24]}>
            {[1, 2, 3].map((i) => (
              <Col xs={24} sm={12} lg={8} key={`cinema-${i}`}>
                <PromotionCard>
                  <Skeleton.Image height="200px" />
                  <div style={{ padding: "20px" }}>
                    <Skeleton.Title
                      width="70%"
                      style={{ marginBottom: "12px" }}
                    />
                    <Skeleton.Text width="100%" />
                    <Skeleton.Text width="60%" />
                    <Skeleton.Button
                      width="100%"
                      style={{ marginTop: "16px" }}
                    />
                  </div>
                </PromotionCard>
              </Col>
            ))}
          </Row>
        </Section>
      </ContentWrapper>
    </PageContainer>
  );
};

export default HomePageSkeleton;

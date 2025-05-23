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

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 40px;
  position: relative;
`;

const FilterContainer = styled.div`
  background: rgba(22, 33, 62, 0.7);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  border-top: 3px solid #00bfff;
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FeaturedSection = styled.div`
  margin-bottom: 40px;
`;

const TabsContainer = styled.div`
  margin-bottom: 30px;
`;

const NewsCard = styled.div`
  height: 100%;
  background: rgba(22, 33, 62, 0.7);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
`;

const NewsPageSkeleton: React.FC = () => {
  return (
    <PageContainer>
      <ContentWrapper>
        {/* Page Title */}
        <TitleContainer>
          <Skeleton.Title
            width="40%"
            height="50px"
            style={{ margin: "0 auto" }}
          />
        </TitleContainer>

        {/* Filters */}
        <FilterContainer>
          <FilterRow>
            <Skeleton.Input style={{ flex: 1, minWidth: "200px" }} />
            <Skeleton.Button width="200px" />
          </FilterRow>
        </FilterContainer>

        {/* Featured News */}
        <FeaturedSection>
          <Skeleton.Title width="30%" height="40px" />
          <Skeleton.Card height="400px" />
        </FeaturedSection>

        {/* Tabs */}
        <TabsContainer>
          <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
            <Skeleton.Button width="100px" />
            <Skeleton.Button width="120px" />
            <Skeleton.Button width="110px" />
            <Skeleton.Button width="90px" />
          </div>
        </TabsContainer>

        {/* News Grid */}
        <Row gutter={[24, 24]}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <Col xs={24} sm={12} lg={8} key={i}>
              <NewsCard>
                <Skeleton.Image height="200px" />
                <div style={{ padding: "20px" }}>
                  <Skeleton.Text width="30%" style={{ marginBottom: "10px" }} />
                  <Skeleton.Title
                    width="90%"
                    style={{ marginBottom: "15px" }}
                  />
                  <Skeleton.Text width="100%" />
                  <Skeleton.Text width="80%" />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      margin: "15px 0",
                    }}
                  >
                    <Skeleton.Text width="40%" />
                    <Skeleton.Text width="30%" />
                  </div>

                  <Skeleton.Button width="120px" />
                </div>
              </NewsCard>
            </Col>
          ))}
        </Row>

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
          }}
        >
          <Skeleton.Button width="300px" height="32px" />
        </div>
      </ContentWrapper>
    </PageContainer>
  );
};

export default NewsPageSkeleton;

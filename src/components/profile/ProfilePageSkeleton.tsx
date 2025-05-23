import React from "react";
import { Skeleton } from "../common/Skeleton";
import styled from "styled-components";

const Container = styled.div`
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfilePageSkeleton: React.FC = () => {
  return (
    <Container>
      <ProfileHeader>
        <Skeleton.Avatar width="100px" height="100px" />
        <ProfileInfo>
          <Skeleton.Title width="40%" />
          <Skeleton.Text width="60%" />
          <Skeleton.Text width="30%" />
        </ProfileInfo>
      </ProfileHeader>

      <Skeleton.List>
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <Skeleton.Input />
            <Skeleton.Text width="70%" />
          </div>
        ))}
      </Skeleton.List>

      <div style={{ marginTop: "32px" }}>
        <Skeleton.Button />
      </div>
    </Container>
  );
};

export default ProfilePageSkeleton;

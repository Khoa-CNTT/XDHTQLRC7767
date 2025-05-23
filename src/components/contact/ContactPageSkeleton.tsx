import React from "react";
import { Skeleton } from "../common/Skeleton";
import styled from "styled-components";

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ContactLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactForm = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ContactInfo = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ContactPageSkeleton: React.FC = () => {
  return (
    <Container>
      <Skeleton.Title width="40%" />
      <ContactLayout>
        <ContactForm>
          <Skeleton.Title width="60%" />
          <Skeleton.List>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton.Input key={i} />
            ))}
          </Skeleton.List>
          <Skeleton.Button />
        </ContactForm>

        <ContactInfo>
          <Skeleton.Title width="60%" />
          <Skeleton.List>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ marginBottom: "16px" }}>
                <Skeleton.Text width="40%" />
                <Skeleton.Text width="80%" />
              </div>
            ))}
          </Skeleton.List>
          <Skeleton.Image height="200px" />
        </ContactInfo>
      </ContactLayout>
    </Container>
  );
};

export default ContactPageSkeleton;

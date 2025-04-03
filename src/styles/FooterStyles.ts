import styled from "styled-components";

export const FooterContainer = styled.footer`
  width: 100%;
  background-color: #1a1a2e;
  color: white;
  padding: 40px 0 20px;
`;

export const FooterContent = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

export const SocialMediaContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`;

export const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #00bfff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  color: #00bfff;
  font-size: 20px;
  transition: all 0.3s;

  &:hover {
    background-color: #00bfff;
  }
`;

export const FooterInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
`;

export const FooterColumn = styled.div`
  flex: 1;
  padding: 0 15px;
`;

export const FooterLogo = styled.div`
  font-family: "Brush Script MT", cursive;
  font-size: 28px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const LogoText = styled.span`
  font-weight: bold;
`;

export const CinemaText = styled.span`
  font-size: 16px;
  margin-top: -10px;
`;

export const FooterTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: white;
  
  &:after {
    content: '';
    display: block;
    width: 40px;
    height: 3px;
    background-color: #00bfff;
    margin-top: 8px;
  }
`;

export const FooterAddress = styled.p`
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;
`;

export const FooterLink = styled.a`
  display: block;
  color: #b2bec3;
  text-decoration: none;
  margin-bottom: 10px;
  font-size: 14px;
  transition: color 0.3s;

  &:hover {
    color: #00bfff;
  }
`;

export const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
`;

export const ContactIcon = styled.span`
  margin-right: 10px;
  color: white;
`; 
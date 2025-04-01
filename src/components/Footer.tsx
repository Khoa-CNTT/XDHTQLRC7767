import React from "react";
import {
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { fadeIn, slideInUp } from "../utils/animations";
import {
  FooterContainer,
  FooterContent,
  SocialMediaContainer,
  SocialIcon,
  FooterInfoContainer,
  FooterColumn,
  FooterLogo,
  LogoText,
  CinemaText,
  FooterTitle,
  FooterAddress,
  FooterLink,
  ContactItem,
  ContactIcon,
} from "../styles/FooterStyles";

const Footer: React.FC = () => {
  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <FooterContainer>
      <FooterContent>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <SocialMediaContainer>
            <SocialIcon href="https://facebook.com" target="_blank">
              <FacebookOutlined />
            </SocialIcon>
            <SocialIcon href="https://instagram.com" target="_blank">
              <InstagramOutlined />
            </SocialIcon>
            <SocialIcon href="https://youtube.com" target="_blank">
              <YoutubeOutlined />
            </SocialIcon>
          </SocialMediaContainer>
        </motion.div>

        <motion.div
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <FooterInfoContainer>
            <motion.div variants={itemVariants}>
              <FooterColumn>
                <FooterLogo>
                  <LogoText>
                    UBAN<span>FLIX</span>
                  </LogoText>
                  <CinemaText>CINEMA</CinemaText>
                </FooterLogo>
                <FooterAddress>
                  Tầng 5, Vincom Plaza Ngô Quyền, Đà Nẵng
                </FooterAddress>
              </FooterColumn>
            </motion.div>

            <motion.div variants={itemVariants}>
              <FooterColumn>
                <FooterTitle>THÔNG TIN</FooterTitle>
                <FooterLink href="#">GIỚI THIỆU</FooterLink>
                <FooterLink href="#">TUYỂN DỤNG</FooterLink>
                <FooterLink href="#">LIÊN HỆ</FooterLink>
              </FooterColumn>
            </motion.div>

            <motion.div variants={itemVariants}>
              <FooterColumn>
                <FooterTitle>LIÊN HỆ VỚI CHÚNG TÔI</FooterTitle>
                <ContactItem>
                  <ContactIcon>✉️</ContactIcon>
                  flixcinema@gmail.com
                </ContactItem>
                <ContactItem>
                  <ContactIcon>📞</ContactIcon>
                  0234999999
                </ContactItem>
              </FooterColumn>
            </motion.div>
          </FooterInfoContainer>
        </motion.div>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;

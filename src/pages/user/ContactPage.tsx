import React, { useState } from "react";
import { Row, Col, Form, Input, Button, message, Card } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { motion } from "framer-motion";
import useDocumentTitle from "../../hooks/useDocumentTitle";

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const ContentWrapper = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 0;

  @media (max-width: 768px) {
    width: 90%;
    padding: 30px 0;
  }

  @media (max-width: 576px) {
    width: 95%;
    padding: 20px 0;
  }
`;

const PageTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 24px;
  color: #333;
  font-weight: 600;

  @media (max-width: 576px) {
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
  }
`;

const ContactCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  overflow: hidden;

  .ant-card-head {
    background-color: #fd6b0a;
    color: white;
  }

  .ant-card-head-title {
    font-size: 18px;
    font-weight: 600;
  }

  @media (max-width: 576px) {
    margin-bottom: 16px;

    .ant-card-head-title {
      font-size: 16px;
    }

    .ant-card-body {
      padding: 16px;
    }
  }
`;

const ContactForm = styled(Form)`
  .ant-form-item-label > label {
    font-weight: 500;
  }

  .ant-input,
  .ant-input-textarea {
    border-radius: 4px;
  }

  @media (max-width: 576px) {
    .ant-form-item {
      margin-bottom: 16px;
    }

    .ant-form-item-label {
      padding-bottom: 4px;
    }
  }
`;

const SubmitButton = styled(Button)`
  background-color: #fd6b0a;
  border-color: #fd6b0a;
  height: 40px;
  font-weight: 500;

  &:hover,
  &:focus {
    background-color: #e05c00;
    border-color: #e05c00;
  }

  @media (max-width: 576px) {
    height: 38px;
    font-size: 14px;
  }
`;

const ContactInfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 576px) {
    margin-bottom: 12px;
  }
`;

const ContactIcon = styled.div`
  font-size: 18px;
  color: #fd6b0a;
  margin-right: 12px;
  margin-top: 2px;

  @media (max-width: 576px) {
    font-size: 16px;
    margin-right: 10px;
  }
`;

const ContactText = styled.div`
  flex: 1;

  h4 {
    margin: 0 0 4px;
    font-weight: 600;
    font-size: 16px;
    color: #333;
  }

  p {
    margin: 0;
    color: #666;
    line-height: 1.5;
  }

  @media (max-width: 576px) {
    h4 {
      font-size: 15px;
    }

    p {
      font-size: 14px;
    }
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }

  @media (max-width: 768px) {
    height: 300px;
  }

  @media (max-width: 576px) {
    height: 250px;
    margin-bottom: 16px;
  }
`;

const ContactPage: React.FC = () => {
  useDocumentTitle("Liên hệ");

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) => {
    setLoading(true);

    // Giả lập gửi form
    setTimeout(() => {
      message.success(
        "Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi trong thời gian sớm nhất!"
      );
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <PageTitle>Liên hệ với chúng tôi</PageTitle>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ContactCard title="Thông tin liên hệ">
                <ContactInfoItem>
                  <ContactIcon>
                    <EnvironmentOutlined />
                  </ContactIcon>
                  <ContactText>
                    <h4>Địa chỉ</h4>
                    <p>
                      Tầng 4 Trung tâm Thương Mại Vincom Đà Nẵng, Q. Ngô Quyền,
                      An Hải Bắc, Sơn Trà, Đà Nẵng
                    </p>
                  </ContactText>
                </ContactInfoItem>

                <ContactInfoItem>
                  <ContactIcon>
                    <PhoneOutlined />
                  </ContactIcon>
                  <ContactText>
                    <h4>Điện thoại</h4>
                    <p>Hotline: 0234 999 999</p>
                    <p>Hỗ trợ khách hàng: 0234 888 888</p>
                  </ContactText>
                </ContactInfoItem>

                <ContactInfoItem>
                  <ContactIcon>
                    <MailOutlined />
                  </ContactIcon>
                  <ContactText>
                    <h4>Email</h4>
                    <p>info@BSCMSAAPUE.com</p>
                    <p>support@BSCMSAAPUE.com</p>
                  </ContactText>
                </ContactInfoItem>

                <ContactInfoItem>
                  <ContactIcon>
                    <ClockCircleOutlined />
                  </ContactIcon>
                  <ContactText>
                    <h4>Giờ làm việc</h4>
                    <p>Thứ Hai - Chủ Nhật: 8:00 - 22:00</p>
                  </ContactText>
                </ContactInfoItem>
              </ContactCard>

              <MapContainer>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.1104354055014!2d108.22191491485825!3d16.059758988885693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142183691882913%3A0xaec1d4d7e1f1d81a!2sVincom%20Plaza%20Ngo%20Quyen!5e0!3m2!1sen!2s!4v1650123456789!5m2!1sen!2s"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="BSCMSAAPUE Cinema Location"
                />
              </MapContainer>
            </motion.div>
          </Col>

          <Col xs={24} lg={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ContactCard title="Gửi tin nhắn cho chúng tôi">
                <ContactForm form={form} layout="vertical" onFinish={onFinish}>
                  <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập họ tên của bạn!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập họ và tên của bạn" />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập email của bạn!",
                      },
                      { type: "email", message: "Email không hợp lệ!" },
                    ]}
                  >
                    <Input placeholder="Nhập email của bạn" />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại của bạn!",
                      },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Số điện thoại không hợp lệ!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại của bạn" />
                  </Form.Item>

                  <Form.Item
                    name="subject"
                    label="Tiêu đề"
                    rules={[
                      { required: true, message: "Vui lòng nhập tiêu đề!" },
                    ]}
                  >
                    <Input placeholder="Nhập tiêu đề tin nhắn" />
                  </Form.Item>

                  <Form.Item
                    name="message"
                    label="Nội dung"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập nội dung tin nhắn!",
                      },
                    ]}
                  >
                    <Input.TextArea
                      placeholder="Nhập nội dung tin nhắn của bạn"
                      rows={6}
                    />
                  </Form.Item>

                  <Form.Item>
                    <SubmitButton
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                    >
                      Gửi tin nhắn
                    </SubmitButton>
                  </Form.Item>
                </ContactForm>
              </ContactCard>
            </motion.div>
          </Col>
        </Row>
      </ContentWrapper>
    </PageContainer>
  );
};

export default ContactPage;

import styled from 'styled-components';
import { Tabs, Button, Modal } from 'antd';

export const PageContainer = styled.div`
  background: linear-gradient(to bottom, #1a1a2e, #16213e);
  padding: 40px 0;
  min-height: 100vh;
`;

export const ContentWrapper = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    width: 95%;
  }
`;

export const PageTitle = styled.h1`
  color: white;
  text-align: center;
  font-size: 32px;
  margin-bottom: 40px;
  
  &:after {
    content: '';
    display: block;
    width: 100px;
    height: 3px;
    background-color: #00bfff;
    margin: 10px auto;
  }
`;

export const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 30px;
    
    &::before {
      border-bottom: none !important;
    }
  }

  .ant-tabs-tab {
    color: #ffffff80 !important;
    font-size: 16px;
    padding: 8px 20px !important;
    margin: 0 10px !important;
    transition: all 0.3s ease;

    &:hover {
      color: #00bfff !important;
    }
  }

  .ant-tabs-tab-active {
    .ant-tabs-tab-btn {
      color: #00bfff !important;
    }
  }

  .ant-tabs-ink-bar {
    background: #00bfff !important;
    height: 3px !important;
  }
`;

export const CinemaCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
  }
`;

export const CinemaImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
`;

export const CinemaName = styled.h3`
  color: white;
  font-size: 20px;
  margin-bottom: 10px;
`;

export const CinemaInfo = styled.p`
  color: #ffffff80;
  margin-bottom: 5px;
  font-size: 14px;
`;

export const ViewButton = styled(Button)`
  background: #00bfff;
  color: white;
  border: none;
  border-radius: 20px;
  margin-top: 15px;
  width: 100%;

  &:hover {
    background: #0099cc;
    transform: translateY(-2px);
  }
`;

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    background: #1a1a2e;
    border-radius: 12px;
  }

  .ant-modal-header {
    background: transparent;
    border-bottom: 1px solid #ffffff20;
  }

  .ant-modal-title {
    color: white;
  }

  .ant-modal-body {
    color: #ffffff80;
  }

  .ant-modal-footer {
    border-top: 1px solid #ffffff20;
  }
`; 
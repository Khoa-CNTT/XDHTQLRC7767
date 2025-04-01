import styled from 'styled-components';
import { Form, Input, Button, Divider } from 'antd';

export const AuthContainer = styled.div`
  width: 100%;
  background-color: #F8FAF0;
  min-height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
`;

export const AuthCard = styled.div`
  width: 100%;
  max-width: 450px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
`;

export const AuthTitle = styled.h2`
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #333;
`;

export const StyledForm = styled(Form)`
  width: 100%;
`;

export const StyledFormItem = styled(Form.Item)`
  margin-bottom: 20px;
`;

export const StyledInput = styled(Input)`
  height: 45px;
  border-radius: 4px;
`;

export const StyledPasswordInput = styled(Input.Password)`
  height: 45px;
  border-radius: 4px;
`;

export const StyledButton = styled(Button)`
  width: 100%;
  height: 45px;
  background-color: #FD6B0A !important;
  color: white !important;
  font-weight: bold !important;
  border: none !important;
  border-radius: 4px !important;
  font-size: 16px !important;
  
  &:hover, &:focus {
    background-color: #e05c00 !important;
  }
`;

export const StyledDivider = styled(Divider)`
  margin: 20px 0;
`;

export const SwitchText = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
`;

export const SwitchLink = styled.a`
  color: #FD6B0A;
  font-weight: bold;
  margin-left: 5px;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const ErrorMessage = styled.div`
  color: #f5222d;
  text-align: center;
  margin-bottom: 15px;
`;

export const SuccessMessage = styled.div`
  color: #52c41a;
  text-align: center;
  margin-bottom: 15px;
`; 
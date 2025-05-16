import React, { useState, useRef, useEffect } from "react";
import { Button, Input, Typography, Space } from "antd";
import {
  SendOutlined,
  MessageOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { useChat } from "../../hooks/useChat";

const { Text } = Typography;

const ChatBoxContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
`;

const ChatToggleButton = styled(Button)`
  width: 50px !important;
  height: 50px !important;
  border-radius: 50% !important;
  background-color: #1890ff !important;
  color: white !important;
  border: none !important;
  font-size: 20px !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s ease !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  &:hover {
    transform: scale(1.1) !important;
    background-color: #40a9ff !important;
  }
`;

const ChatWindow = styled.div`
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 350px;
  height: 500px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ChatHeader = styled.div`
  padding: 15px;
  background-color: #1890ff;
  color: white;
  border-radius: 10px 10px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CloseButton = styled(Button)`
  color: white !important;
  border: none !important;
  padding: 0 !important;
  height: auto !important;
  font-size: 20px !important;

  &:hover {
    color: #e6f7ff !important;
    background: transparent !important;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f5f5f5;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 15px;
  margin: 5px 0;
  word-wrap: break-word;
  align-self: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  background-color: ${(props) => (props.isUser ? "#1890ff" : "white")};
  color: ${(props) => (props.isUser ? "white" : "#333")};
  border-bottom-right-radius: ${(props) => (props.isUser ? "5px" : "15px")};
  border-bottom-left-radius: ${(props) => (props.isUser ? "15px" : "5px")};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.div`
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
  background-color: white;
`;

const StyledInput = styled(Input)`
  border-radius: 20px !important;

  &:hover,
  &:focus {
    border-color: #40a9ff !important;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
  }
`;

const SendButton = styled(Button)`
  border-radius: 20px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: 10px;
  align-self: flex-start;
`;

const TypingDot = styled.span`
  width: 8px;
  height: 8px;
  background-color: #1890ff;
  border-radius: 50%;
  animation: typing 1s infinite ease-in-out;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }
`;

const ChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage } = useChat();
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    await sendMessage(inputMessage);
    setInputMessage("");
  };

  return (
    <ChatBoxContainer isOpen={isOpen}>
      {isOpen && (
        <ChatWindow>
          <ChatHeader>
            <Space>
              <MessageOutlined />
              <Text strong style={{ color: "white" }}>
                AI Assistant
              </Text>
            </Space>
            <CloseButton
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setIsOpen(false)}
            />
          </ChatHeader>

          <MessagesContainer>
            {messages.map((message, index) => (
              <MessageBubble key={index} isUser={message.role === "user"}>
                {message.content}
              </MessageBubble>
            ))}
            {isLoading && (
              <MessageBubble isUser={false}>
                <TypingIndicator>
                  <TypingDot />
                  <TypingDot />
                  <TypingDot />
                </TypingIndicator>
              </MessageBubble>
            )}
            <div ref={messagesEndRef} />
          </MessagesContainer>

          <InputContainer>
            <StyledInput
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onPressEnter={handleSendMessage}
              placeholder="Type your message..."
              suffix={
                <SendButton
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  loading={isLoading}
                />
              }
            />
          </InputContainer>
        </ChatWindow>
      )}
      <ChatToggleButton
        type="primary"
        icon={isOpen ? <CloseOutlined /> : <MessageOutlined />}
        onClick={() => setIsOpen(!isOpen)}
      />
    </ChatBoxContainer>
  );
};

export default ChatBox;

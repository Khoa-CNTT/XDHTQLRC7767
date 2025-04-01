import React, { useState, useEffect } from "react";
import { Table, Tag, Empty, Spin, Card, Statistic, Row, Col, Progress, Divider } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, GiftOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { motion } from "framer-motion";
import dayjs from "dayjs";

// Giả lập dữ liệu điểm
const mockPointHistory = [
  {
    id: "PT12345",
    type: "earn",
    amount: 30,
    description: "Đặt vé xem phim Avengers: Endgame",
    date: "2023-10-15T19:30:00",
    reference: "TK12345"
  },
  {
    id: "PT12346",
    type: "earn",
    amount: 45,
    description: "Đặt vé xem phim Joker",
    date: "2023-09-28T20:15:00",
    reference: "TK12346"
  },
  {
    id: "PT12347",
    type: "redeem",
    amount: 50,
    description: "Đổi combo bắp nước",
    date: "2023-09-30T14:20:00",
    reference: "RD5678"
  },
  {
    id: "PT12348",
    type: "earn",
    amount: 15,
    description: "Đặt vé xem phim Dune",
    date: "2023-11-05T18:00:00",
    reference: "TK12347"
  },
  {
    id: "PT12349",
    type: "redeem",
    amount: 100,
    description: "Đổi vé xem phim miễn phí",
    date: "2023-10-20T10:15:00",
    reference: "RD5679"
  }
];

const PointsContainer = styled(motion.div)`
  padding: 20px;
`;

const PointsTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const PointsSummaryCard = styled(StyledCard)`
  background: linear-gradient(135deg, #5dfa99, #6874f5);
  color: white;
  
  .ant-card-head {
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .ant-statistic-title, .ant-statistic-content {
    color: white;
  }
`;

const RewardsCard = styled(StyledCard)`
  background: linear-gradient(135deg, #fd6b0a, #ff9248);
  color: white;
  
  .ant-card-head {
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .ant-statistic-title, .ant-statistic-content {
    color: white;
  }
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: #f5f5f5;
    font-weight: 600;
  }
`;

const TypeTag = styled(Tag)`
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
`;

const EmptyText = styled.p`
  color: #888;
  margin-top: 16px;
  font-size: 16px;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  color: white;
  font-size: 12px;
`;

const RewardItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 6px;
`;

const RewardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const RewardInfo = styled.div`
  flex: 1;
`;

const RewardTitle = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const RewardPoints = styled.div`
  font-size: 12px;
  opacity: 0.8;
`;

const PointHistory: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [redeemedPoints, setRedeemedPoints] = useState(0);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setHistory(mockPointHistory);
      
      // Calculate summary
      let earned = 0;
      let redeemed = 0;
      
      mockPointHistory.forEach(item => {
        if (item.type === 'earn') {
          earned += item.amount;
        } else {
          redeemed += item.amount;
        }
      });
      
      setEarnedPoints(earned);
      setRedeemedPoints(redeemed);
      setTotalPoints(earned - redeemed);
      setLoading(false);
    }, 1000);
  }, []);

  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        let color = "green";
        let text = "Tích điểm";
        let icon = <ArrowUpOutlined />;
        
        if (type === "redeem") {
          color = "volcano";
          text = "Đổi điểm";
          icon = <ArrowDownOutlined />;
        }
        
        return (
          <TypeTag color={color} icon={icon}>
            {text}
          </TypeTag>
        );
      },
    },
    {
      title: "Điểm",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number, record: any) => {
        const prefix = record.type === "earn" ? "+" : "-";
        const color = record.type === "earn" ? "#52c41a" : "#f5222d";
        
        return <span style={{ color }}>{prefix}{amount}</span>;
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Thời gian",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  // Rewards data
  const rewards = [
    { title: "Combo bắp nước", points: 50, icon: "🍿" },
    { title: "Vé xem phim miễn phí", points: 100, icon: "🎬" },
    { title: "Giảm 50% vé xem phim", points: 75, icon: "🎟️" },
  ];

  // Calculate progress to next reward
  const nextReward = rewards.find(reward => reward.points > totalPoints) || rewards[0];
  const progressPercent = Math.min(Math.round((totalPoints / nextReward.points) * 100), 100);

  return (
    <PointsContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <PointsTitle>Lịch sử điểm tích lũy</PointsTitle>
      </motion.div>
      
      <Row gutter={24}>
        <Col xs={24} md={16}>
          <motion.div variants={itemVariants}>
            <PointsSummaryCard title="Tổng quan điểm tích lũy">
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic 
                    title="Điểm hiện có" 
                    value={totalPoints} 
                    prefix={<GiftOutlined />} 
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="Đã tích lũy" 
                    value={earnedPoints} 
                    prefix={<ArrowUpOutlined />} 
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="Đã sử dụng" 
                    value={redeemedPoints} 
                    prefix={<ArrowDownOutlined />} 
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Col>
              </Row>
              
              <Divider style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
              
              <div>
                <div style={{ color: 'white', marginBottom: '8px' }}>
                  Tiến độ đến ưu đãi tiếp theo: {nextReward.title}
                </div>
                <Progress 
                  percent={progressPercent} 
                  showInfo={false} 
                  strokeColor="#fff" 
                  trailColor="rgba(255, 255, 255, 0.2)" 
                />
                <ProgressLabel>
                  <span>{totalPoints} điểm</span>
                  <span>{nextReward.points} điểm</span>
                </ProgressLabel>
              </div>
            </PointsSummaryCard>
          </motion.div>
        </Col>
        
        <Col xs={24} md={8}>
          <motion.div variants={itemVariants}>
            <RewardsCard title="Ưu đãi khả dụng">
              {rewards.map((reward, index) => (
                <RewardItem key={index}>
                  <RewardIcon>{reward.icon}</RewardIcon>
                  <RewardInfo>
                    <RewardTitle>{reward.title}</RewardTitle>
                    <RewardPoints>{reward.points} điểm</RewardPoints>
                  </RewardInfo>
                </RewardItem>
              ))}
            </RewardsCard>
          </motion.div>
        </Col>
      </Row>
      
      <motion.div variants={itemVariants} style={{ marginTop: '24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : history.length > 0 ? (
          <StyledTable 
            columns={columns} 
            dataSource={history} 
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        ) : (
          <EmptyContainer>
            <Empty description={false} />
            <EmptyText>Bạn chưa có lịch sử điểm tích lũy nào</EmptyText>
          </EmptyContainer>
        )}
      </motion.div>
    </PointsContainer>
  );
};

export default PointHistory; 
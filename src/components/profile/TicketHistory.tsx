import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Empty, Spin, Tooltip, Modal, Divider } from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { QRCodeSVG } from "qrcode.react";

// Giả lập dữ liệu vé
const mockTickets = [
  {
    id: "TK12345",
    movieName: "Avengers: Endgame",
    date: "2023-10-15",
    time: "19:30",
    seats: ["G7", "G8"],
    theater: "CGV Vincom Center",
    room: "Cinema 3",
    totalPrice: 240000,
    status: "completed",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",
  },
  {
    id: "TK12346",
    movieName: "Joker",
    date: "2023-09-28",
    time: "20:15",
    seats: ["D5", "D6", "D7"],
    theater: "CGV Aeon Mall",
    room: "Cinema 5",
    totalPrice: 360000,
    status: "completed",
    poster:
      "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
  },
  {
    id: "TK12347",
    movieName: "Dune",
    date: "2023-11-05",
    time: "18:00",
    seats: ["H10"],
    theater: "CGV Vincom Center",
    room: "Cinema 1",
    totalPrice: 120000,
    status: "upcoming",
    poster:
      "https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg",
  },
];

const HistoryContainer = styled(motion.div)`
  padding: 20px;
`;

const HistoryTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: #f5f5f5;
    font-weight: 600;
  }

  .ant-table-row:hover {
    cursor: pointer;
  }
`;

const StatusTag = styled(Tag)`
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
`;

const ActionButton = styled(Button)`
  margin-right: 8px;
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

const TicketModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TicketHeader = styled.div`
  background: linear-gradient(135deg, #5dfa99, #6874f5);
  color: white;
  width: 100%;
  padding: 15px;
  text-align: center;
  border-radius: 8px 8px 0 0;
  margin-bottom: 20px;
`;

const TicketTitle = styled.h3`
  font-size: 18px;
  margin: 0;
`;

const TicketDetails = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 20px;
`;

const PosterContainer = styled.div`
  width: 120px;
  margin-right: 20px;
`;

const Poster = styled.img`
  width: 100%;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const DetailsContainer = styled.div`
  flex: 1;
`;

const MovieTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
`;

const DetailItem = styled.div`
  margin-bottom: 8px;
  display: flex;
  align-items: center;
`;

const DetailIcon = styled.span`
  margin-right: 8px;
  color: #fd6b0a;
`;

const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  padding: 15px;
  border: 1px dashed #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const QRLabel = styled.p`
  margin-top: 10px;
  color: #666;
  font-size: 12px;
`;

const SeatList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 5px;
`;

const Seat = styled.span`
  background-color: #f0f2f5;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
`;

const TicketFooter = styled.div`
  border-top: 1px dashed #ddd;
  padding-top: 15px;
  width: 100%;
  text-align: center;
  color: #888;
  font-size: 12px;
  margin-top: 20px;
`;

const TicketHistory: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTickets(mockTickets);
      setLoading(false);
    }, 1000);
  }, []);

  const showTicketDetails = (ticket: any) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  const columns = [
    {
      title: "Mã vé",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Phim",
      dataIndex: "movieName",
      key: "movieName",
    },
    {
      title: "Rạp",
      dataIndex: "theater",
      key: "theater",
    },
    {
      title: "Ngày chiếu",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Giờ chiếu",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "green";
        let text = "Đã hoàn thành";

        if (status === "upcoming") {
          color = "blue";
          text = "Sắp diễn ra";
        } else if (status === "cancelled") {
          color = "red";
          text = "Đã hủy";
        }

        return <StatusTag color={color}>{text}</StatusTag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: any) => (
        <>
          <Tooltip title="Xem chi tiết">
            <ActionButton
              type="primary"
              shape="circle"
              icon={<EyeOutlined />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                showTicketDetails(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Tải vé">
            <ActionButton
              type="default"
              shape="circle"
              icon={<DownloadOutlined />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                // Handle download ticket
              }}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <HistoryContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <HistoryTitle>Lịch sử đặt vé</HistoryTitle>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" />
        </div>
      ) : tickets.length > 0 ? (
        <StyledTable
          columns={columns}
          dataSource={tickets}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          onRow={(record) => ({
            onClick: () => showTicketDetails(record),
          })}
        />
      ) : (
        <EmptyContainer>
          <Empty description={false} />
          <EmptyText>Bạn chưa có lịch sử đặt vé nào</EmptyText>
        </EmptyContainer>
      )}

      <Modal
        title={null}
        open={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        width={500}
        centered
        bodyStyle={{ padding: 0 }}
      >
        {selectedTicket && (
          <TicketModalContent>
            <TicketHeader>
              <TicketTitle>Vé xem phim - {selectedTicket.id}</TicketTitle>
            </TicketHeader>

            <TicketDetails>
              <PosterContainer>
                <Poster
                  src={selectedTicket.poster}
                  alt={selectedTicket.movieName}
                />
              </PosterContainer>

              <DetailsContainer>
                <MovieTitle>{selectedTicket.movieName}</MovieTitle>

                <DetailItem>
                  <DetailIcon>
                    <CalendarOutlined />
                  </DetailIcon>
                  {dayjs(selectedTicket.date).format("DD/MM/YYYY")}
                </DetailItem>

                <DetailItem>
                  <DetailIcon>
                    <ClockCircleOutlined />
                  </DetailIcon>
                  {selectedTicket.time}
                </DetailItem>

                <DetailItem>
                  <DetailIcon>🏢</DetailIcon>
                  {selectedTicket.theater} - {selectedTicket.room}
                </DetailItem>

                <DetailItem>
                  <DetailIcon>💺</DetailIcon>
                  Ghế:
                  <SeatList>
                    {selectedTicket.seats.map((seat: string) => (
                      <Seat key={seat}>{seat}</Seat>
                    ))}
                  </SeatList>
                </DetailItem>

                <DetailItem>
                  <DetailIcon>💰</DetailIcon>
                  {selectedTicket.totalPrice?.toLocaleString("vi-VN")} VNĐ
                </DetailItem>
              </DetailsContainer>
            </TicketDetails>

            <QRContainer>
              <QRCodeSVG
                value={`TICKET:${selectedTicket.id}`}
                size={128}
                level="H"
                includeMargin={true}
              />
              <QRLabel>Quét mã QR để xác thực vé</QRLabel>
            </QRContainer>

            <TicketFooter>
              <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            </TicketFooter>
          </TicketModalContent>
        )}
      </Modal>
    </HistoryContainer>
  );
};

export default TicketHistory;

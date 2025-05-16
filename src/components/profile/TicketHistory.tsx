import React, { useState, useEffect } from "react";
import { Table, Button, Empty, Spin, Tooltip, Modal, Divider, Tag } from "antd";
import {
  EyeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { QRCodeSVG } from "qrcode.react";
import { useDispatch, useSelector } from "react-redux";
import { getTicketHistoryRequest } from "../../redux/slices/ticketSlice";
import { RootState } from "../../redux/store";
import { ColumnsType } from "antd/lib/table";

// Updated TicketHistoryDTO to match the actual flat data structure
interface TicketHistoryDTO {
  id: number;
  movieName: string;
  date: string;
  cinemaName: string;
  startTime: string;
  // Add other fields as needed
}

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
    background-color: #f8f8f8;
  }
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
  padding-bottom: 20px;
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
  padding: 0 20px;
`;

const DetailsContainer = styled.div`
  flex: 1;
`;

const MovieTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
`;

const DetailItem = styled.div`
  margin-bottom: 12px;
  display: flex;
  align-items: center;
`;

const DetailIcon = styled.span`
  margin-right: 10px;
  color: #fd6b0a;
  font-size: 16px;
`;

const DetailLabel = styled.span`
  font-weight: bold;
  margin-right: 8px;
  color: #555;
`;

const DetailValue = styled.span`
  color: #333;
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
  width: 90%;
`;

const QRLabel = styled.p`
  margin-top: 10px;
  color: #666;
  font-size: 14px;
`;

const StatusTag = styled(Tag)`
  margin-left: 10px;
`;

const TicketFooter = styled.div`
  border-top: 1px dashed #ddd;
  padding-top: 15px;
  width: 90%;
  text-align: center;
  color: #888;
  font-size: 13px;
  margin-top: 20px;
`;

const TicketHistory: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    data: tickets,
    loading,
    error,
  } = useSelector((state: RootState) => state.ticket.ticketHistory);
  const [selectedTicket, setSelectedTicket] = useState<TicketHistoryDTO | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      // Convert user.id to number if it's a string
      const userId =
        typeof user.id === "string" ? parseInt(user.id, 10) : user.id;
      dispatch(getTicketHistoryRequest(userId));
    }
  }, [dispatch, user]);

  const showTicketDetails = (ticket: TicketHistoryDTO) => {
    setSelectedTicket(ticket);
    setModalVisible(true);
  };

  const columns: ColumnsType<TicketHistoryDTO> = [
    {
      title: "Mã vé",
      dataIndex: "id",
      key: "id",
      render: (id: number) => <span>#{id}</span>,
    },
    {
      title: "Phim",
      dataIndex: "movieName",
      key: "movieName",
      render: (name: string) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: "Rạp chiếu",
      dataIndex: "cinemaName",
      key: "cinemaName",
    },
    {
      title: "Ngày chiếu",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Giờ chiếu",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <ActionButton
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              showTicketDetails(record);
            }}
          >
            Chi tiết
          </ActionButton>
        </Tooltip>
      ),
    },
  ];

  const getStatusTag = (date: string) => {
    const ticketDate = dayjs(date);
    const today = dayjs();

    if (ticketDate.isBefore(today, "day")) {
      return <StatusTag color="green">Đã sử dụng</StatusTag>;
    } else if (ticketDate.isSame(today, "day")) {
      return <StatusTag color="blue">Hôm nay</StatusTag>;
    } else {
      return <StatusTag color="orange">Sắp tới</StatusTag>;
    }
  };

  if (loading) {
    return (
      <EmptyContainer>
        <Spin size="large" />
      </EmptyContainer>
    );
  }

  if (error) {
    return (
      <EmptyContainer>
        <Empty
          description={
            <EmptyText>
              Đã xảy ra lỗi khi tải lịch sử đặt vé. Vui lòng thử lại sau.
            </EmptyText>
          }
        />
      </EmptyContainer>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <EmptyContainer>
        <Empty
          description={
            <EmptyText>
              Bạn chưa có lịch sử đặt vé nào. Hãy đặt vé và quay lại sau!
            </EmptyText>
          }
        />
      </EmptyContainer>
    );
  }

  // Sort tickets by date (newest first)
  const sortedTickets = [...tickets].sort((a, b) => {
    return dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
  });

  return (
    <HistoryContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HistoryTitle>Lịch sử đặt vé của bạn</HistoryTitle>

      <StyledTable<TicketHistoryDTO>
        columns={columns}
        dataSource={sortedTickets.map((ticket) => ({
          ...ticket,
          key: ticket.id,
        }))}
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => showTicketDetails(record),
        })}
      />

      {selectedTicket && (
        <Modal
          title={null}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={500}
          style={{ borderRadius: 8 }}
          bodyStyle={{ padding: 0 }}
        >
          <TicketModalContent>
            <TicketHeader>
              <TicketTitle>Chi tiết vé xem phim</TicketTitle>
            </TicketHeader>

            <TicketDetails>
              <DetailsContainer>
                <MovieTitle>{selectedTicket.movieName}</MovieTitle>
                <DetailItem>
                  <DetailIcon>
                    <CalendarOutlined />
                  </DetailIcon>
                  <DetailLabel>Ngày chiếu:</DetailLabel>
                  <DetailValue>
                    {dayjs(selectedTicket.date).format("DD/MM/YYYY")}
                  </DetailValue>
                  {getStatusTag(selectedTicket.date)}
                </DetailItem>
                <DetailItem>
                  <DetailIcon>
                    <ClockCircleOutlined />
                  </DetailIcon>
                  <DetailLabel>Giờ chiếu:</DetailLabel>
                  <DetailValue>{selectedTicket.startTime}</DetailValue>
                </DetailItem>
                <Divider style={{ margin: "15px 0" }} />
                <DetailItem>
                  <DetailIcon>
                    <EnvironmentOutlined />
                  </DetailIcon>
                  <DetailLabel>Rạp chiếu:</DetailLabel>
                  <DetailValue>{selectedTicket.cinemaName}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailIcon>
                    <VideoCameraOutlined />
                  </DetailIcon>
                  <DetailLabel>Mã vé:</DetailLabel>
                  <DetailValue>#{selectedTicket.id}</DetailValue>
                </DetailItem>
              </DetailsContainer>
            </TicketDetails>

            <QRContainer>
              <QRCodeSVG
                value={`TICKET-${selectedTicket.id}-MOVIE-${selectedTicket.movieName}-DATE-${selectedTicket.date}`}
                size={180}
                level="H"
                includeMargin={true}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
              />
              <QRLabel>Mã vé: #{selectedTicket.id}</QRLabel>
            </QRContainer>

            <TicketFooter>
              <p>Vui lòng xuất trình mã QR này khi đến rạp</p>
              <p>Chúc bạn có một trải nghiệm xem phim vui vẻ!</p>
            </TicketFooter>
          </TicketModalContent>
        </Modal>
      )}
    </HistoryContainer>
  );
};

export default TicketHistory;

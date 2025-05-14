import React from "react";
import { Table, Space, Button, Tooltip, Popconfirm, Tag, Image } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Movie } from "../../pages/admin/MovieManagement";

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledTag = styled(Tag)`
  margin: 4px;
`;

const RatingBar = styled.div<{ rating: number }>`
  width: 50px;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${(props: { rating: number }) => (props.rating / 10) * 100}%;
    background-color: ${(props: { rating: number }) =>
      props.rating >= 8
        ? "#52c41a"
        : props.rating >= 6
        ? "#faad14"
        : "#ff4d4f"};
    transition: width 0.3s ease;
  }
`;

interface MovieTableProps {
  movies: Movie[];
  loading: boolean;
  onEdit: (movie: Movie) => void;
  onView: (movie: Movie) => void;
  onDelete: (id: number) => void;
  selectedRowKeys: React.Key[];
  onSelectChange: (selectedKeys: React.Key[]) => void;
  deleteLoading?: boolean;
}

const MovieTable: React.FC<MovieTableProps> = ({
  movies,
  loading,
  onEdit,
  onView,
  onDelete,
  selectedRowKeys,
  onSelectChange,
  deleteLoading,
}) => {
  const getStatusColor = (status: string | number) => {
    if (typeof status === "number") {
      switch (status) {
        case 1:
          return "green";
        case 2:
          return "blue";
        case 3:
          return "gray";
        default:
          return "default";
      }
    } else {
      switch (status) {
        case "Đang chiếu":
          return "green";
        case "Sắp chiếu":
          return "blue";
        case "Đã chiếu":
          return "gray";
        default:
          return "default";
      }
    }
  };

  const getStatusText = (status: string | number) => {
    if (typeof status === "number") {
      switch (status) {
        case 1:
          return "Đang chiếu";
        case 2:
          return "Sắp chiếu";
        case 3:
          return "Đã chiếu";
        default:
          return "Không xác định";
      }
    }
    return status;
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Poster",
      dataIndex: "poster",
      key: "poster",
      width: 100,
      render: (poster: string) => (
        <Image
          src={poster}
          alt="Movie poster"
          style={{ width: 50, height: 75, objectFit: "cover" }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg"
        />
      ),
    },
    {
      title: "Tên phim",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Movie) => (
        <a onClick={() => onView(record)}>{text}</a>
      ),
    },
    {
      title: "Đạo diễn",
      dataIndex: "director",
      key: "director",
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      key: "duration",
      render: (duration: number) => `${duration} phút`,
    },
    {
      title: "Thể loại",
      dataIndex: "genre",
      key: "genre",
      render: (genres: string[]) => (
        <>
          {genres?.map((genre) => (
            <StyledTag key={genre}>{genre}</StyledTag>
          ))}
        </>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string | number) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: 8 }}>{rating}/10</span>
          <RatingBar rating={rating} />
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_: any, record: Movie) => (
        <Space size="small">
          <Tooltip title="Xem">
            <ActionButton
              type="default"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <ActionButton
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa phim này?"
              onConfirm={() => onDelete(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <ActionButton
                type="default"
                danger
                icon={<DeleteOutlined />}
                size="small"
                loading={deleteLoading && selectedRowKeys.includes(record.id)}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={movies}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
      scroll={{ x: 1200 }}
    />
  );
};

export default MovieTable;

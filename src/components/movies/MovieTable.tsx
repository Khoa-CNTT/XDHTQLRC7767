import React from "react";
import {
  Table,
  Space,
  Button,
  Tooltip,
  Popconfirm,
  Tag,
  Image,
  Switch,
} from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Movie } from "../../pages/admin/MovieManagement";

// Định nghĩa interface cho movieGenres từ API
interface MovieGenre {
  id: number;
  name: string;
}

// Mở rộng Movie interface để bao gồm thuộc tính genre từ Redux
interface ExtendedMovie extends Movie {
  genre?: string[];
}

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
  onStatusChange?: (id: number, status: number) => void;
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
  onStatusChange,
}) => {
  const getStatusColor = (status: string | number) => {
    if (typeof status === "number") {
      switch (status) {
        case 0:
          return "blue"; // Sắp chiếu
        case 1:
          return "green"; // Đang chiếu
        case 2:
          return "gray"; // Đã chiếu
        default:
          return "default";
      }
    } else {
      switch (status) {
        case "Active":
          return "green";
        case "Inactive":
          return "red";
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
        case 0:
          return "Sắp chiếu";
        case 1:
          return "Đang chiếu";
        case 2:
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
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      render: (imageUrl: string, record: Movie) => (
        <Image
          src={imageUrl || record.poster}
          alt="Movie poster"
          style={{ width: 50, height: 75, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Tên phim",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Movie) => (
        <a onClick={() => onView(record)}>{text || record.title}</a>
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
      key: "genre",
      render: (_: unknown, record: Movie) => {
        const movieRecord = record as ExtendedMovie;

        // 1. Check if record has genres property (direct from network response)
        if (record.genres && Array.isArray(record.genres)) {
          return (
            <>
              {record.genres.map((genre: MovieGenre) => (
                <StyledTag key={genre.id}>{genre.name}</StyledTag>
              ))}
            </>
          );
        }
        // 2. Check if record has movieGenres property (direct API response)
        else if (record.movieGenres && Array.isArray(record.movieGenres)) {
          return (
            <>
              {record.movieGenres.map((genre: MovieGenre) => (
                <StyledTag key={genre.id}>{genre.name}</StyledTag>
              ))}
            </>
          );
        }
        // 3. Check if record has genre property (transformed in Redux)
        else if (movieRecord.genre && Array.isArray(movieRecord.genre)) {
          return (
            <>
              {movieRecord.genre.map((genreName: string, index: number) => (
                <StyledTag key={index}>{genreName}</StyledTag>
              ))}
            </>
          );
        }
        // Fallback
        return null;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string | number, record: Movie) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {status == 0 ? (
            <Tag color={getStatusColor(status)}>
              {getStatusText("Sắp chiếu")}
            </Tag>
          ) : (
            <Tag color={getStatusColor(status)}>
              {getStatusText("Đang chiếu")}
            </Tag>
          )}
        </div>
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
      render: (_: unknown, record: Movie) => (
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

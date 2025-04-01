import React from "react";
import { Row, Col, Typography, Tag, Image } from "antd";
import styled from "styled-components";
import { Movie } from "../../pages/admin/MovieManagement";

const { Title, Text } = Typography;

const StyledTag = styled(Tag)`
  margin: 4px;
`;

const DetailItem = styled.div`
  margin-bottom: 16px;
`;

const DetailLabel = styled(Text)`
  font-weight: 600;
  margin-right: 8px;
`;

interface MovieDetailProps {
  movie: Movie;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movie }) => {
  const getStatusColor = (status: string) => {
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
  };

  return (
    <Row gutter={[24, 16]}>
      <Col span={8}>
        <Image
          src={movie.poster}
          alt={movie.title}
          style={{ width: "100%", borderRadius: 8 }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg"
        />
      </Col>
      <Col span={16}>
        <Title level={3}>{movie.title}</Title>
        
        <DetailItem>
          <DetailLabel>Đạo diễn:</DetailLabel>
          <Text>{movie.director}</Text>
        </DetailItem>
        
        <DetailItem>
          <DetailLabel>Thời lượng:</DetailLabel>
          <Text>{movie.duration} phút</Text>
        </DetailItem>
        
        <DetailItem>
          <DetailLabel>Ngày phát hành:</DetailLabel>
          <Text>{movie.releaseDate}</Text>
        </DetailItem>
        
        <DetailItem>
          <DetailLabel>Trạng thái:</DetailLabel>
          <Tag color={getStatusColor(movie.status || "")} style={{ marginLeft: 8 }}>
            {movie.status}
          </Tag>
        </DetailItem>
        
        <DetailItem>
          <DetailLabel>Thể loại:</DetailLabel>
          <div style={{ marginTop: 8 }}>
            {movie.genre?.map((g) => (
              <StyledTag key={g}>{g}</StyledTag>
            ))}
          </div>
        </DetailItem>
        
        <DetailItem>
          <DetailLabel>Đánh giá:</DetailLabel>
          <Text>{movie.rating}/10</Text>
        </DetailItem>
        
        <DetailItem>
          <DetailLabel>Mô tả:</DetailLabel>
          <div style={{ marginTop: 8 }}>
            <Text>{movie.description}</Text>
          </div>
        </DetailItem>
      </Col>
    </Row>
  );
};

export default MovieDetail; 
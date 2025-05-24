import React, { useState, useEffect } from "react";
import {
  Form,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Divider,
  Input,
} from "antd";
import styled from "styled-components";
import { FilterValues } from "../../pages/admin/MovieManagement";
import axiosInstance from "../../utils/axiosConfig";

const { Option } = Select;
const { RangePicker } = DatePicker;

const FilterContainer = styled.div`
  margin: 16px 0;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
`;

interface MovieFilterProps {
  onFilterChange: (values: FilterValues) => void;
  initialValues: FilterValues;
}

// Define Genre interface
interface Genre {
  id: number;
  name: string;
}

const MovieFilter: React.FC<MovieFilterProps> = ({
  onFilterChange,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch genres from API
  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/api/genres");
        setGenres(response.data);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
        // Use default genres if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleReset = () => {
    form.resetFields();
    onFilterChange({
      status: null,
      genres: [],
      dateRange: null,
      director: undefined,
    });
  };

  const handleFinish = (values: any) => {
    onFilterChange(values);
  };

  return (
    <FilterContainer>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleFinish}
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="status" label="Trạng thái">
              <Select placeholder="Chọn trạng thái" allowClear>
                <Option value={0}>Sắp chiếu</Option>
                <Option value={1}>Đang chiếu</Option>
                <Option value={2}>Đã chiếu</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="genres" label="Thể loại">
              <Select
                mode="multiple"
                placeholder="Chọn thể loại"
                allowClear
                loading={loading}
              >
                {genres.map((genre) => (
                  <Option key={genre.id} value={genre.name}>
                    {genre.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item name="director" label="Đạo diễn">
              <Input placeholder="Tìm theo đạo diễn" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item name="dateRange" label="Ngày phát hành">
              <RangePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={12}
            style={{ textAlign: "right", alignSelf: "flex-end" }}
          >
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Áp dụng bộ lọc
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                Xóa bộ lọc
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </FilterContainer>
  );
};

export default MovieFilter;

import React from "react";
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

const MovieFilter: React.FC<MovieFilterProps> = ({
  onFilterChange,
  initialValues,
}) => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
    onFilterChange({
      status: null,
      genres: [],
      dateRange: null,
      director: undefined,
      actor: undefined,
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
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="status" label="Trạng thái">
              <Select placeholder="Chọn trạng thái" allowClear>
                <Option value="Đang chiếu">Đang chiếu</Option>
                <Option value="Sắp chiếu">Sắp chiếu</Option>
                <Option value="Đã chiếu">Đã chiếu</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="genres" label="Thể loại">
              <Select mode="multiple" placeholder="Chọn thể loại" allowClear>
                <Option value="Hành động">Hành động</Option>
                <Option value="Phiêu lưu">Phiêu lưu</Option>
                <Option value="Hoạt hình">Hoạt hình</Option>
                <Option value="Hài">Hài</Option>
                <Option value="Tội phạm">Tội phạm</Option>
                <Option value="Tài liệu">Tài liệu</Option>
                <Option value="Chính kịch">Chính kịch</Option>
                <Option value="Gia đình">Gia đình</Option>
                <Option value="Giả tưởng">Giả tưởng</Option>
                <Option value="Lịch sử">Lịch sử</Option>
                <Option value="Kinh dị">Kinh dị</Option>
                <Option value="Âm nhạc">Âm nhạc</Option>
                <Option value="Bí ẩn">Bí ẩn</Option>
                <Option value="Lãng mạn">Lãng mạn</Option>
                <Option value="Khoa học viễn tưởng">Khoa học viễn tưởng</Option>
                <Option value="Chiến tranh">Chiến tranh</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="director" label="Đạo diễn">
              <Input placeholder="Tìm theo đạo diễn" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="actor" label="Diễn viên">
              <Input placeholder="Tìm theo diễn viên" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item name="dateRange" label="Ngày phát hành">
              <RangePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Divider style={{ margin: "12px 0" }} />
        <div style={{ textAlign: "right" }}>
          <Button onClick={handleReset} style={{ marginRight: 8 }}>
            Đặt lại bộ lọc
          </Button>
          <Button type="primary" htmlType="submit">
            Áp dụng
          </Button>
        </div>
      </Form>
    </FilterContainer>
  );
};

export default MovieFilter;

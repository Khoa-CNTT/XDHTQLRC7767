import React from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Space,
  Upload,
  message,
} from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import styled from "styled-components";
import dayjs from "dayjs";
import { Movie } from "../../pages/admin/MovieManagement";
import type { UploadProps, FormInstance } from "antd";
import { Row, Col } from "antd";

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const FormSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 16px;
  color: #333;
`;

interface MovieFormProps {
  form: FormInstance;
  onFinish: (values: any) => void;
  initialValues: Movie | null;
  onCancel?: () => void;
  loading?: boolean;
}

const MovieForm: React.FC<MovieFormProps> = ({
  form,
  onFinish,
  initialValues,
  onCancel,
  loading,
}) => {
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
      }
      if (status === "done") {
        message.success(`${info.file.name} tải lên thành công.`);
      } else if (status === "error") {
        message.error(`${info.file.name} tải lên thất bại.`);
      }
    },
    onDrop(e) {},
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        status: "Sắp chiếu",
        genre: [],
        ...initialValues,
        releaseDate: initialValues?.releaseDate
          ? dayjs(initialValues.releaseDate)
          : null,
      }}
    >
      <FormSection>
        <SectionTitle>Thông tin cơ bản</SectionTitle>
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="title"
              label="Tên phim"
              rules={[{ required: true, message: "Vui lòng nhập tên phim!" }]}
            >
              <Input placeholder="Nhập tên phim" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="duration"
              label="Thời lượng (phút)"
              rules={[{ required: true, message: "Vui lòng nhập thời lượng!" }]}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="Nhập thời lượng"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="director"
              label="Đạo diễn"
              rules={[
                { required: true, message: "Vui lòng nhập tên đạo diễn!" },
              ]}
            >
              <Input placeholder="Nhập tên đạo diễn" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="releaseDate"
              label="Ngày phát hành"
              rules={[
                { required: true, message: "Vui lòng chọn ngày phát hành!" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value={1}>Đang chiếu</Option>
                <Option value={2}>Sắp chiếu</Option>
                <Option value={3}>Đã chiếu</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="rating" label="Đánh giá (0-10)">
              <InputNumber
                min={0}
                max={10}
                step={0.1}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="genre"
          label="Thể loại"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn ít nhất một thể loại!",
            },
          ]}
        >
          <Select mode="multiple" placeholder="Chọn thể loại">
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
      </FormSection>

      <FormSection>
        <SectionTitle>Mô tả & Hình ảnh</SectionTitle>
        <Form.Item
          name="description"
          label="Mô tả phim"
          rules={[{ required: true, message: "Vui lòng nhập mô tả phim!" }]}
        >
          <TextArea rows={4} placeholder="Nhập mô tả phim" />
        </Form.Item>

        <Form.Item
          name="poster"
          label="Poster phim"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Dragger maxCount={1} listType="picture" accept="image/*">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Nhấp hoặc kéo file vào khu vực này để tải lên
            </p>
            <p className="ant-upload-hint">Hỗ trợ tải lên một file hình ảnh</p>
          </Dragger>
        </Form.Item>
      </FormSection>

      <div style={{ textAlign: "right", marginTop: 24 }}>
        <Button
          onClick={onCancel}
          style={{ marginRight: 8 }}
          disabled={loading}
        >
          Hủy
        </Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? "Cập nhật" : "Thêm mới"}
        </Button>
      </div>
    </Form>
  );
};

export default MovieForm;

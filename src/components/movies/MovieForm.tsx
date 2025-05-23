import React, { useState, useEffect } from "react";
import { Form, Input, Select, DatePicker, InputNumber, Button } from "antd";
import styled from "styled-components";
import dayjs from "dayjs";
import { Movie } from "../../pages/admin/MovieManagement";
import type { FormInstance } from "antd";
import { Row, Col } from "antd";
import CloudinaryUpload from "../common/CloudinaryUpload";
import axiosInstance from "../../utils/axiosConfig";

const { Option } = Select;
const { TextArea } = Input;

const FormSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 16px;
  color: #333;
`;

// Define Genre interface
interface Genre {
  id: number;
  name: string;
}

// Extended Movie interface to include genreIds and API fields
interface ExtendedMovie extends Movie {
  genreIds?: number[];
  name?: string; // API field
  imageUrl?: string; // API field
}

interface MovieFormProps {
  form: FormInstance;
  onFinish: (values: ExtendedMovie) => void;
  initialValues: ExtendedMovie | null;
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
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genresLoading, setGenresLoading] = useState(false);

  // Fetch genres from API
  useEffect(() => {
    const fetchGenres = async () => {
      setGenresLoading(true);
      try {
        const response = await axiosInstance.get("/api/genres");
        setGenres(response.data);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
        // Use default genres if API fails
        setGenres([
          { id: 1, name: "Hành động" },
          { id: 2, name: "Phiêu lưu" },
          { id: 3, name: "Hoạt hình" },
          { id: 4, name: "Hài" },
          { id: 5, name: "Tội phạm" },
          { id: 6, name: "Tài liệu" },
          { id: 7, name: "Chính kịch" },
          { id: 8, name: "Gia đình" },
          { id: 9, name: "Giả tưởng" },
          { id: 10, name: "Lịch sử" },
          { id: 11, name: "Kinh dị" },
          { id: 12, name: "Âm nhạc" },
          { id: 13, name: "Bí ẩn" },
          { id: 14, name: "Lãng mạn" },
          { id: 15, name: "Khoa học viễn tưởng" },
          { id: 16, name: "Chiến tranh" },
        ]);
      } finally {
        setGenresLoading(false);
      }
    };

    fetchGenres();
  }, []);

  // Custom form submission handler to format data properly for API
  const handleFormSubmit = (
    values: Partial<ExtendedMovie & { releaseDate: unknown }>
  ) => {
    // Format the release date for API
    const { genre, ...restValues } = values;
    const formattedValues = {
      ...restValues,
      releaseDate: restValues.releaseDate
        ? dayjs.isDayjs(restValues.releaseDate)
          ? restValues.releaseDate.format("YYYY-MM-DD")
          : restValues.releaseDate
        : undefined,
      // Extract releaseYear from the date for API compatibility
      releaseYear: restValues.releaseDate
        ? dayjs.isDayjs(restValues.releaseDate)
          ? restValues.releaseDate.year()
          : new Date(String(restValues.releaseDate)).getFullYear()
        : undefined,
      // Use genre IDs directly instead of mapping from names
      genreIds: (genre || []) as number[],
      // Map poster to imageUrl (needed for API compatibility)
      imageUrl: restValues.poster,
      // Map backdrop to backdropUrl (needed for API compatibility)
      backdrop: restValues.backdrop,
    };

    onFinish(formattedValues as ExtendedMovie);
  };

  // Map initial genreIds to genre IDs for form display
  useEffect(() => {
    // Xử lý cả genreIds và movieGenres/genres từ API
    if (initialValues) {
      // Sử dụng type assertion để tránh lỗi TypeScript
      const genreIds =
        initialValues.genreIds ||
        initialValues.movieGenres?.map((g) => g.id) ||
        (initialValues.genres?.map((g) => Number(g.id)) as
          | number[]
          | undefined) ||
        [];

      if (genreIds.length > 0 && genres.length > 0) {
        form.setFieldsValue({ genre: genreIds });
      }
    }
  }, [initialValues, genres, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFormSubmit}
      initialValues={{
        status: 0, // Sắp chiếu mặc định
        genre: [],
        ...(initialValues
          ? {
              ...initialValues,
              // Xử lý các trường name/title từ API
              title: initialValues.title || initialValues.name,
              poster: initialValues.poster || initialValues.imageUrl,
              releaseDate: initialValues.releaseDate
                ? dayjs(initialValues.releaseDate)
                : null,
            }
          : {}),
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
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value={0}>Sắp chiếu</Option>
                <Option value={1}>Đang chiếu</Option>
                <Option value={2}>Đã chiếu</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
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
          <Col span={12}>
            <Form.Item name="country" label="Quốc gia">
              <Input placeholder="Nhập quốc gia sản xuất" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="language" label="Ngôn ngữ">
              <Input placeholder="Nhập ngôn ngữ phim" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="subtitle" label="Phụ đề">
              <Input placeholder="Nhập phụ đề phim" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="ageLimit" label="Giới hạn tuổi">
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Nhập giới hạn tuổi"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="actor" label="Diễn viên">
              <Input placeholder="Nhập danh sách diễn viên" />
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
          <Select
            mode="multiple"
            placeholder="Chọn thể loại"
            loading={genresLoading}
          >
            {genres.map((genre) => (
              <Option key={genre.id} value={genre.id}>
                {genre.name}
              </Option>
            ))}
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

        <Form.Item name="content" label="Nội dung">
          <TextArea rows={4} placeholder="Nhập nội dung chi tiết của phim" />
        </Form.Item>

        <Form.Item
          name="poster"
          label="Poster phim"
          rules={[{ required: true, message: "Vui lòng tải lên poster phim!" }]}
        >
          <CloudinaryUpload
            label="Tải lên poster phim"
            value={initialValues?.poster || ""}
            onChange={(url) => form.setFieldValue("poster", url)}
          />
        </Form.Item>

        <Form.Item
          name="backdrop"
          label="Hình nền phim"
          rules={[
            { required: true, message: "Vui lòng tải lên hình nền phim!" },
          ]}
        >
          <CloudinaryUpload
            label="Tải lên hình nền phim"
            value={initialValues?.backdrop || ""}
            onChange={(url) => form.setFieldValue("backdrop", url)}
          />
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

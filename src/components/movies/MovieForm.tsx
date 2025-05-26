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
  imageUrl?: string; // API field cho poster
  backdropUrl?: string; // API field cho backdrop
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
  const [posterUrl, setPosterUrl] = useState<string>("");
  const [backdropUrl, setBackdropUrl] = useState<string>("");
  const [formKey, setFormKey] = useState<number>(0); // Thêm key để force re-render form

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

  // Force re-render khi initialValues thay đổi
  useEffect(() => {
    // Tăng key để force re-render form
    setFormKey((prev) => prev + 1);

    // Reset hoàn toàn
    resetAllData();
  }, [initialValues]);

  // Hoàn toàn reset form và ảnh khi component được mount hoặc unmount
  useEffect(() => {
    // Reset khi component mount
    resetAllData();

    // Reset khi component unmount
    return () => {
      resetAllData();
    };
  }, []);

  // Cập nhật URL hình ảnh khi initialValues thay đổi
  useEffect(() => {
    // Reset poster và backdrop URLs khi initialValues thay đổi
    if (initialValues) {
      setPosterUrl(initialValues.poster || initialValues.imageUrl || "");
      setBackdropUrl(initialValues.backdrop || initialValues.backdropUrl || "");
    } else {
      // Reset hoàn toàn khi không có initialValues
      setPosterUrl("");
      setBackdropUrl("");
    }
  }, [initialValues]);

  // Function để reset tất cả dữ liệu
  const resetAllData = () => {
    setPosterUrl("");
    setBackdropUrl("");
    form.resetFields();
  };

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
      genreIds: (genre || []).map((id) =>
        typeof id === "string" ? parseInt(id, 10) : id
      ),
      // Đảm bảo cả hai tên trường đều được gửi về API để tương thích
      imageUrl: restValues.poster, // Đảm bảo API có imageUrl
      poster: restValues.poster, // Đảm bảo API có poster
      backdrop: restValues.backdrop,
      backdropUrl: restValues.backdrop, // Đảm bảo API có backdropUrl
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

  // Tạo hàm reset ảnh để sử dụng khi cần
  const resetImages = () => {
    setPosterUrl("");
    setBackdropUrl("");
  };

  // Gắn hàm resetImages vào onCancel để đảm bảo ảnh được xóa khi hủy
  const handleCancel = () => {
    resetImages();
    resetAllData();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Form
      key={formKey} // Thêm key để force re-render form
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
              // Xử lý nhất quán cho poster và backdrop
              poster: initialValues.poster || initialValues.imageUrl,
              backdrop: initialValues.backdrop || initialValues.backdropUrl,
              releaseDate: initialValues.releaseDate
                ? dayjs(initialValues.releaseDate)
                : null,
            }
          : {}),
      }}
      validateMessages={{
        required: "${label} không được để trống!",
        types: {
          number: "${label} phải là số!",
          date: "${label} không hợp lệ!",
        },
        number: {
          min: "${label} không được nhỏ hơn ${min}!",
          max: "${label} không được lớn hơn ${max}!",
        },
        string: {
          min: "${label} phải có ít nhất ${min} ký tự!",
          max: "${label} không được vượt quá ${max} ký tự!",
        },
      }}
    >
      <FormSection>
        <SectionTitle>Thông tin cơ bản</SectionTitle>
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="title"
              label="Tên phim"
              rules={[
                { required: true, message: "Vui lòng nhập tên phim!" },
                { min: 2, max: 200, message: "Tên phim phải từ 2-200 ký tự!" },
                {
                  validator: (_, value) => {
                    if (!value || value.trim() === "")
                      return Promise.reject(
                        "Tên phim không được chỉ chứa khoảng trắng!"
                      );
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="Nhập tên phim" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="duration"
              label="Thời lượng (phút)"
              rules={[
                { required: true, message: "Vui lòng nhập thời lượng!" },
                {
                  type: "number",
                  min: 1,
                  max: 1000,
                  message: "Thời lượng phải từ 1-1000 phút!",
                },
              ]}
            >
              <InputNumber
                min={1}
                max={1000}
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
                {
                  min: 2,
                  max: 100,
                  message: "Tên đạo diễn phải từ 2-100 ký tự!",
                },
                {
                  validator: (_, value) => {
                    if (!value || value.trim() === "")
                      return Promise.reject(
                        "Tên đạo diễn không được chỉ chứa khoảng trắng!"
                      );
                    return Promise.resolve();
                  },
                },
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
                { type: "date", message: "Ngày không hợp lệ!" },
                {
                  validator: (_, value) => {
                    if (value && dayjs(value).isAfter(dayjs().add(5, "year"))) {
                      return Promise.reject(
                        "Ngày phát hành không được quá 5 năm từ hiện tại"
                      );
                    }
                    if (value && dayjs(value).isBefore(dayjs("1900-01-01"))) {
                      return Promise.reject(
                        "Ngày phát hành không được trước năm 1900"
                      );
                    }
                    return Promise.resolve();
                  },
                },
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
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="rating"
              label="Đánh giá (0-10)"
              rules={[
                {
                  type: "number",
                  min: 0,
                  max: 10,
                  message: "Đánh giá phải từ 0-10!",
                },
              ]}
            >
              <InputNumber
                min={0}
                max={10}
                step={0.1}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="country"
              label="Quốc gia"
              rules={[
                { required: true, message: "Vui lòng nhập quốc gia!" },
                {
                  max: 50,
                  message: "Tên quốc gia không được vượt quá 50 ký tự!",
                },
                {
                  validator: (_, value) => {
                    if (value && value.trim() === "")
                      return Promise.reject(
                        "Quốc gia không được chỉ chứa khoảng trắng!"
                      );
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="Nhập quốc gia sản xuất" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="language"
              label="Ngôn ngữ"
              rules={[
                { required: true, message: "Vui lòng nhập ngôn ngữ!" },
                { max: 50, message: "Ngôn ngữ không được vượt quá 50 ký tự!" },
                {
                  validator: (_, value) => {
                    if (value && value.trim() === "")
                      return Promise.reject(
                        "Ngôn ngữ không được chỉ chứa khoảng trắng!"
                      );
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="Nhập ngôn ngữ phim" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="subtitle"
              label="Phụ đề"
              rules={[
                { max: 50, message: "Phụ đề không được vượt quá 50 ký tự!" },
                {
                  validator: (_, value) => {
                    if (value && value.trim() === "")
                      return Promise.reject(
                        "Phụ đề không được chỉ chứa khoảng trắng!"
                      );
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="Nhập phụ đề phim" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="ageLimit"
              label="Giới hạn tuổi"
              rules={[
                { required: true, message: "Vui lòng nhập giới hạn tuổi!" },
                {
                  type: "number",
                  min: 0,
                  max: 21,
                  message: "Giới hạn tuổi phải từ 0-21!",
                },
              ]}
            >
              <InputNumber
                min={0}
                max={21}
                style={{ width: "100%" }}
                placeholder="Nhập giới hạn tuổi"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="actor"
              label="Diễn viên"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập danh sách diễn viên!",
                },
                {
                  max: 500,
                  message: "Danh sách diễn viên không được vượt quá 500 ký tự!",
                },
                {
                  validator: (_, value) => {
                    if (value && value.trim() === "")
                      return Promise.reject(
                        "Danh sách diễn viên không được chỉ chứa khoảng trắng!"
                      );
                    return Promise.resolve();
                  },
                },
              ]}
            >
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
              type: "array",
              min: 1,
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
          rules={[
            { required: true, message: "Vui lòng nhập mô tả phim!" },
            {
              min: 20,
              max: 2000,
              message: "Mô tả phim phải từ 20-2000 ký tự!",
            },
            {
              validator: (_, value) => {
                if (value && value.trim() === "")
                  return Promise.reject(
                    "Mô tả phim không được chỉ chứa khoảng trắng!"
                  );
                return Promise.resolve();
              },
            },
          ]}
        >
          <TextArea rows={4} placeholder="Nhập mô tả phim" />
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung"
          rules={[
            { max: 5000, message: "Nội dung không được vượt quá 5000 ký tự!" },
            {
              validator: (_, value) => {
                if (value && value.trim() === "")
                  return Promise.reject(
                    "Nội dung không được chỉ chứa khoảng trắng!"
                  );
                return Promise.resolve();
              },
            },
          ]}
        >
          <TextArea rows={4} placeholder="Nhập nội dung chi tiết của phim" />
        </Form.Item>

        <Form.Item
          name="poster"
          label="Poster phim"
          rules={[
            { required: true, message: "Vui lòng tải lên poster phim!" },
            {
              validator: (_, value) => {
                if (!value)
                  return Promise.reject("Vui lòng tải lên poster phim!");
                if (
                  typeof value !== "string" ||
                  !value.includes("cloudinary.com")
                ) {
                  return Promise.reject(
                    "Hình ảnh không hợp lệ! Vui lòng tải lên lại."
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <CloudinaryUpload
            label="Tải lên poster phim"
            value={posterUrl}
            onChange={(url) => {
              setPosterUrl(url);
              form.setFieldValue("poster", url);
              // Validate ngay lập tức
              form.validateFields(["poster"]);
            }}
          />
        </Form.Item>

        <Form.Item
          name="backdrop"
          label="Hình nền phim"
          rules={[
            { required: true, message: "Vui lòng tải lên hình nền phim!" },
            {
              validator: (_, value) => {
                if (!value)
                  return Promise.reject("Vui lòng tải lên hình nền phim!");
                if (
                  typeof value !== "string" ||
                  !value.includes("cloudinary.com")
                ) {
                  return Promise.reject(
                    "Hình ảnh không hợp lệ! Vui lòng tải lên lại."
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <CloudinaryUpload
            label="Tải lên hình nền phim"
            value={backdropUrl}
            onChange={(url) => {
              setBackdropUrl(url);
              form.setFieldValue("backdrop", url);
              // Validate ngay lập tức
              form.validateFields(["backdrop"]);
            }}
          />
        </Form.Item>
      </FormSection>

      <div style={{ textAlign: "right", marginTop: 24 }}>
        <Button
          onClick={handleCancel}
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

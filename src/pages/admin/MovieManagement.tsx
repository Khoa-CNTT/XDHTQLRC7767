import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Space,
  Typography,
  Modal,
  message,
  Form,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  ImportOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

// Import các component
import MovieFilter from "../../components/movies/MovieFilter";
import MovieForm from "../../components/movies/MovieForm";
import MovieTable from "../../components/movies/MovieTable";
import MovieDetail from "../../components/movies/MovieDetail";
import MovieBulkActions from "../../components/movies/MovieBulkActions";
import {
  fetchMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  bulkDeleteMovies,
  bulkUpdateStatus,
} from "../../services/movieService";

const { Title } = Typography;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const StyledCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 24px;
  margin-bottom: 24px;
`;

// Định nghĩa các interface
export interface Movie {
  id: number;
  title: string;
  director: string;
  releaseDate?: string | null;
  duration?: number;
  genre?: string[];
  status?: string;
  poster?: string;
  description?: string;
  rating?: number;
}

export interface FilterValues {
  status: string | null;
  genres: string[];
  dateRange: [Dayjs | null, Dayjs | null] | null;
}

const MovieManagement: React.FC = () => {
  // State
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState<boolean>(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [filterVisible, setFilterVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState<FilterValues>({
    status: null,
    genres: [],
    dateRange: null,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [bulkActionVisible, setBulkActionVisible] = useState<boolean>(false);

  // Fetch data
  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const data = await fetchMovies();
      setMovies(data);
    } catch (error) {
      message.error("Không thể tải dữ liệu phim");
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleFilterChange = (values: FilterValues) => {
    setFilters(values);
  };

  const showModal = (movie: Movie | null = null) => {
    setCurrentMovie(movie);
    setIsModalVisible(true);
    if (movie) {
      form.setFieldsValue({
        ...movie,
        releaseDate: movie.releaseDate ? dayjs(movie.releaseDate) : null,
      });
    } else {
      form.resetFields();
    }
  };

  const showViewModal = (movie: Movie) => {
    setCurrentMovie(movie);
    setIsViewModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsViewModalVisible(false);
    setCurrentMovie(null);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      // Xử lý ngày phát hành
      const formattedValues = {
        ...values,
        releaseDate: values.releaseDate ? values.releaseDate.format('YYYY-MM-DD') : null,
      };

      // Xử lý poster nếu có
      if (values.poster && values.poster.length > 0) {
        // Trong thực tế, bạn sẽ upload file và lấy URL từ response
        // Ở đây chỉ giả lập
        formattedValues.poster = "https://via.placeholder.com/150x225";
      }

      if (currentMovie) {
        // Cập nhật phim
        await updateMovie(currentMovie.id, formattedValues);
        message.success("Cập nhật phim thành công!");
      } else {
        // Thêm phim mới
        await addMovie(formattedValues);
        message.success("Thêm phim mới thành công!");
      }

      handleCancel();
      loadMovies();
    } catch (error) {
      message.error("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteMovie(id);
      message.success("Xóa phim thành công!");
      loadMovies();
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa phim!");
    } finally {
      setLoading(false);
    }
  };

  const handleRowSelectionChange = (selectedKeys: React.Key[]) => {
    setSelectedRowKeys(selectedKeys);
    setBulkActionVisible(selectedKeys.length > 0);
  };

  const handleBulkDelete = async () => {
    try {
      setLoading(true);
      await bulkDeleteMovies(selectedRowKeys as number[]);
      message.success(`Đã xóa ${selectedRowKeys.length} phim!`);
      setSelectedRowKeys([]);
      setBulkActionVisible(false);
      loadMovies();
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa phim!");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkChangeStatus = async (status: string) => {
    try {
      setLoading(true);
      await bulkUpdateStatus(selectedRowKeys as number[], status);
      message.success(`Đã cập nhật trạng thái cho ${selectedRowKeys.length} phim!`);
      loadMovies();
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật trạng thái!");
    } finally {
      setLoading(false);
    }
  };

  // Lọc phim theo điều kiện tìm kiếm và bộ lọc
  const filteredMovies = movies.filter((movie) => {
    let matchesSearch = true;
    let matchesFilters = true;

    // Search filter
    if (searchText) {
      matchesSearch =
        movie.title.toLowerCase().includes(searchText.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchText.toLowerCase());
    }

    // Status filter
    if (filters.status) {
      matchesFilters = matchesFilters && movie.status === filters.status;
    }

    // Genre filter
    if (filters.genres && filters.genres.length > 0) {
      matchesFilters =
        (matchesFilters &&
          movie.genre?.some((g) => filters.genres.includes(g))) ||
        false;
    }

    // Date range filter
    if (
      filters.dateRange &&
      filters.dateRange[0] &&
      filters.dateRange[1] &&
      movie.releaseDate
    ) {
      const startDate = filters.dateRange[0].valueOf();
      const endDate = filters.dateRange[1].valueOf();
      const movieDate = dayjs(movie.releaseDate).valueOf();
      matchesFilters =
        matchesFilters && movieDate >= startDate && movieDate <= endDate;
    }

    return matchesSearch && matchesFilters;
  });

  return (
    <div>
      <PageHeader>
        <Title level={2}>Quản lý phim</Title>
        <Space>
          <Button icon={<ImportOutlined />}>Nhập Excel</Button>
          <Button icon={<ExportOutlined />}>Xuất Excel</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Thêm phim mới
          </Button>
        </Space>
      </PageHeader>

      <StyledCard>
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Input
              placeholder="Tìm kiếm theo tên phim, đạo diễn..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: "100%" }}
              allowClear
            />
          </Col>
          <Col span={8} style={{ textAlign: "right" }}>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setFilterVisible(!filterVisible)}
              >
                Bộ lọc
              </Button>
              
              {bulkActionVisible && (
                <MovieBulkActions
                  selectedCount={selectedRowKeys.length}
                  onDelete={handleBulkDelete}
                  onChangeStatus={handleBulkChangeStatus}
                />
              )}
            </Space>
          </Col>
        </Row>

        {filterVisible && (
          <MovieFilter
            onFilterChange={handleFilterChange}
            initialValues={filters}
          />
        )}

        <MovieTable
          movies={filteredMovies}
          loading={loading}
          onEdit={showModal}
          onView={showViewModal}
          onDelete={handleDelete}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={handleRowSelectionChange}
        />
      </StyledCard>

      {/* Add/Edit Movie Modal */}
      <Modal
        title={currentMovie ? "Chỉnh sửa phim" : "Thêm phim mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <MovieForm
          form={form}
          onFinish={handleSubmit}
          initialValues={currentMovie}
          onCancel={handleCancel}
        />
      </Modal>

      {/* View Movie Modal */}
      <Modal
        title="Chi tiết phim"
        open={isViewModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {currentMovie && <MovieDetail movie={currentMovie} />}
      </Modal>
    </div>
  );
};

export default MovieManagement;

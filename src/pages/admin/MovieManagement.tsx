import React, { useState, useEffect } from "react";
import { Button, Input, Space, Typography, Modal, Form, Row, Col } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Movie as ReduxMovie } from "../../redux/slices/movieSlice";
import useDocumentTitle from "../../hooks/useDocumentTitle";

// Import các actions từ movieSlice
import {
  getAdminMovieListRequest,
  addMovieRequest,
  updateMovieRequest,
  deleteMovieRequest,
  bulkDeleteMoviesRequest,
  bulkUpdateStatusRequest,
  MovieFilterParams,
  resetAdminMovieState,
} from "../../redux/slices/movieSlice";

// Import các component
import MovieFilter from "../../components/movies/MovieFilter";
import MovieForm from "../../components/movies/MovieForm";
import MovieTable from "../../components/movies/MovieTable";
import MovieDetail from "../../components/movies/MovieDetail";
import MovieBulkActions from "../../components/movies/MovieBulkActions";

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
export interface Movie extends Omit<ReduxMovie, "genres"> {
  director: string; // Ensure director is required
  movieGenres?: { id: number; name: string }[]; // Add movieGenres property
  genres?: { id: number; name: string }[]; // Add genres property from direct API response
}

export interface FilterValues {
  status: string | null;
  genres: string[];
  dateRange: [Dayjs | null, Dayjs | null] | null;
  director?: string;
  actor?: string;
}

const MovieManagement: React.FC = () => {
  useDocumentTitle("Quản lý phim - Admin BSCMSAAPUE");

  // Redux
  const dispatch = useDispatch();
  const { data: movies, loading } = useSelector(
    (state: RootState) => state.movie.adminMovieList
  );

  const {
    success: addSuccess,
    loading: addLoading,
    error: addError,
  } = useSelector((state: RootState) => state.movie.adminMovieAdd);

  const {
    success: updateSuccess,
    loading: updateLoading,
    error: updateError,
  } = useSelector((state: RootState) => state.movie.adminMovieUpdate);

  const {
    success: deleteSuccess,
    loading: deleteLoading,
    error: deleteError,
  } = useSelector((state: RootState) => state.movie.adminMovieDelete);

  const {
    success: bulkActionSuccess,
    loading: bulkActionLoading,
    error: bulkActionError,
  } = useSelector((state: RootState) => state.movie.adminBulkActions);

  // State
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
    director: undefined,
    actor: undefined,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [bulkActionVisible, setBulkActionVisible] = useState<boolean>(false);

  // Fetch data
  useEffect(() => {
    loadMovies();
  }, []);

  // Process redux action responses
  useEffect(() => {
    if (addSuccess || updateSuccess || deleteSuccess || bulkActionSuccess) {
      setIsModalVisible(false);
      setCurrentMovie(null);
      form.resetFields();

      // Reset states
      // dispatch(resetAdminMovieState());
    }
  }, [addSuccess, updateSuccess, deleteSuccess, bulkActionSuccess]);

  const loadMovies = () => {
    // Create filter params for API
    const filterParams: MovieFilterParams = {};

    if (searchText) filterParams.name = searchText;
    if (filters.director) filterParams.director = filters.director;
    if (filters.actor) filterParams.actor = filters.actor;
    if (filters.genres?.length > 0) filterParams.genreName = filters.genres[0];

    dispatch(getAdminMovieListRequest(filterParams));
  };

  // Handlers
  const handleSearch = (value: string) => {
    setSearchText(value);
    loadMovies();
  };

  const handleFilterChange = (values: FilterValues) => {
    setFilters(values);
    loadMovies();
  };

  const showModal = (movie: Movie | null = null) => {
    setCurrentMovie(movie);
    setIsModalVisible(true);
    if (movie) {
      // Ánh xạ dữ liệu từ API vào form
      const formData = {
        // Sử dụng các trường từ API hoặc từ Redux store
        id: movie.id,
        title: movie.title || movie.name,
        description: movie.description,
        director: movie.director,
        releaseDate: movie.releaseDate ? dayjs(movie.releaseDate) : null,
        duration: movie.duration,
        status: movie.status,
        poster: movie.poster || movie.imageUrl,
        backdrop: movie.backdrop,
        rating: movie.rating,
        actor: movie.actor,
        country: movie.country,
        language: movie.language,
        subtitle: movie.subtitle,
        ageLimit: movie.ageLimit,
        content: movie.content,
        // Xử lý thể loại
        genreIds:
          movie.movieGenres?.map((g) => g.id) ||
          movie.genres?.map((g) => g.id) ||
          [],
      };
      form.setFieldsValue(formData);
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

  const handleSubmit = (values: any) => {
    // Xử lý ngày phát hành
    const formattedValues = {
      ...values,
      // Ensure we handle both dayjs objects and string dates
      releaseDate: values.releaseDate
        ? dayjs.isDayjs(values.releaseDate)
          ? values.releaseDate.format("YYYY-MM-DD")
          : values.releaseDate
        : null,
    };

    // No need to process poster as CloudinaryUpload already provides the URL directly
    // The 'poster' field now contains the Cloudinary secure_url

    if (currentMovie) {
      // Cập nhật phim
      dispatch(
        updateMovieRequest({
          id: currentMovie.id,
          data: formattedValues,
        })
      );
    } else {
      // Thêm phim mới
      dispatch(addMovieRequest(formattedValues));
    }
  };

  const handleDelete = (id: number) => {
    dispatch(deleteMovieRequest(id));
  };

  const handleRowSelectionChange = (selectedKeys: React.Key[]) => {
    setSelectedRowKeys(selectedKeys);
    setBulkActionVisible(selectedKeys.length > 0);
  };

  const handleBulkDelete = () => {
    dispatch(bulkDeleteMoviesRequest(selectedRowKeys as number[]));
    setSelectedRowKeys([]);
    setBulkActionVisible(false);
  };

  const handleBulkChangeStatus = (status: string) => {
    dispatch(
      bulkUpdateStatusRequest({
        ids: selectedRowKeys as number[],
        status,
      })
    );
  };

  // Lọc phim theo điều kiện bộ lọc
  const filteredMovies = movies.filter((movie: ReduxMovie) => {
    let matchesFilters = true;

    // Status filter - client side
    if (filters.status) {
      matchesFilters = matchesFilters && movie.status === filters.status;
    }

    // Date range filter - client side
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

    return matchesFilters;
  }) as Movie[];

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
              placeholder="Tìm kiếm theo tên phim..."
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
                  loading={bulkActionLoading}
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
          deleteLoading={deleteLoading}
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
          loading={currentMovie ? updateLoading : addLoading}
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

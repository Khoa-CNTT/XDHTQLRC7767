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
  imageUrl?: string; // Add imageUrl property as alternative to poster
  backdropUrl?: string; // Add backdropUrl property as alternative to backdrop
  name?: string; // Add name property as alternative to title
}

export interface FilterValues {
  status: number | null;
  genres: string[];
  dateRange: [Dayjs | null, Dayjs | null] | null;
  director?: string;
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
    // Only load all movies without any filters
    const filterParams: MovieFilterParams = {};
    dispatch(getAdminMovieListRequest(filterParams));
  };

  // Handlers
  const handleSearch = (value: string) => {
    setSearchText(value);
    // Don't reload movies, just update the search text for client-side filtering
  };

  const handleFilterChange = (values: FilterValues) => {
    setFilters(values);
    // Don't reload movies, just update the filters for client-side filtering
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({
      status: null,
      genres: [],
      dateRange: null,
      director: undefined,
    });
  };

  const showModal = (movie: Movie | null = null) => {
    // Đóng tất cả modal trước
    setIsModalVisible(false);
    setIsViewModalVisible(false);

    // Reset form trước khi set dữ liệu mới
    form.resetFields();

    // Reset hình ảnh một cách rõ ràng
    form.setFieldsValue({
      poster: "",
      backdrop: "",
    });

    // Đảm bảo state được cập nhật trước khi mở modal mới
    setTimeout(() => {
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
          // Xử lý nhất quán cho poster và backdrop
          poster: movie.poster || movie.imageUrl, // Ưu tiên poster nếu có, nếu không thì dùng imageUrl
          backdrop: movie.backdrop || movie.backdropUrl, // Ưu tiên backdrop nếu có, nếu không thì dùng backdropUrl
          rating: movie.rating,
          country: movie.country,
          language: movie.language,
          subtitle: movie.subtitle,
          ageLimit: movie.ageLimit,
          content: movie.content,
          actor: movie.actor,
          // Xử lý thể loại
          genreIds:
            movie.movieGenres?.map((g) => g.id) ||
            movie.genres?.map((g) => g.id) ||
            [],
        };

        // Cập nhật form với dữ liệu của phim hiện tại
        form.setFieldsValue(formData);
      }
    }, 100);
  };

  const showViewModal = (movie: Movie) => {
    // Đóng tất cả modal trước
    setIsModalVisible(false);
    setIsViewModalVisible(false);

    // Reset hoàn toàn form và state
    form.resetFields();

    // Reset hình ảnh một cách rõ ràng
    form.setFieldsValue({
      poster: "",
      backdrop: "",
      title: "",
      description: "",
      director: "",
      releaseDate: null,
      duration: null,
      status: 0,
      rating: null,
      country: "",
      language: "",
      subtitle: "",
      ageLimit: null,
      content: "",
      actor: "",
      genre: [],
    });

    // Đảm bảo state được cập nhật trước khi mở modal mới
    setTimeout(() => {
      setCurrentMovie(movie);
      setIsViewModalVisible(true);
    }, 100);
  };

  const handleCancel = () => {
    // Đóng tất cả modal
    setIsModalVisible(false);
    setIsViewModalVisible(false);

    // Reset state
    setCurrentMovie(null);

    // Reset form và dữ liệu
    form.resetFields();

    // Reset tất cả các trường một cách rõ ràng
    form.setFieldsValue({
      poster: "",
      backdrop: "",
      title: "",
      description: "",
      director: "",
      releaseDate: null,
      duration: null,
      status: 0,
      rating: null,
      country: "",
      language: "",
      subtitle: "",
      ageLimit: null,
      content: "",
      actor: "",
      genre: [],
    });

    // Đảm bảo dữ liệu được reset hoàn toàn sau khi đóng modal
    setTimeout(() => {
      form.resetFields();
    }, 200);
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
    // Hiển thị modal xác nhận trước khi xóa
    Modal.confirm({
      title: "Xác nhận xóa phim",
      content:
        "Bạn có chắc chắn muốn xóa phim này không? Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        // Thực hiện xóa sau khi xác nhận
        dispatch(deleteMovieRequest(id));

        // Đảm bảo form được reset sau khi xóa
        handleCancel();

        // Nếu phim đang được chọn trong danh sách bulk, loại bỏ khỏi danh sách
        if (selectedRowKeys.includes(id)) {
          setSelectedRowKeys(selectedRowKeys.filter((key) => key !== id));
          // Kiểm tra xem còn phim nào được chọn không
          if (selectedRowKeys.length <= 1) {
            setBulkActionVisible(false);
          }
        }
      },
    });
  };

  const handleRowSelectionChange = (selectedKeys: React.Key[]) => {
    setSelectedRowKeys(selectedKeys);
    setBulkActionVisible(selectedKeys.length > 0);
  };

  const handleBulkDelete = () => {
    // Không làm gì nếu không có phim nào được chọn
    if (selectedRowKeys.length === 0) {
      return;
    }

    // Hiển thị modal xác nhận trước khi xóa hàng loạt
    Modal.confirm({
      title: "Xác nhận xóa nhiều phim",
      content: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} phim đã chọn? Hành động này không thể hoàn tác.`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        // Thực hiện xóa nhiều phim sau khi xác nhận
        dispatch(bulkDeleteMoviesRequest(selectedRowKeys as number[]));

        // Reset trạng thái
        setSelectedRowKeys([]);
        setBulkActionVisible(false);

        // Đảm bảo form được reset
        handleCancel();
      },
    });
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

    // Search text filter - client side
    if (searchText) {
      matchesFilters =
        matchesFilters &&
        (movie.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          movie.name?.toLowerCase().includes(searchText.toLowerCase()));
    }

    // Director filter - client side
    if (filters.director) {
      matchesFilters =
        matchesFilters &&
        movie.director?.toLowerCase().includes(filters.director.toLowerCase());
    }

    // Genre filter - client side
    if (filters.genres && filters.genres.length > 0) {
      const movieGenres = movie.movieGenres || movie.genres || [];
      matchesFilters =
        matchesFilters &&
        filters.genres.some((genre) =>
          movieGenres.some(
            (mg) => mg.name.toLowerCase() === genre.toLowerCase()
          )
        );
    }

    // Status filter - client side
    if (filters.status !== null) {
      // Convert both to numbers for comparison
      const movieStatus =
        typeof movie.status === "string"
          ? parseInt(movie.status)
          : Number(movie.status);

      matchesFilters = matchesFilters && movieStatus === filters.status;
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

  // Thêm hàm riêng để xử lý việc thêm mới
  const handleAddNew = () => {
    // Đóng tất cả modal trước
    setIsModalVisible(false);
    setIsViewModalVisible(false);

    // Reset hoàn toàn form và state
    form.resetFields();
    setCurrentMovie(null);

    // Reset hình ảnh một cách rõ ràng
    form.setFieldsValue({
      poster: "",
      backdrop: "",
      title: "",
      description: "",
      director: "",
      releaseDate: null,
      duration: null,
      status: 0,
      rating: null,
      country: "",
      language: "",
      subtitle: "",
      ageLimit: null,
      content: "",
      actor: "",
      genre: [],
    });

    // Đảm bảo state được cập nhật trước khi mở modal mới
    setTimeout(() => {
      // Mở modal thêm mới
      setIsModalVisible(true);
    }, 100);
  };

  return (
    <div>
      <PageHeader>
        <Title level={2}>Quản lý phim</Title>
        <Space>
          <Button icon={<ImportOutlined />}>Nhập Excel</Button>
          <Button icon={<ExportOutlined />}>Xuất Excel</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
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

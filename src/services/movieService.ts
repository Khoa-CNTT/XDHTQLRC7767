import { Movie } from "../pages/admin/MovieManagement";

// Mock data
const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Avengers: Endgame",
    poster: "https://via.placeholder.com/150x225",
    director: "Anthony Russo, Joe Russo",
    genre: ["Hành động", "Phiêu lưu", "Khoa học viễn tưởng"],
    duration: 181,
    releaseDate: "2019-04-26",
    status: "Đã chiếu",
    rating: 8.4,
    description: "Sau các sự kiện tàn khốc của Avengers: Infinity War, vũ trụ đang trong tình trạng đổ nát. Với sự giúp đỡ của các đồng minh còn lại, các Avengers tập hợp một lần nữa để đảo ngược hành động của Thanos và khôi phục sự cân bằng cho vũ trụ."
  },
  {
    id: 2,
    title: "Spider-Man: No Way Home",
    poster: "https://via.placeholder.com/150x225",
    director: "Jon Watts",
    genre: ["Hành động", "Phiêu lưu", "Giả tưởng"],
    duration: 148,
    releaseDate: "2021-12-17",
    status: "Đang chiếu",
    rating: 8.3,
    description: "Với danh tính của Spider-Man bị lộ, Peter Parker nhờ Doctor Strange giúp đỡ. Khi một câu thần chú bị sai, những kẻ thù nguy hiểm từ các thế giới khác bắt đầu xuất hiện, buộc Peter phải khám phá ý nghĩa thực sự của việc trở thành Spider-Man."
  },
  {
    id: 3,
    title: "The Batman",
    poster: "https://via.placeholder.com/150x225",
    director: "Matt Reeves",
    genre: ["Hành động", "Tội phạm", "Chính kịch"],
    duration: 176,
    releaseDate: "2022-03-04",
    status: "Đang chiếu",
    rating: 7.9,
    description: "Khi một kẻ giết người hàng loạt bắt đầu giết các nhân vật chính trị quan trọng ở Gotham, Batman phải điều tra thế giới ngầm nơi các nhân vật quen thuộc như Catwoman, Penguin, Riddler và Carmine Falcone liên quan đến nhau."
  },
  {
    id: 4,
    title: "Dune",
    poster: "https://via.placeholder.com/150x225",
    director: "Denis Villeneuve",
    genre: ["Phiêu lưu", "Chính kịch", "Khoa học viễn tưởng"],
    duration: 155,
    releaseDate: "2021-10-22",
    status: "Đã chiếu",
    rating: 8.0,
    description: "Một người thừa kế quý tộc được giao nhiệm vụ bảo vệ hành tinh nguy hiểm và khắc nghiệt nhất trong vũ trụ, nguồn cung cấp loại thuốc quý giá nhất tồn tại, nơi chỉ những người có thể chinh phục nỗi sợ hãi của họ mới có thể tồn tại."
  },
  {
    id: 5,
    title: "Encanto",
    poster: "https://via.placeholder.com/150x225",
    director: "Jared Bush, Byron Howard",
    genre: ["Hoạt hình", "Hài", "Gia đình"],
    duration: 102,
    releaseDate: "2021-11-24",
    status: "Đã chiếu",
    rating: 7.2,
    description: "Câu chuyện về một gia đình phi thường, Madrigals, sống ẩn mình trong núi Colombia, trong một ngôi nhà ma thuật, trong một thị trấn sôi động, ở một nơi kỳ diệu và quyến rũ gọi là Encanto."
  }
];

// Lưu trữ dữ liệu tạm thời
let movies = [...mockMovies];

// API giả lập
export const fetchMovies = (): Promise<Movie[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...movies]);
    }, 500);
  });
};

export const addMovie = (movie: Omit<Movie, "id">): Promise<Movie> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMovie = {
        id: Math.max(...movies.map((m) => m.id), 0) + 1,
        ...movie,
      };
      movies.push(newMovie);
      resolve(newMovie);
    }, 500);
  });
};

export const updateMovie = (id: number, movie: Partial<Movie>): Promise<Movie> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = movies.findIndex((m) => m.id === id);
      if (index !== -1) {
        movies[index] = { ...movies[index], ...movie };
        resolve(movies[index]);
      } else {
        reject(new Error("Không tìm thấy phim"));
      }
    }, 500);
  });
};

export const deleteMovie = (id: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = movies.findIndex((m) => m.id === id);
      if (index !== -1) {
        movies.splice(index, 1);
        resolve(true);
      } else {
        reject(new Error("Không tìm thấy phim"));
      }
    }, 500);
  });
};

export const bulkDeleteMovies = (ids: number[]): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      movies = movies.filter((movie) => !ids.includes(movie.id));
      resolve(true);
    }, 500);
  });
};

export const bulkUpdateStatus = (ids: number[], status: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      movies = movies.map((movie) => {
        if (ids.includes(movie.id)) {
          return { ...movie, status };
        }
        return movie;
      });
      resolve(true);
    }, 500);
  });
}; 
// Interfaces for showtime data
export interface ShowTime {
  id: number;
  time: string;
}

export interface Cinema {
  name: string;
  address: string;
  showtimes: ShowTime[];
}

// Sample data as provided in the example
export const sampleShowtimeData: Cinema[] = [
  {
    name: "Cinestar Quốc Thanh",
    address: "271 Nguyễn Trãi, Q.1, Tp. Hồ Chí Minh",
    showtimes: [
      {
        id: 2,
        time: "09:00",
      },
      {
        id: 3,
        time: "09:20",
      },
      {
        id: 4,
        time: "12:00",
      },
      {
        id: 5,
        time: "15:00",
      },
      {
        id: 6,
        time: "19:00",
      },
      {
        id: 7,
        time: "22:00",
      },
    ],
  },
];

// Helper function to create booking data
export const createBookingData = (
  movieId: string | number,
  movieName: string,
  movieImage: string,
  movieDuration: string | number,
  cinema: Cinema,
  showtime: ShowTime,
  selectedDate: string
) => {
  return {
    movie: {
      id: movieId.toString(),
      name: movieName,
      image: movieImage,
      duration: movieDuration,
    },
    cinema: {
      name: cinema.name,
      address: cinema.address,
    },
    showtime: {
      id: showtime.id,
      date: selectedDate,
      time: showtime.time,
    },
    step: 1, // Direct to seat selection step
  };
};

// Helper function to save booking data to localStorage
export const saveBookingData = (bookingData: any) => {
  localStorage.setItem("bookingData", JSON.stringify(bookingData));
};

// Helper function to load sample data into Redux store format
export const formatShowtimesForRedux = (cinemas: Cinema[]) => {
  return cinemas.map((cinema) => ({
    name: cinema.name,
    address: cinema.address,
    showtimes: cinema.showtimes,
  }));
};

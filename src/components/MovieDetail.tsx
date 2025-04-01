import React, { useState } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import {
  MovieDetailContainer,
  MovieDetailContent,
  MovieHeader,
  PosterContainer,
  PosterImage,
  MovieInfo,
  MovieTitle,
  MovieOriginalTitle,
  InfoTable,
  InfoRow,
  InfoLabel,
  InfoValue,
  AgeRestriction,
  ButtonsContainer,
  ActionButton,
  MovieContent,
  SectionTitle,
  Synopsis,
  TrailerContainer,
  TrailerIframe,
  ShowtimesContainer,
  DateSelector,
  DateButton,
  ShowtimesList,
  CinemaItem,
  CinemaHeader,
  CinemaLogo,
  CinemaName,
  CinemaBody,
  ShowtimesGrid,
  ShowtimeButton,
} from "../styles/MovieDetailStyles";

const MovieDetail: React.FC = () => {
  const { id: movieId } = useParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState<string>("1");

  // Giả lập dữ liệu ngày chiếu
  const dates = [
    { id: "2023-07-15", label: "Hôm nay, 15/07" },
    { id: "2023-07-16", label: "Chủ nhật, 16/07" },
    { id: "2023-07-17", label: "Thứ 2, 17/07" },
    { id: "2023-07-18", label: "Thứ 3, 18/07" },
    { id: "2023-07-19", label: "Thứ 4, 19/07" },
    { id: "2023-07-20", label: "Thứ 5, 20/07" },
  ];

  // Giả lập dữ liệu rạp chiếu
  const cinemas = [
    {
      id: 1,
      name: "UbanFlix Vincom Đà Nẵng",
      logo: "https://png.pngtree.com/background/20210711/original/pngtree-coming-soon-movie-in-cinema-theater-billboard-sign-on-red-theater-picture-image_1157635.jpg",
      showtimes: ["10:30", "13:15", "15:45", "18:20", "20:50", "22:30"],
    },
    {
      id: 2,
      name: "UbanFlix Lotte Mart Đà Nẵng",
      logo: "https://png.pngtree.com/background/20210711/original/pngtree-coming-soon-movie-in-cinema-theater-billboard-sign-on-red-theater-picture-image_1157635.jpg",
      showtimes: ["09:45", "12:30", "14:50", "17:10", "19:40", "21:15"],
    },
  ];

  return (
    <MovieDetailContainer>
      <MovieDetailContent>
        <MovieHeader>
          <PosterContainer>
            <PosterImage
              src="https://s3-alpha-sig.figma.com/img/3bb3/076f/2f736f47ecfe350189e25ad6e80401a0?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=rz9NYtEkSdKwNi81rsI-tmnj95CIUmTry~Q~HZvV333G-atbpa6DG3cRSVh8aitn9xVl~GROvbIddvoo8P-VGPDvZyJts8oqrTKt619l334mUS3Mm2qHauzMDIgrs5ckxrAYh1AfN5jJESmcty8k4TrmYOq7Y7z1VTsAOThuRNnNjgNgxUct3pw7~dWV3spUhgCp2DSCJ6QYMvc05eFgKf2JNz9zXSh2i9JwwPHaoa3Zw7J3GHdJOsXSVmg~01QeoWLsJnwysxaVpeY0oIVQPTRu0ItgYBy4ey7sHIRSU-sQSckW0eOiQ6gRYhp6HY5x0xBZwrL2rM3Vt9oi0MXDlA__"
              alt="Movie Poster"
            />
          </PosterContainer>

          <MovieInfo>
            <MovieTitle>(LỒNG TIẾNG) SÁT THỦ VÔ CÙNG CỰC HÀI (T16)</MovieTitle>
            <MovieOriginalTitle>Extreme Job</MovieOriginalTitle>

            <InfoTable>
              <InfoRow>
                <InfoLabel>Đạo diễn:</InfoLabel>
                <InfoValue>Choi Won-sub</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Ngôn ngữ:</InfoLabel>
                <InfoValue>
                  Kwon Sang-woo, Jung Joon-ho, Lee Yi-kyung, Hwang Woo-seul-hye,
                  Kim Sung-oh, Lee Ji-won
                </InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Thể loại:</InfoLabel>
                <InfoValue>Hài</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Khởi chiếu:</InfoLabel>
                <InfoValue>12-03-2025</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Thời lượng:</InfoLabel>
                <InfoValue>107 phút</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Ngôn ngữ:</InfoLabel>
                <InfoValue>Lồng tiếng Việt</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Rated:</InfoLabel>
                <InfoValue>
                  <AgeRestriction>C16</AgeRestriction> Phim cấm phổ biến đến
                  khán giả dưới 16 tuổi
                </InfoValue>
              </InfoRow>
            </InfoTable>

            <ButtonsContainer>
              <ActionButton icon={<PlayCircleOutlined />}>TRAILER</ActionButton>
              <Link to={`/booking/${movieId}`}>
                <ActionButton>ĐẶT VÉ</ActionButton>
              </Link>
            </ButtonsContainer>
          </MovieInfo>
        </MovieHeader>

        <MovieContent>
          <div>
            <SectionTitle>NỘI DUNG PHIM</SectionTitle>
            <Synopsis>
              Câu chuyện tiếp nối với cuộc đời làm hoa sĩ webtoon Jun, người nổi
              tiếng trong thời gian ngắn với tư cách là tác giả của webtoon Đắc
              vụ ám sát Jun, nhanh chóng mang danh là "nhà văn thiếu não" sau
              khi Phần 2 bị chỉ trích thậm hại, nhưng mọi thứ thay đổi khi một
              cuộc tấn công khủng bố nhằm vào người dân thực hiện hệt với phần 2
              anh vừa xuất bản, khiến Jun bị NIS buộc tội sai là kẻ chủ mưu đứng
              sau tội ác.
            </Synopsis>
          </div>

          <div>
            <SectionTitle>TRAILER</SectionTitle>
            <TrailerContainer>
              <TrailerIframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Movie Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </TrailerContainer>
          </div>

          <ShowtimesContainer>
            <SectionTitle>LỊCH CHIẾU</SectionTitle>

            <DateSelector>
              {dates.map((date) => (
                <DateButton
                  key={date.id}
                  $active={selectedDate === date.id}
                  onClick={() => setSelectedDate(date.id)}
                >
                  {date.label}
                </DateButton>
              ))}
            </DateSelector>

            <ShowtimesList>
              {cinemas.map((cinema) => (
                <CinemaItem key={cinema.id}>
                  <CinemaHeader>
                    <CinemaLogo src={cinema.logo} alt={cinema.name} />
                    <CinemaName>{cinema.name}</CinemaName>
                  </CinemaHeader>
                  <CinemaBody>
                    <ShowtimesGrid>
                      {cinema.showtimes.map((time, index) => (
                        <Link to={`/booking/${movieId}`} key={index}>
                          <ShowtimeButton>{time}</ShowtimeButton>
                        </Link>
                      ))}
                    </ShowtimesGrid>
                  </CinemaBody>
                </CinemaItem>
              ))}
            </ShowtimesList>
          </ShowtimesContainer>
        </MovieContent>
      </MovieDetailContent>
    </MovieDetailContainer>
  );
};

export default MovieDetail;

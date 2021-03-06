import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import "../styles/MovieDetail.scss";

import RatingModal from "../components/util/RatingModal";
import { BorderRating } from "../components/util/BorderRating";
import UserCookie from "../utils/cookie";
import { localhost } from "../consts";
import ActorListView from "../components/list-view/ActorListView";
import CenterLoading from "../components/util/CenterLoading";
import ShimmerLoading from "../components/movie-detail/ShimmerLoading";

function MovieDetail(props) {
  console.log("@@@@@@@@@@@@@@@", props.match.params.id);
  const movieId = props.match.params.id.split("_")[0];
  const movieTitle = props.match.params.id.split("_")[1].split(", The")[0];
  const [movieInfo, setMovieInfo] = useState({
    youtubeUrl: "",
    award: "",
    movieTitle: "",
    year: 0,
    genre: "",
    avgRating: 0,
    ratingPeopleCount: 0,
    summary: "",
    plot: "",
    director: "",
    writers: "",
    actors: [],
    movieImageUrl: "",
  });
  const [movieImageUrl, setMovieImageUrl] = useState("");
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  // const movieImageUrl =
  //   "https://www.nultylighting.co.uk/wp-content/uploads/2017/02/la-la-land-lighting-night-sky.jpg";
  // detail summary, 감독, 배우, 각본 쓰는 사람는 없을수도 있는거 같은데, 없을 경우 무슨 값이 들어있는지 확인 필요
  // 배우는 빈 리스트가 올 수 있음
  const [modalOpen, setModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const [userId, setUserId] = useState();

  useEffect(() => {
    const user_id = UserCookie.getUserId();
    setUserId(user_id);

    async function fetchData() {
      await getMovieDetail(movieId, user_id);
      await getMovieImage(movieId);
    }
    fetchData();
  }, []);

  async function getMovieDetail(movie_id, user_id) {
    try {
      const response = await axios.get(
        `http://${localhost}:5000/movie/detail?movieId=${movieId}&userId=${user_id}`
      );
      setUserRating(response.data.userRating);
      setMovieInfo({
        youtubeUrl: response.data.youtubeUrl,
        award: response.data.award,
        movieTitle: movieTitle,
        year: response.data.year,
        genre: response.data.genre,
        avgRating: response.data.avgRating,
        ratingPeopleCount: response.data.ratingPeopleCount,
        userRating: response.data.userRating,
        summary: response.data.summary,
        plot: response.data.plot,
        director: response.data.director,
        writers: response.data.writers,
        actors: response.data.actors.filter((actor) => actor.name !== "N/A"),
      });
      setIsError(false);
      setIsLoading(false);
    } catch (err) {
      console.log("@@@@@@ fetch data ERR", err);
      setIsError(true);
      setIsLoading(false);
    }
  }

  async function getMovieImage(movie_id) {
    try {
      const response = await axios.get(
        `http://${localhost}:5000/movie/image?movieId=${movieId}`
      );
      setMovieImageUrl(response.data.imageUrl);
    } catch (err) {
      console.log("@@@@@@ fetch data ERR", err);
    }
  }

  function handleOpenModal() {
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
  }

  const onClickConfirm = async (rating) => {
    const userId = UserCookie.getUserId();
    const res = await axios.get(
      `http://${localhost}:5000/movie/rate?movieId=${movieId}&userId=${userId}&rating=${rating}`
    );
    setUserRating(rating);
    handleCloseModal();
  };

  function onClickBack() {
    history.goBack();
  }

  const handleWatchMovie = async () => {
    const userId = UserCookie.getUserId();
    try {
      const res = await axios.get(
        `http://${localhost}:5000/user/watch?userId=${userId}&movieId=${movieId}`
      );
      window.location.assign(movieInfo.youtubeUrl);
    } catch (err) {
      console.error(err);
      window.location.assign(movieInfo.youtubeUrl);
    }
  };
  return (
    <>
      {isLoading ? (
        <ShimmerLoading title={movieTitle} />
      ) : (
        <>
          <div className="header-back" onClick={onClickBack}>
            <i className="fas fa-chevron-left"></i>
          </div>
          <div className="movie-detail">
            {!!movieImageUrl && (
              <div className="movie-detail__movie-image">
                <img src={movieImageUrl} alt="movieImageUrl" />
              </div>
            )}
            {!!movieInfo.youtubeUrl && movieInfo.youtubeUrl !== "-" && (
              <div className="movie-detail__trailer" onClick={handleWatchMovie}>
                <div>There's an official trailer for it!</div>
                <span
                  className="movie-detail__trailer-button"
                  style={{ textDecoration: "none" }}
                >
                  <i className="fas fa-play"></i>Youtube
                </span>
              </div>
            )}

            <div className="movie-detail__main-information">
              {!!movieInfo.award &&
                movieInfo.award !== "N/A" &&
                movieInfo.award !== "-" && (
                  <div className="movie-detail__award">
                    <div className="movie-detail__award-icon">
                      <i
                        className="fas fa-trophy"
                        style={{ color: "var(--yellow)" }}
                      ></i>
                    </div>
                    {movieInfo.award}
                  </div>
                )}
              <div className="movie-detail__movie-title">
                {movieInfo.movieTitle}
              </div>
              <div className="movie-detail__genre">
                {movieInfo.year} ⋅ {movieInfo.genre}
              </div>
            </div>
            <div className="movie-detail__rating-information">
              <div className="movie-detail__rating">
                {movieInfo.avgRating > 0 && (
                  <BorderRating
                    name="avgRating"
                    value={movieInfo.avgRating}
                    readOnly
                  />
                )}
                {movieInfo.avgRating > 0 && (
                  <div className="movie-detail__rated-value">
                    {movieInfo.avgRating}
                  </div>
                )}
                {movieInfo.ratingPeopleCount > 0 && (
                  <div className="movie-detail__rated-count">
                    &nbsp;&nbsp;({movieInfo.ratingPeopleCount} rated)
                  </div>
                )}
                {userRating >= -1 && (
                  <>
                    <div
                      className="movie-detail__rating-button"
                      onClick={handleOpenModal}
                    >
                      Rating
                    </div>
                    <RatingModal
                      modalOpen={modalOpen}
                      movieTitle={movieInfo.movieTitle}
                      handleCloseModal={handleCloseModal}
                      onClickConfirm={onClickConfirm}
                    />
                  </>
                )}
              </div>
              {userRating > 0 && (
                <div className="movie-detail__rating">
                  <BorderRating
                    name="personRating"
                    value={userRating}
                    readOnly
                  />
                  <div className="movie-detail__rated-value">{userRating}</div>
                  <div className="movie-detail__rated-count">(my rating)</div>
                </div>
              )}
            </div>
            <div className="movie-detail__content">
              {!!movieInfo.summary && (
                <div className="movie-detail__title">{movieInfo.summary}</div>
              )}
              <div>{movieInfo.plot}</div>
            </div>
            {movieInfo.director ||
            movieInfo.writers ||
            movieInfo.actors.length > 0 ? (
              <>
                <div className="movie-detail__content">
                  <div className="movie-detail__title">People</div>

                  <div>
                    {movieInfo.director && "Directed by " + movieInfo.director}
                    {movieInfo.writers &&
                      ", and written by " + movieInfo.writers}
                  </div>
                </div>
                <ActorListView actors={movieInfo.actors} />
              </>
            ) : (
              <div></div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default MovieDetail;

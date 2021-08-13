import react, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../styles/App.scss";
import "../styles/MyPage.scss";

import VerticalListView from "../components/list-view/VerticalListView";
import BottomMenu from "../components/util/BottomMenu";

function MyPage() {
  const [movieList, setMovieList] = useState([]);
  const nickname = "Broccoli";
  const watchedMovie = 16;
  const ratedMovie = 14;

  return (
    <>
      <div className="my-page">
        <div className="my-page__user-info">
          <div className="my-page__profile">
            <div className="my-page__profile-image">
              <img src="https://thumb.ac-illust.com/t/f6/f6e3fd6d7e60544500352e46ad300085_t.jpeg" />
            </div>
            <div className="my-page__profile-nickname">{nickname}</div>
          </div>
          <div className="my-page__movies-info">
            <div className="my-page__movie-info">
              <div className="my-page__movie-info-title">watched</div>
              <div className="my-page__movie-info-count">{watchedMovie}</div>
            </div>
            <div className="my-page__movie-info">
              <div className="my-page__movie-info-title">rated</div>
              <div className="my-page__movie-info-count">{ratedMovie}</div>
            </div>
          </div>
        </div>
        <div className="my-page__watched-movie">
          <div className="my-page__watched-movie-header">
            <div className="my-page__watched-movie-title">Movie watched</div>
            <div className="my-page__search-icon">
              <Link to="/my-page/search">
                <i className="fas fa-search"></i>
              </Link>
            </div>
          </div>
          <div className="my-page__movie-list">
            <VerticalListView movieList={movieList} isRating={false} />
          </div>
        </div>
      </div>
      <BottomMenu />
    </>
  );
}

export default MyPage;

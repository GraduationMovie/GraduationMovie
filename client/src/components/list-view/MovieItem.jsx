import react, { useState, useEffect, useRef } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";

import poster from "../../images/lalaland.jpg";
import "../../styles/MovieItem.scss";

function MovieItem() {
  const [star, setStar] = useState(5);
  const [isSelected, setIsSelected] = useState(false);
  const starRef = useRef(null);

  function onClickPoster() {
    setIsSelected((prev) => !prev);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (starRef.current && !starRef.current.contains(e.target)) {
        onClickPoster();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [starRef]);

  return (
    <div className="movie-item">
      <img src={poster} alt="movie" onClick={onClickPoster}></img>
      {isSelected ? (
        <div className="movie-item__selected" onClick={onClickPoster}>
          <Rating
            ref={starRef}
            className="movie-item__star"
            name="simple-controlled"
            value={star}
            onChange={(event, newValue) => {
              setStar(newValue);
            }}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default MovieItem;

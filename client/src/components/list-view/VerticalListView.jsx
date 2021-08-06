//Movie list - vertical scroll
import { makeStyles, createStyles } from "@material-ui/core/styles";
import "../../styles/ListView.scss";

import MovieItem from "./MovieItem";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  })
);

function VerticalListView(props) {
  const { movieList, isRating, addNewRating } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className="list-view__grid">
        {movieList.map((movie, _) => (
          <MovieItem
            addNewRating={addNewRating}
            movieId={movie.id}
            url={movie.url}
            key={movie.url}
            isRating={isRating}
          />
        ))}
      </div>
    </div>
  );
}

export default VerticalListView;

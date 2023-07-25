// eslint-disable-next-line no-unused-vars
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Rate } from 'antd';

import { MoviesConsumer } from '../../contexts/moviesContext';
import defaultCover from '../../assets/images/default_cover.jpg';
import './movie-card.css';

function correctOverview(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }

  let index = text.indexOf(' ', maxLength);

  if (index === -1) {
    index = maxLength;
  }

  return `${text.slice(0, index)}...`;
}

function showGenres(allGenres, movieGenres) {
  const movieGenresId = movieGenres.map((id) => allGenres.find((elem) => elem.id === id));

  return movieGenresId.map((genre, index) => {
    if (index < 3) {
      return (
        <li key={genre.id} className='movie-card__genres-item'>
          {genre.name}
        </li>
      );
    }

    return null;
  });
}

export function MovieCard(props) {
  const {
    posterPath,
    title,
    releaseDate,
    overview,
    voteAverage,
    rating,
    changeMovieRating,
    movieGenres,
  } = props;

  let posterImg = `https://image.tmdb.org/t/p/original${posterPath}`;
  let movieOverview = 'No description';
  let formattedDate = 'Unknown date';
  const movieRating = +voteAverage.toFixed(1);

  if (!posterPath) {
    posterImg = defaultCover;
  }

  if (overview) {
    movieOverview = correctOverview(overview, 180);
  }

  if (releaseDate) {
    formattedDate = format(parseISO(releaseDate), 'MMMM d, y');
  }

  let voteAverageColor;

  if (voteAverage <= 3) {
    voteAverageColor = '#E90000';
  } else if (voteAverage > 3 && voteAverage < 5) {
    voteAverageColor = '#E97E00';
  } else if (voteAverage >= 5 && voteAverage < 7) {
    voteAverageColor = '#E9D100';
  } else {
    voteAverageColor = '#66E900';
  }

  return (
    <li className='movie-card'>
      <img className='movie-card__poster' src={posterImg} alt='Постер фильма' />
      <div className='movie-card__wrapper'>
        <div className='movie-card__inner'>
          <h3 className='movie-card__title'>{title}</h3>
          <div className='movie-card__rating' style={{ borderColor: voteAverageColor }}>
            {movieRating}
          </div>
        </div>
        <p className='movie-card__date'>{formattedDate}</p>
        <MoviesConsumer>
          {(allGenres) => (
            <ul className='movie-card__genres-list'>{showGenres(allGenres, movieGenres)}</ul>
          )}
        </MoviesConsumer>
        <p className='movie-card__overview'>{movieOverview}</p>
        <Rate onChange={changeMovieRating} defaultValue={rating} count={10} allowHalf />
      </div>
    </li>
  );
}

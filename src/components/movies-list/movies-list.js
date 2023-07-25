import { Component } from 'react';
import { Spin, Alert } from 'antd';

import { TMDBService } from '../../services/tmdb-service';
import { MovieCard } from '../movie-card';

import './movies-list.css';

export class MoviesList extends Component {
  tmdbService = new TMDBService();

  state = {
    moviesList: [],
    status: null,
  };

  componentDidUpdate(prevProps) {
    const { searchValue, activeTab, paginationPage, updatePaginationPage } = this.props;

    if (
      searchValue !== prevProps.searchValue ||
      paginationPage !== prevProps.paginationPage ||
      activeTab !== prevProps.activeTab
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        status: 'loading',
      });
      this.updateMovies();
    }

    if (activeTab !== prevProps.activeTab) {
      updatePaginationPage(1);
    }
  }

  updateMovies = () => {
    const { searchValue, activeTab, paginationPage } = this.props;

    this.tmdbService.getMovies(searchValue, paginationPage).then((foundMovies) => {
      if (foundMovies.results.length === 0 && searchValue !== '') {
        this.setState({
          status: 'errorSearch',
        });

        this.props.updateStatus('errorSearch');
      } else {
        this.tmdbService.getRatedMovies(paginationPage).then((ratedMovies) => {
          foundMovies.results.forEach((foundMovie) => {
            ratedMovies.results.forEach((ratedMovie) => {
              if (foundMovie.id === ratedMovie.id) {
                // eslint-disable-next-line no-param-reassign
                foundMovie.rating = ratedMovie.rating;
              }
            });
          });

          if (activeTab === '1') {
            this.props.getTotalPages(foundMovies.total_pages * 10);

            this.setState({
              moviesList: foundMovies.results,
              status: null,
            });

            this.props.updateStatus(null);
          } else if (activeTab === '2') {
            this.props.getTotalPages(ratedMovies.total_pages * 10);

            if (!ratedMovies.results.length) {
              this.setState({
                status: 'errorRated',
              });

              this.props.updateStatus('errorRated');
            } else {
              this.setState({
                moviesList: ratedMovies.results,
                status: null,
              });

              this.props.updateStatus(null);
            }
          }
        });
      }
    });
  };

  renderMovies = (moviesList) =>
    moviesList.map((item) => {
      const {
        id,
        title,
        release_date: releaseDate,
        poster_path: posterPath,
        overview,
        vote_average: voteAverage,
        rating,
        genre_ids: movieGenres,
      } = item;

      return (
        <MovieCard
          key={id}
          title={title}
          overview={overview}
          releaseDate={releaseDate}
          posterPath={posterPath}
          voteAverage={voteAverage}
          rating={rating}
          movieGenres={movieGenres}
          changeMovieRating={(value) => this.tmdbService.sendRatingToMovie(id, value)}
        />
      );
    });

  render() {
    const { moviesList, status } = this.state;

    if (status === 'loading') {
      return (
        <Spin tip='Loading...' size='large'>
          <div className='content' />
        </Spin>
      );
    }

    if (status === 'errorSearch') {
      return (
        <Alert
          className='alert-search'
          message='No movies found for your search'
          type='warning'
          showIcon
        />
      );
    }

    if (status === 'errorRated') {
      return (
        <Alert className='alert-rated' message='No movies with rating' type='warning' showIcon />
      );
    }

    const elements = this.renderMovies(moviesList);

    return <ul className='movies-list'>{elements}</ul>;
  }
}

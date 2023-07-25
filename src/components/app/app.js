import { Component } from 'react';
import { Input, Pagination, Tabs } from 'antd';
import { debounce } from 'lodash';
// import { Offline } from 'react-detect-offline';

import { MoviesProvider } from '../../contexts/moviesContext';
import { TMDBService } from '../../services/tmdb-service';
import { MoviesList } from '../movies-list';

import './app.css';

export class App extends Component {
  tmdbService = new TMDBService();

  state = {
    searchValue: '',
    paginationPage: 1,
    totalPages: 0,
    activeTab: '1',
    allGenres: [],
  };

  debounceUpdateSearchValue = debounce((value) => {
    this.setState({
      searchValue: value,
    });
  }, 1000);

  componentDidMount() {
    this.tmdbService.createGuestSession();
    this.tmdbService.getGenreList().then((genres) => {
      this.setState({
        allGenres: genres,
      });
    });
  }

  updateSearchValue = (evt) => {
    // const {
    //   target: { value },
    // } = evt;

    this.debounceUpdateSearchValue(evt.target.value);
  };

  updatePaginationPage = (page) => {
    this.setState({ paginationPage: page });
  };

  getTotalPages = (totalPages) => {
    this.setState({ totalPages });
  };

  updateStatus = (status) => {
    this.setState({
      status,
    });
  };

  updateTab = (activeTab) => {
    this.setState({
      activeTab,
    });
  };

  render() {
    const { searchValue, paginationPage, totalPages, status, activeTab, allGenres } = this.state;

    let viewPagination = (
      <Pagination
        current={paginationPage}
        total={totalPages}
        onChange={this.updatePaginationPage}
        showSizeChanger={false}
      />
    );

    let searchInput = (
      <Input
        size='large'
        placeholder='Type to search...'
        defaultValue=''
        onChange={this.updateSearchValue}
      />
    );

    if (!searchValue.trim() || status !== null) {
      viewPagination = null;
    }

    if (activeTab !== '1') {
      searchInput = null;
    }

    return (
      <div className='wrapper'>
        <header className='header'>
          <Tabs
            defaultActiveKey='1'
            size='large'
            onTabClick={this.updateTab}
            items={[
              {
                label: 'Search',
                key: '1',
              },
              {
                label: 'Rated',
                key: '2',
              },
            ]}
          />
          {searchInput}
        </header>
        <main className='main'>
          <MoviesProvider value={allGenres}>
            <MoviesList
              searchValue={searchValue}
              paginationPage={paginationPage}
              getTotalPages={this.getTotalPages}
              updateStatus={this.updateStatus}
              activeTab={this.state.activeTab}
              updatePaginationPage={this.updatePaginationPage}
            />
          </MoviesProvider>
        </main>
        <footer className='footer'>{viewPagination}</footer>
        {/* <Offline>You are offline right now. Check your connection.</Offline> */}
      </div>
    );
  }
}

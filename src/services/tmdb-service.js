export class TMDBService {
  apiBase = 'https://api.themoviedb.org/3/';

  apiKey = '6092763b5c5c43b0e8f50f9ddd13b16e';

  static guestSessionId = null;

  async getResource(url, method = 'GET', body = null) {
    const options = {
      method,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body,
    };

    const response = await fetch(`${this.apiBase}${url}`, options);

    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, received ${response.status}`);
    }

    const result = await response.json();
    return result;
  }

  async getMovies(search, paginationPage) {
    const response = await this.getResource(
      `search/movie?query=${search}&api_key=${this.apiKey}&page=${paginationPage}`
    );

    return response;
  }

  async getRatedMovies(paginationPage) {
    const response = await this.getResource(
      `guest_session/${TMDBService.guestSessionId}/rated/movies?api_key=${this.apiKey}&page=${paginationPage}`
    );

    return response;
  }

  async createGuestSession() {
    if (sessionStorage.getItem('guestSessionId') === null) {
      await this.getResource(`authentication/guest_session/new?api_key=${this.apiKey}`).then(
        (response) => {
          sessionStorage.setItem('guestSessionId', response.guest_session_id);
          TMDBService.guestSessionId = response.guest_session_id;
        }
      );
    } else {
      TMDBService.guestSessionId = sessionStorage.getItem('guestSessionId');
    }
  }

  async sendRatingToMovie(movieId, rating) {
    await this.getResource(
      `movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${TMDBService.guestSessionId}`,
      'POST',
      JSON.stringify({
        value: rating,
      })
    );
  }

  async getGenreList() {
    const response = await this.getResource(`genre/movie/list?api_key=${this.apiKey}`);

    return response.genres;
  }
}

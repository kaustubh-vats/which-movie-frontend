// pages/index.js
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import Head from 'next/head';
const genre = ['Animation', 'Comedy', 'Family', 'Adventure', 'Fantasy', 'Romance', 'Drama', 'Action', 'Crime', 'Thriller', 'Horror', 'History', 'Science Fiction', 'Mystery', 'War', 'Foreign', 'Music', 'Documentary', 'Western', 'TV Movie']
const languages: any = {
  'English': 'en',
  'French': 'fr',
  'Chinese': 'zh',
  'Italian': 'it',
  'Persian': 'fa',
  'Dutch': 'nl',
  'German': 'de',
  'Arabic': 'ar',
  'Spanish': 'es',
  'Russian': 'ru',
  'Swedish': 'sv',
  'Japanese': 'ja',
  'Korean': 'ko',
  'Serbian': 'sr',
  'Bengali': 'bn',
  'Hebrew': 'he',
  'Portuguese': 'pt',
  'Wolof': 'wo',
  'Romanian': 'ro',
  'Hungarian': 'hu',
  'Welsh': 'cy',
  'Vietnamese': 'vi',
  'Czech': 'cs',
  'Danish': 'da',
  'Norwegian': 'no',
  'Polish': 'pl',
  'Greek': 'el',
  'Serbo-Croatian': 'sh',
  'Macedonian': 'mk',
  'Tibetan': 'bo',
  'Catalan': 'ca',
  'Finnish': 'fi',
  'Thai': 'th',
  'Slovak': 'sk',
  'Bosnian': 'bs',
  'Hindi': 'hi',
  'Turkish': 'tr',
  'Icelandic': 'is',
  'Pashto': 'ps',
  'Abkhazian': 'ab',
  'Esperanto': 'eo',
  'Georgian': 'ka',
  'Mongolian': 'mn',
  'Bambara': 'bm',
  'Zulu': 'zu',
  'Ukrainian': 'uk',
  'Afrikaans': 'af',
  'Latin': 'la',
  'Estonian': 'et',
  'Kurdish': 'ku',
  'Frisian': 'fy',
  'Latvian': 'lv',
  'Tamil': 'ta',
  'Slovenian': 'sl',
  'Tagalog': 'tl',
  'Urdu': 'ur',
  'Kinyarwanda': 'rw',
  'Indonesian': 'id',
  'Bulgarian': 'bg',
  'Marathi': 'mr',
  'Lithuanian': 'lt',
  'Kazakh': 'kk',
  'Malay': 'ms',
  'Albanian': 'sq',
  'Quechua': 'qu',
  'Telugu': 'te',
  'Amharic': 'am',
  'Javanese': 'jv',
  'Tajik': 'tg',
  'Malayalam': 'ml',
  'Croatian': 'hr',
  'Lao': 'lo',
  'Aymara': 'ay',
  'Kannada': 'kn',
  'Basque': 'eu',
  'Nepali': 'ne',
  'Punjabi': 'pa',
  'Kyrgyz': 'ky',
  'Galician': 'gl',
  'Uzbek': 'uz',
  'Samoan': 'sm',
  'Maltese': 'mt',
  'Armenian': 'hy',
  'Inuktitut': 'iu',
  'Luxembourgish': 'lb',
  'Sinhala': 'si'
};
let loaderInterval: any = null;

const getKeyFromValue = (object: any, value: string) => {
  return Object.keys(object).find(key => object[key] === value) || value;
}

const getForm: Function = (minYear: number, maxYear: number, genres: Array<string>, languageKeys: Array<string>, movieList: Array<string>, setMovieData1: Function, movieData1: Array<string>, setCurrMovieData1: Function, currMovieData1: any): JSX.Element => {
  const getRecommendation = (e: any) => {
    e.preventDefault();
    const selectedGenres = [];
    let selectedLanguages: any = [];
    const genreCheckboxes = document.getElementsByName('genre');
    for (let i = 0; i < genreCheckboxes.length; i++) {
      const checkbox = genreCheckboxes[i] as HTMLInputElement;
      if (checkbox.checked) {
        selectedGenres.push(checkbox.value);
      }
    }
    if (selectedGenres.length === 0) {
      setError('Please select at least one genre');
    } else {
      const languageCheckboxes = document.getElementsByName('language');
      for (let i = 0; i < languageCheckboxes.length; i++) {
        const checkbox = languageCheckboxes[i] as HTMLInputElement;
        if (checkbox.checked) {
          selectedLanguages.push(checkbox.value);
        }
      }
      setLoader(true);
      const minYear = (document.getElementById('minYear') as HTMLInputElement);
      const maxYear = (document.getElementById('maxYear') as HTMLInputElement);

      const minYearValue = minYear.value ? parseInt(minYear.value) : null;
      const maxYearValue = maxYear.value ? parseInt(maxYear.value) : null;

      if (selectedLanguages.length === 0) {
        selectedLanguages = null;
      }

      fetch('http://localhost:5000/getMovieDetailsByGenre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          genres: selectedGenres,
          languages: selectedLanguages,
          minYear: minYearValue,
          maxYear: maxYearValue,
        }),
      })
        .then(response => response.json())
        .then(data => {
          setLoader(false);
          setMovieData1(data.data);
          setCurrMovieData1({});
          scrollIntoViewMovies();
        })
        .catch((error) => {
          setLoader(false);
          setError('Something went wrong. Please try again');
        });
    }
    return false;
  }
  const setLoader = (show: boolean) => {
    const loader = document.getElementById('loaderContainer');
    if (loader) {
      if (show) {
        loader.style.display = 'flex';
        const loaderTexts = ['Hold on', 'Just a sec', 'Getting there', 'Almost there', 'Almost done'];
        const loaderText = document.getElementById('loaderText');
        if (loaderText) {
          let i = 0;
          loaderInterval = setInterval(() => {
            loaderText.innerHTML = loaderTexts[i] + '...';
            i = (i + 1) % loaderTexts.length;
          }, 1500);
        }
      } else {
        loader.style.display = 'none';
        loaderInterval && clearInterval(loaderInterval);
      }
    }
  }
  const getCurrentMovieData = (movieNameValue: string) => {
    fetch('http://localhost:5000/getMovieDetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        movie: movieNameValue,
      })
    }).then((response) => {
      return response.json();
    }).then((data) => {
      setCurrMovieData1(data.data);
      setLoader(false);
      scrollIntoViewMovies();
    }).catch((err) => {
      setLoader(false);
      setError('Something went wrong');
    });
  }
  const fetchAndRecommend = (movieNameValue: string) => {
    if (movieNameValue) {
      const movieNameIndex = movieList.indexOf(movieNameValue);
      if (movieNameIndex !== -1) {
        setLoader(true);
        fetch('http://localhost:5000/recommendMovie', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            movie: movieNameValue,
          })
        }).then((response) => {
          return response.json();
        }).then((data) => {
          getCurrentMovieData(movieNameValue);
          setMovieData1(data.data);
        }).catch((err) => {
          setLoader(false);
          setError('Something went wrong');
        });
        return true;
      }
    }
    setError('Please select the movie from the list');
    return false;
  }
  const getRecommendationFromMovie = (e: any) => {
    e.preventDefault();
    const movieName: any = document.getElementById('movieName');
    const movieNameValue = movieName && movieName.value;
    return fetchAndRecommend(movieNameValue);
  }
  const setError = (message: string) => {
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
      errorContainer.innerHTML = message;
      errorContainer.style.display = 'block';
      setTimeout(() => {
        errorContainer.style.display = 'none';
      }, 3000);
    }
  }
  const removeFromLs = (e: any) => {
    const suggestionContainer = document.getElementById('suggestionContainer');
    suggestionContainer && (suggestionContainer.innerHTML = '');
  }
  const getSuggestion = (e: any) => {
    //e.preventDefault();
    const movieName = e.target.value;
    const suggestionContainer = document.getElementById('suggestionContainer');
    if (suggestionContainer) {
      suggestionContainer.innerHTML = '';
      for (let i = 0; i < movieList.length; i++) {
        const movie = movieList[i];
        if (movie && movie.toLowerCase().includes(movieName.toLowerCase())) {
          const li = document.createElement('li');
          const movieNameIndex = movie.toLowerCase().indexOf(movieName.toLowerCase());
          const movieNameLength = movieName.length;
          const movieNamePart1 = movie.slice(0, movieNameIndex);
          const movieNamePart2 = movie.slice(movieNameIndex, movieNameIndex + movieNameLength);
          const movieNamePart3 = movie.slice(movieNameIndex + movieNameLength);
          li.innerHTML = movieNamePart1 + '<span class=' + styles.highlight + '>' + movieNamePart2 + '</span>' + movieNamePart3;
          li.onmousedown = (e: any) => {
            const movieName: any = document.getElementById('movieName');
            movieName && (movieName.value = e.target.innerText);
          }
          suggestionContainer.appendChild(li);
          if (suggestionContainer.children.length >= 5) {
            return;
          }
        }
      }
    }
  }
  const renderMovieCard = (): JSX.Element => {
    return (
      <div className={styles.movieCardContainer}>
        {
          movieData1.map((movie: any, index: number) => {
            return (
              <div key={`movieCard${index}`} className="card text-white bg-dark mb-3" style={{ "maxWidth": "18rem" }}>
                <div className="card-header">Movie {index + 1}</div>
                <div className="card-body">
                  <h5 className="card-title">{movie.title}</h5>
                  <p className="card-text">{movie.overview}</p>
                  <button className='btn btn-primary' onClick={
                    () => {
                      fetchAndRecommend(movie.title)
                    }}>Show me more like this</button>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
  const renderCurrMovieCard = (): JSX.Element => {
    const key: string = Object.keys(currMovieData1.original_title)[0];
    return (
      <div className={"card text-white bg-warning " + styles.currMovieCard}>
        <h5 className="card-header">Showing Recommendations for</h5>
        <div className="card-body">
          <h5 className="card-title">{currMovieData1.original_title[key]}</h5>
          <p className="card-text">{currMovieData1.overview[key]}</p>
          <p className="card-text rounded">
            <table className="table table-dark table-striped rounded">
              <thead>
                <tr>
                  <th scope="col">Tagline</th>
                  <th>{(currMovieData1.tagline) ? currMovieData1.tagline[key] : ''}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Actors</th>
                  <td>
                    {
                      (currMovieData1.actor_1) ? currMovieData1.actor_1[key] + ', ' : ''
                    }
                    {
                      (currMovieData1.actor_2) ? currMovieData1.actor_2[key] + ', ' : ''
                    }
                    {
                      (currMovieData1.actor_3) ? currMovieData1.actor_3[key] + '' : ''
                    }
                  </td>
                </tr>
                <tr>
                  <th scope="row">Director</th>
                  <td>
                    {
                      (currMovieData1.director) ? currMovieData1.director[key] : ''
                    }
                  </td>
                </tr>
                <tr>
                  <th scope="row">Genre</th>
                  <td>
                    {
                      (currMovieData1.genresLs) ? currMovieData1.genresLs[key].split(" ").join(', ').slice(0, -2) : ''
                    }
                  </td>
                </tr>
                <tr>
                  <th scope="row">Release Date</th>
                  <td>
                    {
                      (currMovieData1.release_date) ? currMovieData1.release_date[key] : ''
                    }
                  </td>
                </tr>
                <tr>
                  <th scope="row">Language</th>
                  <td>
                    {
                      (currMovieData1.original_language) ? getKeyFromValue(languages, currMovieData1.original_language[key]) : ''
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </p>
        </div>
      </div>
    )
  }
  const renderMoviesSection = (): JSX.Element => {
    return (
      <section className={styles.movieSection}>
        {currMovieData1 && currMovieData1.original_title && renderCurrMovieCard()}
        {movieData1 && movieData1.length > 0 && renderMovieCard()}
      </section>
    )
  }
  const scrollIntoViewMovies = () => {
    const movieSectionRef = document.getElementById('movieSectionRef');
    movieSectionRef && movieSectionRef.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
  return (
    <div>
      <section>
        {renderTitle()}
        <form onBlur={removeFromLs} onSubmit={getRecommendationFromMovie}>
          <h1 className='display-6'>Enter Movie Name</h1>
          <div >
            <input onInput={getSuggestion} className='form-control' type="text" placeholder='Which movie you already like' name="movieName" id="movieName" />
            <div className={styles.suggestionContainer}>
              <ul className={styles.suggestion} id="suggestionContainer">
                <span></span>
              </ul>
            </div>
          </div>
          <div className={styles.grid}>
            <button className='btn btn-primary' type="submit">Submit</button>
          </div>
        </form>
      </section>
      <span id="movieSectionRef"></span>
      {
        movieData1 && movieData1.length > 0 && renderMoviesSection()
      }
      <section className='display-1 p-5'>
        <p className={styles.Otherway + ' display-6 text-center'}>
          If you don&apos;t know any movie you like, you can also choose some genres and languages you like and we will recommend you some movies.
        </p>
        <i onClick={() => {
          const genreSection = document.getElementById('genreSection');
          genreSection && genreSection.scrollIntoView({
            behavior: 'smooth'
          });
        }} className={"fa-solid fa-arrow-down " + styles.currsorPointer}></i>
      </section>
      <section id='genreSection'>
        <form onSubmit={getRecommendation} >
          <h3 className='display-6'>Genre</h3>
          <div className={styles.grid} id="genre">
            {genres.map((genre: string, index: number) => (
              <span key={`genre${index}`}>
                <input type="checkbox" className='form-check-input' name="genre" id={`genre_${index}`} value={genre} />
                <label className="form-check-label" htmlFor={`genre_${index}`}>{genre}</label>
              </span>
            ))}
          </div>
          <h1 className='display-6'>Language</h1>
          <div className={styles.grid} id="language">
            {languageKeys.map((language: string, index: number) => (
              <span key={`lang${index}`}>
                <input className='form-check-input' type="checkbox" name="language" id={`language_${index}`} value={languages[language]} />
                <label className="form-check-label" htmlFor={`language_${index}`}>{language}</label>
              </span>
            ))}
          </div>
          <label htmlFor="year">Min Year</label>
          <input className='form-control' type="number" name="minYear" id="minYear" min={minYear} max={maxYear} />
          <label htmlFor="year">Max Year</label>
          <input className='form-control' type="number" name="maxYear" id="maxYear" min={minYear} max={maxYear} />
          <div className={styles.grid + ' ' + styles.btnContainer}>
            <button className='btn btn-primary' type="submit">Submit</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch('http://localhost:5000/getAllMovies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  let data = await res.json();
  data = JSON.parse(data.data.replaceAll('NaN', '\"\"'));
  return {
    props: {
      data
    }
  }
}

function renderErrorContainer(): JSX.Element {
  return (
    <div className={styles.errorContainer} id="errorContainer">
      <span></span>
    </div>
  );
}

function renderLoader(): JSX.Element {
  return (
    <div className={styles.loaderContainer} id="loaderContainer">
      <div className={styles.loaderAnimContainer}>
        <div className={styles.loader1 + ' ' + styles.loader}></div>
        <div className={styles.loader2 + ' ' + styles.loader}></div>
        <div className={styles.loader3 + ' ' + styles.loader}></div>
      </div>
      <span id="loaderText">Loading...</span>
    </div>
  );
}

function renderTitle(): JSX.Element {
  return (
    <div className={styles.titleContainer}>
      <h1 className={'display-1 mb-5'}><span className='text-primary'>Which</span> <span>Movie ?</span> </h1>
    </div>
  );
}

function renderFooter(): JSX.Element {
  return (
    <div className={styles.footerContainer}>
      <span className={styles.footerText}>Made with <i className={
        "fa-solid fa-heart " + styles.heart
      } />  by <a href="https://kaustubhvats-portfolio.netlify.app" target='_blank'>Kaustubh</a></span>
    </div>
  );
}

export default function Home({ data }: any) {
  const [movieData1, setMovieData1] = useState<Array<string>>([]);
  const [currMovieData1, setCurrMovieData1] = useState<any>({});
  return (
    <div className={styles.main}>
      <Head>
        <title>Which Movie</title>
      </Head>
      <div className={styles.container}>
        {getForm(1913, 2023, genre, Object.keys(languages), data, setMovieData1, movieData1, setCurrMovieData1, currMovieData1)}
        {renderErrorContainer()}
        {renderLoader()}
      </div>
      {renderFooter()}
    </div>
  );
}
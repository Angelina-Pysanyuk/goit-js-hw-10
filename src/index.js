import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './js-components/fetchCountries';

const DEBOUNCE_DELAY = 300;
const countriesInput = document.getElementById('search-box');
const countriesList = document.querySelector('.country-list');
const countriesInfoCard = document.querySelector('.country-info');

countriesInput.addEventListener('input', debounce(onUserInput, DEBOUNCE_DELAY));

function onUserInput(event) {
  const query = event.target.value.trim();
  if (query && query !== ' ') {
    fetchCountries(query)
      .then(createMarkup)
      .catch(error => {
        if (error.message === '404') {
          Notiflix.Notify.failure('Oops, there is no country with that name');
          countriesInfoCard.innerHTML = '';
          countriesList.innerHTML = '';
        }
      });
  }
}

function createMarkup(data) {
  const [country] = data;
  countriesList.innerHTML = '';
  countriesInfoCard.innerHTML = '';

  if (data.length >= 2 && data.length <= 10) renderMarkup(data);
  else if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else addCountryCard(country);
}

const renderMarkup = data => {
  const markup = data
    .map(country => {
      return `<li class="country-item">
          <img class="flag" src=${country.flags.svg} />
          <p class="name">${country.name.official}</p>
          </li>`;
    })
    .join('');

  countriesList.innerHTML = markup;
};

const addCountryCard = country => {
  const markup = `<div class="country-item">
          <img class="flag" src=${country.flags.svg} />
          <h2 class="name">${country.name.official}</h2>
          </div>
          <ul>
          <li><span class="title">Capital:</span> ${country.capital}</li>
          <li><span class="title">Population:</span> ${country.population}</li>
          <li><span class="title">Languages:</span> ${Object.values(
            country.languages
          )}</li>
          </ul>
          `;

  countriesInfoCard.innerHTML = markup;
};

import axios from 'axios';
import './css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  button: document.querySelector('button'),
  gallery: document.querySelector('.gallery'),
  buttonApp: document.querySelector('.load-more'),
};

const Key = '29524471-b67b2b2d9f34edfb071a81463';
const URL = 'https://pixabay.com/api';
let filters = `&image_type=photo&orientation=horizontal&safesearch=true`;
let listPhoto = 40;
let page = 1;
let item = [];
let query = '';

const fetchData = async () => {
  const { data } = await axios.get(
    `${URL}/?key=${Key}&per_page=${listPhoto}&page=${page}&q=${query}${filters}`
  );
  console.log(data);
  //   page += 1;
  item = data.hits;

  render(item);
};

function render(items) {
  let itemsLangth = items.length;

  const list = items
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card"><a class='link' href='${largeImageURL}'>
  <img clsass="imeges" src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes:${likes}</b>
    </p>
    <p class="info-item">
      <b>Views:${views}</b>
    </p>
    <p class="info-item">
      <b>Comments:${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads:${downloads}</b>
    </p>
  </div>
</div>`;
      }
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', list);

  try {
    if (itemsLangth > 0) {
      refs.buttonApp.classList.add('load-more-app');
    }
    if (listPhoto > itemsLangth && itemsLangth !== 0) {
      refs.buttonApp.classList.remove('load-more-app');
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results."`
      );
      return;
    }
  } catch (error) {
    console.log(error.message);
  }
  lightbox();
  notifiEl(itemsLangth);
}

function notifiEl(itemsLangth) {
  if (itemsLangth === 0) {
    Notiflix.Notify.failure(
      '"Sorry, there are no images matching your search query. Please try again."'
    );
    // refs.buttonApp.classList.remove('load-more-app');

    return;
  }

  if (itemsLangth === item.totalHits) {
    Notiflix.Report.success(
      'Were sorry, but youve reached the end of search results.'
    );
    refs.buttonApp.classList.remove('load-more-app');
    return;
  }
}

function onLoadMore() {
  page += 1;

  fetchData();
}

function onHandleSabmit(ev) {
  ev.preventDefault();
  clearArticlesContainer();
  query = ev.target.searchQuery.value.trim();
  page = 1;
  if (!query) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.buttonApp.classList.remove('load-more-app');

    return;
  }

  fetchData(query);
}

function lightbox() {
  new SimpleLightbox(' a', {
    fadeSpeed: '300',
    scrollZoom: true,
    animationSpeed: '250',
    doubleTapZoom: 2,
    disableScroll: true,
  }).refresh();
}

function clearArticlesContainer() {
  refs.gallery.innerHTML = '';
}

refs.buttonApp.addEventListener('click', onLoadMore);
refs.form.addEventListener('submit', onHandleSabmit);

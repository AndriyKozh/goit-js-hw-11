import axios from 'axios';
import './css/style.css';
import Notiflix from 'notiflix';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  button: document.querySelector('button'),
  gallery: document.querySelector('.gallery'),
  buttonApp: document.querySelector('.load-more'),
};

function render(items) {
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
  refs.gallery.innerHTML = list;
  if (items.length === 0) {
    Notiflix.Notify.failure(
      '"Sorry, there are no images matching your search query. Please try again."'
    );
    refs.buttonApp.classList.remove('load-more-app');
    return;
  }
}

// let gallery = new SimpleLightbox('.gallery a');
// gallery.on('show.simplelightbox', function () {});

const Key = '29524471-b67b2b2d9f34edfb071a81463';
const URL = 'https://pixabay.com/api';
let filters = `&image_type=photo&orientation=horizontal&safesearch=true`;
let listPhoto = 9;
let page = 1;
let item = [];
let query = '';

const fetchData = async page => {
  const { data } = await axios.get(
    `${URL}/?key=${Key}&per_page=${listPhoto}&page=${page}&q=${query}${filters}`
  );

  item = data.hits;

  render(item);
};

function onHandleSabmit(ev) {
  ev.preventDefault();
  refs.gallery.innerHTML = '';
  query = ev.target.searchQuery.value.trim();
  page = 1;
  setTimeout(() => {
    refs.buttonApp.classList.add('load-more-app');
  }, 2000);

  if (!query) {
    Notiflix.Notify.failure(
      '"Sorry, there are no images matching your search query. Please try again."'
    );

    return;
  }

  fetchData();
}
window.addEventListener('scroll', () => {
  const documentRect = document.documentElement.getBoundingClientRect();

  if (documentRect.bottom < document.documentElement.clientHeight + 150) {
    page += 1;
    fetchData(page);
  }
});

// function onLoadMore() {
//   let nextpage = (page += namberPage);
//   fetchData(nextpage);
// }

// refs.buttonApp.addEventListener('click', onLoadMore);
refs.form.addEventListener('submit', onHandleSabmit);

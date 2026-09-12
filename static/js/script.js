const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from((r || document).querySelectorAll(s));
const LSKEY = 'skyflx_demo_v1_';
const LS = {
  get(k, def) { try { return JSON.parse(localStorage.getItem(LSKEY + k)) ?? def; } catch { return def; } },
  set(k, v) { localStorage.setItem(LSKEY + k, JSON.stringify(v)); }
};

function getCsrfToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, 'csrftoken'.length + 1) === ('csrftoken=')) {
                cookieValue = decodeURIComponent(cookie.substring('csrftoken'.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function fetchWithCsrf(url, options = {}) {
    options.headers = options.headers || {};
    options.headers['X-CSRFToken'] = getCsrfToken();
    options.headers['X-Requested-With'] = 'XMLHttpRequest';
    options.credentials = 'same-origin';
    return fetch(url, options);
}

function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  for (const k in attrs) {
    if (k === 'class') e.className = attrs[k];
    else if (k.startsWith('data-')) e.setAttribute(k, attrs[k]);
    else if (k.startsWith('aria-')) e.setAttribute(k, attrs[k]);
    else e[k] = attrs[k];
  }
  if (Array.isArray(children)) {
    children.forEach(c => {
      if (c === null || c === undefined) return;
      if (typeof c === 'string') {
        e.appendChild(document.createTextNode(c));
      } else if (typeof c === 'number' || typeof c === 'boolean') {
        e.appendChild(document.createTextNode(String(c)));
      } else if (c.nodeType) {
        e.appendChild(c);
      } else {
        console.warn('Invalid child passed to el:', c);
      }
    });
  }
  return e;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

const placeholderPoster = (title = 'No Image') => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='450'><rect width='100%' height='100%' fill='#1a1a2e'/><text x='50%' y='50%' font-size='20' fill='#87CEEB' text-anchor='middle' dominant-baseline='middle' font-family='Arial'>${title}</text></svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
};

// Merge Django data with local data
let MOVIES = [];
if (window.siteData && window.siteData.all_movies && window.siteData.all_movies.length > 0) {
  MOVIES = window.siteData.all_movies.map(m => ({
    id: m.id.toString(),
    title: m.title,
    category: m.type,
    type: m.type,
    genre: m.genre,
    description: m.description,
    poster: m.poster_url,
    release_year: m.year,
    imdb: m.imdb_rating ? parseFloat(m.imdb_rating).toFixed(1) : 'N/A',
    views: Math.floor(Math.random() * 30000) + 1000,
    duration_min: Math.floor(Math.random() * 60) + 90,
    age_rating: '+13',
    language: 'English',
    country: 'USA'
  }));
} else {
  const DEFAULT_MOVIES = [
    {
      id: 'm1', title: 'Skyline Pursuit', category: 'movie', genre: 'Action',
      language: 'English', country: 'USA', description: 'A high-octane chase across futuristic cities.',
      poster: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=400',
      trailer: '', video: '', release_year: 2023, age_rating: '+13',
      duration_min: 120, episode_count: 0, imdb: 8.2, views: 12456, season: '', subtitles: 'en'
    },
    {
      id: 'm2', title: 'Moonlight Sonata', category: 'movie', genre: 'Drama',
      language: 'English', country: 'UK', description: 'A musician heals through music and love.',
      poster: 'https://images.pexels.com/photos/7991158/pexels-photo-7991158.jpeg?auto=compress&cs=tinysrgb&w=400',
      trailer: '', video: '', release_year: 2021, age_rating: '+13',
      duration_min: 105, episode_count: 0, imdb: 8.7, views: 9876, season: '', subtitles: 'en'
    },
    {
      id: 's1', title: 'Galactic Oddity', category: 'series', genre: 'Sci-Fi',
      language: 'English', country: 'USA', description: 'An astronaut discovers unexpected life on a distant moon.',
      poster: 'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=400',
      trailer: '', video: '', release_year: 2022, age_rating: '+13',
      duration_min: 0, episode_count: 8, imdb: 7.9, views: 20234, season: '1', subtitles: 'en'
    },
    {
      id: 'm3', title: 'Neon Nights', category: 'movie', genre: 'Sci-Fi',
      language: 'Korean', country: 'Korea', description: 'Neon-lit city drama with cyber intrigue.',
      poster: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=400',
      trailer: '', video: '', release_year: 2021, age_rating: '+16',
      duration_min: 115, episode_count: 0, imdb: 8.1, views: 18900, season: '', subtitles: 'ko,en'
    },
    {
      id: 'm4', title: 'Laugh Out Loud', category: 'movie', genre: 'Comedy',
      language: 'English', country: 'USA', description: 'A light-hearted comedy for the whole family.',
      poster: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400',
      trailer: '', video: '', release_year: 2019, age_rating: 'All',
      duration_min: 98, episode_count: 0, imdb: 6.9, views: 18123, season: '', subtitles: 'en'
    },
    {
      id: 'm5', title: 'Silent Echo', category: 'movie', genre: 'Thriller',
      language: 'English', country: 'USA', description: 'A psychological thriller about hidden truths.',
      poster: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400',
      trailer: '', video: '', release_year: 2022, age_rating: '+16',
      duration_min: 110, episode_count: 0, imdb: 7.5, views: 15234, season: '', subtitles: 'en'
    },
    {
      id: 's2', title: 'Mystery Manor', category: 'series', genre: 'Mystery',
      language: 'English', country: 'UK', description: 'A detective unravels secrets in an old mansion.',
      poster: 'https://images.pexels.com/photos/534171/pexels-photo-534171.jpeg?auto=compress&cs=tinysrgb&w=400',
      trailer: '', video: '', release_year: 2023, age_rating: '+13',
      duration_min: 0, episode_count: 10, imdb: 8.3, views: 22456, season: '1', subtitles: 'en'
    },
    {
      id: 'm6', title: 'Dragon Quest', category: 'movie', genre: 'Fantasy',
      language: 'English', country: 'USA', description: 'An epic fantasy adventure with dragons and magic.',
      poster: 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=400',
      trailer: '', video: '', release_year: 2020, age_rating: 'All',
      duration_min: 135, episode_count: 0, imdb: 7.8, views: 25678, season: '', subtitles: 'en'
    }
  ];
  MOVIES = LS.get('movies', DEFAULT_MOVIES);
}

LS.set('movies', MOVIES);
let USER = null;
let WATCHLIST = LS.get('watchlist', []);
let FAVORITES = LS.get('favorites', []);
let CHAT = LS.get('chat', []);

const GENRES = window.siteData && window.siteData.genres ? window.siteData.genres :
  ['Action','Adventure','Comedy','Drama','Horror','Thriller','Sci-Fi','Fantasy','Mystery','Romance','Animation','Documentary','Crime','History','War','Family'];

function setActiveNav(hash) {
  $$('.nav-link').forEach(a => a.classList.toggle('active', a.getAttribute('href') === hash));
}

function renderRecommendedMovies() {
  const grid = $('#recommended-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="text-center">در حال بارگذاری پیشنهادها...</div>';
  fetch('/movies/api/recommended/')
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        grid.innerHTML = '';
        if (data.movies.length === 0) {
          grid.innerHTML = '<div class="col-12 text-center">پیشنهادی برای شما وجود ندارد.</div>';
          return;
        }
        data.movies.forEach(item => {
          const cardItem = {
            id: item.id.toString(),
            title: item.title,
            poster: item.poster,
            release_year: item.year,
            imdb: (item.imdb && item.imdb !== null) ? parseFloat(item.imdb).toFixed(1) : 'N/A',
            type: item.type,
            category: item.type,
            genre: Array.isArray(item.genre) ? item.genre.join(', ') : '',
            description: '',
            views: 0,
            duration_min: 0,
            age_rating: '',
            language: '',
            country: ''
          };
          const card = createMediaCard(cardItem);
          grid.appendChild(card);
        });
      } else {
        grid.innerHTML = '<div class="alert alert-warning">امکان دریافت پیشنهادها وجود ندارد.</div>';
      }
    })
    .catch(err => {
      grid.innerHTML = '<div class="alert alert-danger">خطا در بارگذاری پیشنهادها</div>';
      console.error(err);
    });
}

function goto(hash) {
  if (!hash) hash = '#home';
  const mapping = {
    '#home': 'page-home',
    '#movies': 'page-movies',
    '#series': 'page-series',
    '#recommended': 'page-recommended',
    '#watchlist': 'page-watchlist',
    '#favorites': 'page-favorites',
    '#chat': 'page-chat',
    '#rankings': 'page-rankings',
    '#profile': 'page-profile'
  };
  document.querySelectorAll('.page').forEach(p => p.classList.add('d-none'));
  const id = mapping[hash] || 'page-home';
  const pageEl = document.getElementById(id);
  if (pageEl) pageEl.classList.remove('d-none');
  window.scrollTo({top:0,behavior:'smooth'});
  setActiveNav(hash);
  if (hash === '#recommended') {
    renderRecommendedMovies();
  }
  const navCollapse = document.querySelector('.navbar-collapse');
  if (navCollapse && navCollapse.classList.contains('show')) {
    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
    if (bsCollapse) bsCollapse.hide();
  }
}

window.addEventListener('hashchange', () => goto(location.hash));
if (!location.hash) location.hash = '#home';
goto(location.hash);

$('#brand').addEventListener('click', () => location.hash = '#home');

// ========== بخش احراز هویت ==========
function updateAuthUI() {
  if (USER && USER.is_authenticated) {
    $('#auth-inline').classList.add('d-none');
    $('#profile-inline').classList.remove('d-none');
    $('#profile-name').textContent = USER.full_name || USER.phone || 'User';
    $('#profile-email').textContent = USER.email || '';
    $('#profile-avatar').src = USER.avatar || placeholderPoster(USER.phone || 'User');
  } else {
    $('#auth-inline').classList.remove('d-none');
    $('#profile-inline').classList.add('d-none');
  }
}

$('#auth-toggle').addEventListener('click', () => {
  const title = $('#auth-title');
  if (title.textContent === 'Login') {
    title.textContent = 'Register';
    $('#auth-submit').textContent = 'Register';
    $('#auth-email').style.display = 'block';
    $('#auth-phone').style.display = 'none';
    $('#auth-password-confirm').style.display = 'block';
    $('#auth-username').placeholder = 'Phone number';
  } else {
    title.textContent = 'Login';
    $('#auth-submit').textContent = 'Login';
    $('#auth-email').style.display = 'none';
    $('#auth-phone').style.display = 'none';
    $('#auth-password-confirm').style.display = 'none';
    $('#auth-username').placeholder = 'Phone number';
  }
});

$('#auth-form').addEventListener('submit', async function(e){
  e.preventDefault();
  const mode = $('#auth-title').textContent.trim();
  const phone = $('#auth-username').value.trim();
  const password = $('#auth-password').value;
  const email = $('#auth-email').value.trim();
  const password2 = $('#auth-password-confirm').value;

  if (mode === 'Register') {
    if (!phone || !email || !password) {
      return showToast('لطفاً شماره تلفن، ایمیل و رمز عبور را پر کنید', 'warning');
    }
    if (password !== password2) {
      return showToast('رمز عبور و تکرار آن مطابقت ندارند', 'danger');
    }
    try {
      const res = await fetchWithCsrf('/accounts/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          phone: phone,
          email: email,
          password1: password,
          password2: password2
        })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast('ثبت‌نام موفق! در حال ورود...', 'success');
        window.location.reload();
      } else {
        if (data.errors) {
          let errorMsg = '';
          for (const [field, errList] of Object.entries(data.errors)) {
            errorMsg += `${field}: ${errList.join(', ')}\n`;
          }
          showToast(errorMsg, 'danger');
        } else {
          showToast(data.message || 'خطا در ثبت‌نام', 'danger');
        }
      }
    } catch (err) {
      showToast('خطا در ارتباط با سرور', 'danger');
    }
  } else { // Login
    if (!phone || !password) {
      return showToast('شماره تلفن و رمز عبور را وارد کنید', 'warning');
    }
    try {
      const res = await fetchWithCsrf('/accounts/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          phone: phone,
          password: password
        })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast('ورود موفق!', 'success');
        window.location.reload();
      } else {
        if (data.errors) {
          let errorMsg = '';
          for (const [field, errList] of Object.entries(data.errors)) {
            errorMsg += `${field}: ${errList.join(', ')}\n`;
          }
          showToast(errorMsg, 'danger');
        } else {
          showToast(data.message || 'شماره تلفن یا رمز عبور اشتباه است', 'danger');
        }
      }
    } catch (err) {
      showToast('خطا در ارتباط با سرور', 'danger');
    }
  }
});

$('#logout-btn').addEventListener('click', async () => {
  try {
    const res = await fetchWithCsrf('/accounts/logout/', { method: 'POST' });
    if (res.ok) {
      showToast('خارج شدید', 'info');
      window.location.reload();
    } else {
      showToast('خطا در خروج', 'danger');
    }
  } catch (err) {
    showToast('خطا در ارتباط با سرور', 'danger');
  }
});

$('#open-profile').addEventListener('click', () => {
  location.hash = '#profile';
  goto('#profile');
  fillProfileForm();
});

function fillProfileForm() {
  if (!USER || !USER.is_authenticated) return;
  $('#p-first').value = USER.first_name || '';
  $('#p-last').value = USER.last_name || '';
  $('#p-avatar').value = USER.avatar || '';
  $('#p-avatar-preview').src = USER.avatar || placeholderPoster(USER.phone || 'User');
  $('#p-bio').value = USER.bio || '';
  $('#p-birth').value = USER.birth_date || '';
  $('#p-country').value = USER.country || '';
  $('#p-premium').value = USER.is_premium ? 'true' : 'false';
}

$('#p-avatar').addEventListener('input', () => {
  $('#p-avatar-preview').src = $('#p-avatar').value || placeholderPoster('Avatar');
});

$('#profile-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!USER || !USER.is_authenticated) {
    showToast('لطفاً ابتدا وارد شوید', 'warning');
    return;
  }
  const formData = new FormData();
  const fullName = ($('#p-first').value.trim() + ' ' + $('#p-last').value.trim()).trim();
  if (fullName) formData.append('full_name', fullName);
  formData.append('bio', $('#p-bio').value.trim());
  formData.append('avatar', $('#p-avatar').value.trim());
  try {
    const res = await fetchWithCsrf('/accounts/profile/edit/', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (res.ok && data.status === 'success') {
      showToast('پروفایل ذخیره شد', 'success');
      window.location.reload();
    } else {
      showToast(data.message || 'خطا در ذخیره', 'danger');
    }
  } catch (err) {
    showToast('خطا در ارتباط با سرور', 'danger');
  }
});

$('#profile-cancel').addEventListener('click', () => {
  location.hash = '#home';
});
// ========== پایان احراز هویت ==========

function isUserPremium() {
  if (!USER) return false;
  // بررسی مقدار is_premium (می‌تواند boolean یا string باشد)
  return USER.is_premium === true || USER.is_premium === 'true';
}

function isUserAuthenticated() {
  return USER && (USER.is_authenticated === true || USER.is_authenticated === 'true');
}

function createMediaCard(item) {
  const tpl = $('#media-card-tpl').content.cloneNode(true);
  const img = tpl.querySelector('.poster-img');
  const titleEl = tpl.querySelector('.media-title');
  const posterTitle = tpl.querySelector('.poster-title');
  const posterRating = tpl.querySelector('.poster-rating');
  const meta = tpl.querySelector('.media-meta');

  img.src = item.poster || placeholderPoster(item.title);
  img.alt = item.title;
  img.onerror = () => img.src = placeholderPoster(item.title);

  titleEl.textContent = item.title;
  posterTitle.textContent = item.title;
  posterRating.textContent = `⭐ ${item.imdb || 'N/A'}`;
  meta.textContent = `${item.genre || ''} • ${item.release_year || ''}`;

  const watchlistBtn = tpl.querySelector('.watchlist');
  const isInWatchlist = WATCHLIST.includes(item.id.toString());
  watchlistBtn.textContent = isInWatchlist ? '✓ In Watchlist' : '+ Watchlist';
  watchlistBtn.setAttribute('data-movie-id', item.id);
  watchlistBtn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    toggleWatchlist(item.id);
  });

  const favBtn = tpl.querySelector('.fav');
  const isFav = FAVORITES.includes(item.id.toString());
  favBtn.textContent = isFav ? '♥' : '♡';
  favBtn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    toggleFavorite(item.id, ev.target);
  });

  const playBtn = tpl.querySelector('.play');
  playBtn.classList.remove('btn-primary', 'btn-success', 'btn-secondary');
  if (!isUserPremium() && item.category === 'movie') {
    playBtn.disabled = true;
    playBtn.textContent = '🔒 Premium';
    playBtn.classList.add('btn-secondary');
  } else {
    playBtn.classList.add('btn-primary');
    playBtn.textContent = 'Play';
    playBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      openMovieModal(item.id);
    });
  }

  const card = tpl.querySelector('.media-card');
  card.addEventListener('click', () => openMovieModal(item.id));
  return tpl;
}

function renderFeatured() {
  const track = $('#feat-track');
  track.innerHTML = '';
  const featured = MOVIES.slice(0, Math.min(MOVIES.length, 5));
  featured.forEach((item, idx) => {
    const div = el('div', { class: `carousel-item ${idx === 0 ? 'active' : ''}` });
    const img = el('img', { src: item.poster || placeholderPoster(item.title), alt: item.title, class: 'd-block w-100' });
    img.onerror = () => img.src = placeholderPoster(item.title);
    const caption = el('div', { class: 'carousel-caption d-none d-md-block' }, [
      el('h5', {}, [item.title]),
      el('p', {}, [item.description || ''])
    ]);
    div.appendChild(img);
    div.appendChild(caption);
    div.addEventListener('click', () => openMovieModal(item.id));
    track.appendChild(div);
  });
}

function renderGrid(containerSelector, list) {
  const container = $(containerSelector);
  container.innerHTML = '';
  list.forEach(item => {
    const card = createMediaCard(item);
    container.appendChild(card);
  });
}

function populateGenres() {
  const gFilters = ['#filter-genre-home','#movies-genre-filter','#series-genre-filter'];
  gFilters.forEach(sel => {
    const s = $(sel);
    if (!s) return;
    s.innerHTML = '<option value="">All genres</option>';
    GENRES.forEach(g => s.appendChild(el('option', { value: g }, [g])));
  });

  const bar = $('#genres-bar');
  bar.innerHTML = '';
  GENRES.forEach(g => {
    const b = el('button', { class: 'btn btn-sm btn-outline-primary', 'data-genre': g }, [g]);
    b.addEventListener('click', () => {
      location.hash = '#movies';
      goto('#movies');
      $('#movies-genre-filter').value = g;
      renderMoviesList();
    });
    bar.appendChild(b);
  });
}

function renderHomeSections() {
  renderFeatured();
  renderGrid('#grid-home', MOVIES.slice(0, 10));
  renderGrid('#grid-popular', MOVIES.slice().sort((a,b)=>b.views - a.views).slice(0, 10));
  populateGenres();
}

function renderMoviesList() {
  const q = ($('#movies-search').value || '').toLowerCase();
  const g = $('#movies-genre-filter').value;
  let list = MOVIES.filter(m => m.category === 'movie');
  if (g) {
    list = list.filter(x => {
      if (Array.isArray(x.genre)) {
        return x.genre.some(genre => genre.toLowerCase() === g.toLowerCase());
      } else if (typeof x.genre === 'string') {
        return x.genre.toLowerCase() === g.toLowerCase();
      }
      return false;
    });
  }
  if (q) {
    list = list.filter(x => (x.title + ' ' + (x.description||'')).toLowerCase().includes(q));
  }
  const sort = $('#movies-sort').value;
  if (sort === 'views') list.sort((a,b)=>b.views - a.views);
  if (sort === 'rating') list.sort((a,b)=>b.imdb - a.imdb);
  if (sort === 'newest') list.sort((a,b)=>b.release_year - a.release_year);
  renderGrid('#movies-grid', list);
}

function renderSeriesList() {
  const q = ($('#series-search').value || '').toLowerCase();
  const g = $('#series-genre-filter').value;
  let list = MOVIES.filter(m => m.category === 'series');
  if (g) {
    list = list.filter(x => {
      if (Array.isArray(x.genre)) {
        return x.genre.some(genre => genre.toLowerCase() === g.toLowerCase());
      } else if (typeof x.genre === 'string') {
        return x.genre.toLowerCase() === g.toLowerCase();
      }
      return false;
    });
  }
  if (q) {
    list = list.filter(x => (x.title + ' ' + (x.description||'')).toLowerCase().includes(q));
  }
  const sort = $('#series-sort').value;
  if (sort === 'views') list.sort((a,b)=>b.views - a.views);
  if (sort === 'rating') list.sort((a,b)=>b.imdb - a.imdb);
  if (sort === 'newest') list.sort((a,b)=>b.release_year - a.release_year);
  renderGrid('#series-grid', list);
}

$('#filter-genre-home').addEventListener('change', () => {
  const g = $('#filter-genre-home').value;
  let list = MOVIES;
  if (g) {
    list = list.filter(x => {
      if (Array.isArray(x.genre)) {
        return x.genre.some(genre => genre.toLowerCase() === g.toLowerCase());
      } else if (typeof x.genre === 'string') {
        return x.genre.toLowerCase() === g.toLowerCase();
      }
      return false;
    });
  }
  renderGrid('#grid-home', list.slice(0, 15));
});

$('#global-search').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  if (!q) {
    renderGrid('#grid-home', MOVIES.slice(0, 10));
    renderGrid('#grid-popular', MOVIES.slice().sort((a,b)=>b.views - a.views).slice(0, 10));
    return;
  }
  const results = MOVIES.filter(m => (m.title + ' ' + (m.description||'')).toLowerCase().includes(q));
  renderGrid('#grid-home', results.slice(0, 20));
});

$('#search-clear').addEventListener('click', () => {
  $('#global-search').value = '';
  $('#global-search').dispatchEvent(new Event('input'));
});

$('#load-more-home').addEventListener('click', () => {
  const currentCount = $('#grid-home').children.length;
  const more = MOVIES.slice(currentCount, currentCount + 10);
  more.forEach(m => $('#grid-home').appendChild(createMediaCard(m)));
});

// ========== توابع واچ‌لیست ==========
async function toggleWatchlist(id) {
  if (!USER || !USER.is_authenticated) {
    showToast('لطفاً ابتدا وارد شوید', 'warning');
    return false;
  }
  try {
    const res = await fetchWithCsrf(`/movies/toggle-watchlist/${id}/`, { method: 'POST' });
    const data = await res.json();
    if (res.ok && data.status) {
      if (data.status === 'added') {
        showToast('به لیست تماشا اضافه شد', 'success');
        if (!WATCHLIST.includes(id.toString())) WATCHLIST.push(id.toString());
      } else if (data.status === 'removed') {
        showToast('از لیست تماشا حذف شد', 'info');
        WATCHLIST = WATCHLIST.filter(i => i.toString() !== id.toString());
      }
      updateWatchlistButtons(id, data.status === 'added');
      renderWatchlist();
      return data.status === 'added';
    } else {
      showToast(data.message || 'خطا در عملیات', 'danger');
      return false;
    }
  } catch (err) {
    showToast('خطا در ارتباط با سرور', 'danger');
    return false;
  }
}

function updateWatchlistButtons(movieId, isInWatchlist) {
  $$(`.watchlist[data-movie-id="${movieId}"]`).forEach(btn => {
    btn.textContent = isInWatchlist ? '✓ In Watchlist' : '+ Watchlist';
  });
  const modalWatchBtn = $('#modal-item .btn-outline-primary');
  if (modalWatchBtn && modalWatchBtn.textContent.includes('Watchlist')) {
    modalWatchBtn.textContent = isInWatchlist ? '✓ In Watchlist' : '+ Watchlist';
  }
}

async function loadUserWatchlist() {
  if (!USER || !USER.is_authenticated) {
    WATCHLIST = [];
    return;
  }
  try {
    const res = await fetch('/movies/watchlist/api/');
    const data = await res.json();
    if (data.status === 'success') {
      WATCHLIST = data.watchlist.map(item => item.movie_id.toString());
      LS.set('watchlist', WATCHLIST);
      renderWatchlist();
      $$('.watchlist').forEach(btn => {
        const movieId = btn.getAttribute('data-movie-id');
        if (movieId) {
          btn.textContent = WATCHLIST.includes(movieId) ? '✓ In Watchlist' : '+ Watchlist';
        }
      });
    }
  } catch (err) {
    console.error('Failed to load watchlist', err);
  }
}

function renderWatchlist() {
  const grid = $('#watchlist-grid');
  if (!grid) return;
  grid.innerHTML = '';
  WATCHLIST.forEach(id => {
    const mv = MOVIES.find(m => m.id === id);
    if (mv) grid.appendChild(createMediaCard(mv));
  });
}

// ========== توابع علاقه‌مندی‌ها ==========
async function toggleFavorite(id, btnEl) {
  if (!USER || !USER.is_authenticated) {
    showToast('لطفاً ابتدا وارد شوید', 'warning');
    return false;
  }
  try {
    const res = await fetchWithCsrf(`/movies/toggle-favorite/${id}/`, { method: 'POST' });
    const data = await res.json();
    if (res.ok && data.status) {
      if (data.status === 'added') {
        showToast('به علاقه‌مندی‌ها اضافه شد', 'success');
        if (!FAVORITES.includes(id.toString())) FAVORITES.push(id.toString());
        if (btnEl) btnEl.textContent = btnEl.textContent.includes('Favorite') ? '♥ Favorite' : '♥';
      } else if (data.status === 'removed') {
        showToast('از علاقه‌مندی‌ها حذف شد', 'info');
        FAVORITES = FAVORITES.filter(i => i.toString() !== id.toString());
        if (btnEl) btnEl.textContent = btnEl.textContent.includes('Favorite') ? '♡ Favorite' : '♡';
      }
      updateFavoriteButtons(id, data.status === 'added');
      renderFavorites();
      return true;
    } else {
      showToast(data.message || 'خطا در عملیات', 'danger');
      return false;
    }
  } catch (err) {
    showToast('خطا در ارتباط با سرور', 'danger');
    return false;
  }
}

function updateFavoriteButtons(movieId, isFavorite) {
  $$('.fav').forEach(btn => {
    const card = btn.closest('.media-card');
    if (card) {
      const watchlistBtn = card.querySelector('.watchlist');
      if (watchlistBtn && watchlistBtn.getAttribute('data-movie-id') === movieId.toString()) {
        btn.textContent = isFavorite ? '♥' : '♡';
      }
    }
  });
  const modalFavBtn = $('#modal-item .btn-outline-danger');
  if (modalFavBtn) {
    modalFavBtn.textContent = isFavorite ? '♥ Favorite' : '♡ Favorite';
  }
}

async function loadUserFavorites() {
  if (!USER || !USER.is_authenticated) {
    FAVORITES = [];
    return;
  }
  try {
    const res = await fetch('/movies/favorites/api/');
    const data = await res.json();
    if (data.status === 'success') {
      FAVORITES = data.favorites.map(item => item.movie_id.toString());
      LS.set('favorites', FAVORITES);
      renderFavorites();
      $$('.fav').forEach(btn => {
        const card = btn.closest('.media-card');
        if (card) {
          const watchlistBtn = card.querySelector('.watchlist');
          if (watchlistBtn) {
            const movieId = watchlistBtn.getAttribute('data-movie-id');
            if (movieId && FAVORITES.includes(movieId)) {
              btn.textContent = '♥';
            } else if (movieId) {
              btn.textContent = '♡';
            }
          }
        }
      });
    }
  } catch (err) {
    console.error('Failed to load favorites', err);
  }
}

function renderFavorites() {
  const grid = $('#favorites-grid');
  if (!grid) return;
  grid.innerHTML = '';
  FAVORITES.forEach(id => {
    const mv = MOVIES.find(m => m.id === id);
    if (mv) grid.appendChild(createMediaCard(mv));
  });
}

// ========== امتیازدهی ==========
async function loadUserRatings() {
  if (!USER || !USER.is_authenticated) return;
  try {
    const res = await fetch('/movies/my-ratings/api/');
    const data = await res.json();
    if (data.status === 'success') {
      window.userRatings = {};
      data.ratings.forEach(r => {
        window.userRatings[r.movie_id] = r.score;
      });
      updateAllRatingStars();
    }
  } catch (err) {
    console.error('Failed to load ratings', err);
  }
}

function updateAllRatingStars() {
  $$('.rating-stars').forEach(container => {
    const movieId = container.dataset.movieId;
    if (movieId && window.userRatings && window.userRatings[movieId]) {
      const userScore = window.userRatings[movieId];
      const stars = container.querySelectorAll('.star');
      stars.forEach((star, idx) => {
        if (idx < userScore) {
          star.classList.add('fas', 'active');
          star.classList.remove('far');
        } else {
          star.classList.add('far');
          star.classList.remove('fas', 'active');
        }
      });
      const ratingText = container.parentElement?.querySelector('small');
      if (ratingText) ratingText.textContent = `${userScore}/10`;
    }
  });
}

async function rateMovie(movieId, score) {
  if (!USER || !USER.is_authenticated) {
    showToast('لطفاً ابتدا وارد شوید', 'warning');
    return false;
  }
  try {
    const res = await fetchWithCsrf(`/movies/rate/${movieId}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `score=${score}`
    });
    const data = await res.json();
    if (res.ok && data.status === 'success') {
      showToast('امتیاز شما ثبت شد', 'success');
      const avgElement = document.getElementById('modal-average-rating') || document.getElementById('average-rating');
      const totalElement = document.getElementById('modal-total-ratings') || document.getElementById('total-ratings');
      if (avgElement) avgElement.textContent = data.new_average.toFixed(1);
      if (totalElement) totalElement.textContent = (parseInt(totalElement.textContent) || 0) + 1;
      if (!window.userRatings) window.userRatings = {};
      window.userRatings[movieId] = score;
      updateAllRatingStars();
      return true;
    } else {
      showToast(data.message || 'خطا در ثبت امتیاز', 'danger');
      return false;
    }
  } catch (err) {
    showToast('خطا در ارتباط با سرور', 'danger');
    return false;
  }
}

function attachRatingStarsEvents(container) {
  const stars = container.querySelectorAll('.star');
  stars.forEach(star => {
    if (star.hasAttribute('data-listener')) return;
    star.setAttribute('data-listener', 'true');
    star.addEventListener('click', (e) => {
      e.stopPropagation();
      const ratingContainer = star.closest('.rating-stars');
      const movieId = ratingContainer.dataset.movieId;
      const score = parseInt(star.dataset.rating);
      if (movieId && score) rateMovie(movieId, score);
    });
  });
}

// ========== کامنت‌ها ==========
async function loadMovieComments(movieId, containerId = 'modal-comments') {
  const container = document.getElementById(containerId);
  if (!container) return;
  try {
    const res = await fetch(`/movies/comments/api/${movieId}/`);
    const data = await res.json();
    if (data.status === 'success') {
      container.innerHTML = '';
      if (data.comments.length === 0) {
        container.innerHTML = '<div class="no-comments">No comments yet. Be the first to comment!</div>';
      } else {
        data.comments.forEach(comment => {
          const commentDiv = createCommentElement(comment);
          container.appendChild(commentDiv);
        });
      }
      const totalCommentsSpan = document.getElementById('modal-total-comments');
      if (totalCommentsSpan) totalCommentsSpan.textContent = data.comments.length;
    }
  } catch (err) {
    console.error('Failed to load comments', err);
  }
}

function createCommentElement(comment) {
  const div = document.createElement('div');
  div.className = 'comment';
  div.id = `comment-${comment.id}`;
  div.innerHTML = `
    <div class="comment-header">
      <span class="author">${escapeHtml(comment.user_name)}</span>
      <span class="date">${escapeHtml(comment.created_at)}</span>
      ${comment.can_delete ? '<button class="btn small delete-comment" data-comment-id="' + comment.id + '" style="background-color:#dc3545; color:white; border:none; border-radius:4px; padding:4px 8px; cursor:pointer; font-size:12px;">Delete</button>' : ''}
    </div>
    <div class="comment-text">${escapeHtml(comment.text)}</div>
  `;
  if (comment.can_delete) {
    const deleteBtn = div.querySelector('.delete-comment');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteComment(comment.id);
      });
    }
  }
  return div;
}

async function submitComment(movieId, text) {
  if (!USER || !USER.is_authenticated) {
    showToast('لطفاً ابتدا وارد شوید', 'warning');
    return false;
  }
  if (!text.trim()) {
    showToast('متن کامنت نمی‌تواند خالی باشد', 'warning');
    return false;
  }
  try {
    const res = await fetchWithCsrf(`/movies/comment/add/${movieId}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `text=${encodeURIComponent(text)}`
    });
    const data = await res.json();
    if (res.ok && data.status === 'success') {
      showToast('کامنت با موفقیت ثبت شد', 'success');
      const container = document.getElementById('modal-comments');
      if (container) {
        const noComments = container.querySelector('.no-comments');
        if (noComments) noComments.remove();
        const commentEl = createCommentElement(data.comment);
        container.prepend(commentEl);
      }
      const totalCommentsSpan = document.getElementById('modal-total-comments');
      if (totalCommentsSpan) totalCommentsSpan.textContent = parseInt(totalCommentsSpan.textContent || '0') + 1;
      return true;
    } else {
      showToast(data.message || 'خطا در ثبت کامنت', 'danger');
      return false;
    }
  } catch (err) {
    showToast('خطا در ارتباط با سرور', 'danger');
    return false;
  }
}

async function deleteComment(commentId) {
  if (!confirm('آیا از حذف این کامنت اطمینان دارید؟')) return;
  try {
    const res = await fetchWithCsrf(`/movies/comment/delete/${commentId}/`, { method: 'POST' });
    const data = await res.json();
    if (res.ok && data.status === 'success') {
      showToast('کامنت حذف شد', 'info');
      const commentEl = document.getElementById(`comment-${commentId}`);
      if (commentEl) commentEl.remove();
      const totalCommentsSpan = document.getElementById('modal-total-comments');
      if (totalCommentsSpan) totalCommentsSpan.textContent = Math.max(0, parseInt(totalCommentsSpan.textContent || '0') - 1);
      const container = document.getElementById('modal-comments');
      if (container && container.children.length === 0) {
        container.innerHTML = '<div class="no-comments">No comments yet. Be the first to comment!</div>';
      }
    } else {
      showToast(data.message || 'خطا در حذف کامنت', 'danger');
    }
  } catch (err) {
    showToast('خطا در ارتباط با سرور', 'danger');
  }
}

// ========== چت ==========
function renderChat() {
  const win = $('#chat-window');
  win.innerHTML = '';
  CHAT.forEach(m => {
    const isMe = m.user === (USER && USER.username);
    const div = el('div', { class: `mb-2 ${isMe ? 'text-end' : ''}` }, [
      el('div', { class: `d-inline-block p-2 rounded ${isMe ? 'bg-primary text-white' : 'bg-light'}` }, [
        el('strong', {}, [m.user + ': ']),
        m.text,
        el('br'),
        el('small', { class: isMe ? 'text-white-50' : 'text-muted' }, [new Date(m.ts).toLocaleTimeString()])
      ])
    ]);
    win.appendChild(div);
  });
  win.scrollTop = win.scrollHeight;
}

$('#chat-send').addEventListener('click', () => {
  const text = $('#chat-input').value.trim();
  if (!text) return;
  const name = $('#chat-name').value.trim() || (USER && USER.username) || 'Guest';
  CHAT.push({ user: name, text, ts: Date.now() });
  LS.set('chat', CHAT);
  renderChat();
  $('#chat-input').value = '';
});
$('#chat-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#chat-send').click(); });

// ========== رنکینگ ==========
function renderRankings(range = 'week') {
  const list = $('#rankings-list');
  list.innerHTML = '';
  const arr = MOVIES.slice().sort((a,b) => (parseFloat(b.imdb)||0) - (parseFloat(a.imdb)||0)).slice(0,20);
  arr.forEach((m, idx) => {
    const li = el('div', { class: 'list-group-item list-group-item-action d-flex gap-3 align-items-center' });
    li.style.cursor = 'pointer';
    const rank = el('div', { class: 'fw-bold text-primary fs-4' }, [String(idx+1)]);
    const img = el('img', { src: m.poster || placeholderPoster(m.title), alt: m.title, class: 'rounded' });
    img.style.width = '60px'; img.style.height = '90px'; img.style.objectFit = 'cover';
    const content = el('div', { class: 'flex-grow-1' }, [
      el('h6', { class: 'mb-1' }, [m.title]),
      el('p', { class: 'mb-0 text-muted small' }, [`${m.genre||''} • ${m.release_year||''} • IMDB ${m.imdb||'N/A'}`])
    ]);
    li.appendChild(rank); li.appendChild(img); li.appendChild(content);
    li.addEventListener('click', () => openMovieModal(m.id));
    list.appendChild(li);
  });
}
$$('.rank-tab').forEach(b => b.addEventListener('click', (e) => {
  $$('.rank-tab').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  renderRankings(b.dataset.range);
}));
$$('.btn-group .btn[data-range]').forEach(b => b.addEventListener('click', (e) => {
  const parent = b.parentElement;
  parent.querySelectorAll('.btn').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
}));

// ========== تم تاریک/روشن ==========
let isDark = LS.get('theme', 'dark') === 'dark';
function applyTheme() {
  document.body.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
  const themeIcon = document.querySelector('#dark-toggle i');
  if (themeIcon) themeIcon.className = isDark ? 'bi bi-moon-stars' : 'bi bi-sun';

  // تنظیم مستقیم رنگ آیکون فیلتر (با اولویت بالا)
  const filterIcon = document.querySelector('#filter-btn i');
  if (filterIcon) {
    filterIcon.style.setProperty('color', isDark ? '#ffffff' : '#212529', 'important');
  }

  LS.set('theme', isDark ? 'dark' : 'light');
}
$('#dark-toggle').addEventListener('click', () => {
  isDark = !isDark;
  applyTheme();
});

$('#back-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
window.addEventListener('scroll', () => {
  const backToTopBtn = $('#back-top');
  if (window.scrollY > 300) backToTopBtn.classList.add('show');
  else backToTopBtn.classList.remove('show');
});

function showToast(text, type = 'info') {
  const toastContainer = document.getElementById('toast-container') || (() => {
    const div = el('div', { id: 'toast-container', class: 'position-fixed top-0 end-0 p-3' });
    div.style.zIndex = '9999';
    document.body.appendChild(div);
    return div;
  })();
  const toast = el('div', { class: `toast align-items-center text-white bg-${type} border-0`, role: 'alert' });
  toast.innerHTML = `<div class="d-flex"><div class="toast-body">${text}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
  toastContainer.appendChild(toast);
  const bsToast = new bootstrap.Toast(toast, { delay: 2000 });
  bsToast.show();
  toast.addEventListener('hidden.bs.toast', () => toast.remove());
}

document.getElementById('year').textContent = new Date().getFullYear();

$('#movies-search').addEventListener('input', () => renderMoviesList());
$('#movies-genre-filter').addEventListener('change', () => renderMoviesList());
$('#movies-sort').addEventListener('change', () => renderMoviesList());
$('#series-search').addEventListener('input', () => renderSeriesList());
$('#series-genre-filter').addEventListener('change', () => renderSeriesList());
$('#series-sort').addEventListener('change', () => renderSeriesList());

$$('.nav-link').forEach(a => a.addEventListener('click', (e) => {
  e.preventDefault();
  location.hash = a.getAttribute('href');
}));

// ========== جستجوی پیشرفته ==========
let currentSearchParams = {}, currentSearchPage = 1;
function loadGenresForFilter() {
  const select = document.getElementById('search-genre');
  if (!select) return;
  select.innerHTML = '<option value="">همه</option>';
  GENRES.forEach(g => {
    const option = document.createElement('option');
    option.value = g;
    option.textContent = g;
    select.appendChild(option);
  });
}
async function performAdvancedSearch(page = 1) {
  const q = document.getElementById('search-q')?.value.trim() || '';
  const genre = document.getElementById('search-genre')?.value || '';
  const yearFrom = document.getElementById('search-year-from')?.value || '';
  const yearTo = document.getElementById('search-year-to')?.value || '';
  const minRating = document.getElementById('search-min-rating')?.value || '';
  const type = document.getElementById('search-type')?.value || '';
  const params = new URLSearchParams();
  if (q) params.append('q', q);
  if (genre) params.append('genre', genre);
  if (yearFrom) params.append('year_from', yearFrom);
  if (yearTo) params.append('year_to', yearTo);
  if (minRating) params.append('min_rating', minRating);
  if (type) params.append('type', type);
  params.append('page', page);
  try {
    const res = await fetch(`/movies/advanced-search/?${params.toString()}`);
    const data = await res.json();
    if (data.status === 'success') {
      renderSearchResults(data);
      currentSearchPage = data.page;
      currentSearchParams = { q, genre, yearFrom, yearTo, minRating, type };
    } else {
      showToast('خطا در جستجو', 'danger');
    }
  } catch (err) {
    showToast('خطا در ارتباط با سرور', 'danger');
  }
}
function renderSearchResults(data) {
  const grid = document.getElementById('search-results-grid');
  if (!grid) return;
  grid.innerHTML = '';
  if (data.results.length === 0) {
    grid.innerHTML = '<div class="col-12 text-center">نتیجه‌ای یافت نشد.</div>';
  } else {
    data.results.forEach(item => {
      const cardItem = {
        id: item.id.toString(),
        title: item.title,
        poster: item.poster,
        release_year: item.year,
        imdb: (item.imdb && item.imdb !== null) ? parseFloat(item.imdb).toFixed(1) : 'N/A',
        type: item.type,
        category: item.type,
        genre: Array.isArray(item.genre) ? item.genre.join(', ') : '',
        description: '',
        views: 0,
        duration_min: 0,
        age_rating: '',
        language: '',
        country: ''
      };
      const card = createMediaCard(cardItem);
      grid.appendChild(card);
    });
  }
  const paginationDiv = document.getElementById('search-pagination');
  if (paginationDiv) {
    paginationDiv.innerHTML = '';
    if (data.has_previous) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'btn btn-outline-primary me-2';
      prevBtn.textContent = 'قبلی';
      prevBtn.addEventListener('click', () => performAdvancedSearch(data.page - 1));
      paginationDiv.appendChild(prevBtn);
    }
    const pageSpan = document.createElement('span');
    pageSpan.className = 'mx-2';
    pageSpan.textContent = `صفحه ${data.page} از ${data.num_pages}`;
    paginationDiv.appendChild(pageSpan);
    if (data.has_next) {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'btn btn-outline-primary ms-2';
      nextBtn.textContent = 'بعدی';
      nextBtn.addEventListener('click', () => performAdvancedSearch(data.page + 1));
      paginationDiv.appendChild(nextBtn);
    }
  }
  document.querySelectorAll('.page').forEach(p => p.classList.add('d-none'));
  const searchPage = document.getElementById('page-search-results');
  if (searchPage) searchPage.classList.remove('d-none');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
const filterBtn = document.getElementById('filter-btn');
if (filterBtn) {
  filterBtn.addEventListener('click', () => {
    const modalEl = document.getElementById('filterModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      loadGenresForFilter();
      modal.show();
    }
  });
}
const searchForm = document.getElementById('advanced-search-form');
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const modalEl = document.getElementById('filterModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    performAdvancedSearch(1);
  });
}
const resetBtn = document.getElementById('reset-filters');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    const qInput = document.getElementById('search-q');
    const genreSelect = document.getElementById('search-genre');
    const yearFrom = document.getElementById('search-year-from');
    const yearTo = document.getElementById('search-year-to');
    const minRating = document.getElementById('search-min-rating');
    const typeSelect = document.getElementById('search-type');
    if (qInput) qInput.value = '';
    if (genreSelect) genreSelect.value = '';
    if (yearFrom) yearFrom.value = '';
    if (yearTo) yearTo.value = '';
    if (minRating) minRating.value = '';
    if (typeSelect) typeSelect.value = '';
  });
}
const closeResultsBtn = document.getElementById('close-search-results');
if (closeResultsBtn) {
  closeResultsBtn.addEventListener('click', () => {
    location.hash = '#home';
    goto('#home');
  });
}

// ========== openMovieModal نهایی ==========
function openMovieModal(id) {
  const item = MOVIES.find(m => m.id === id);
  if (!item) return;
  const body = $('#modal-body');
  body.innerHTML = '';

  const container = el('div', { class: 'container-fluid' });
  const row = el('div', { class: 'row' });
  const col1 = el('div', { class: 'col-md-4' });
  const poster = el('img', { src: item.poster || placeholderPoster(item.title), alt: item.title, class: 'img-fluid rounded' });
  col1.appendChild(poster);

  const col2 = el('div', { class: 'col-md-8' });
  col2.appendChild(el('h3', {}, [item.title]));
  col2.appendChild(el('p', { class: 'text-muted' }, [`${item.genre} • ${item.release_year || ''} • ${item.age_rating || ''} • ${item.duration_min} min`]));
  col2.appendChild(el('p', {}, [item.description || 'No description available.']));
  col2.appendChild(el('p', { class: 'text-muted' }, [`IMDB: ${item.imdb || '-'} • Views: ${item.views || 0} • Language: ${item.language}`]));

  const btnGroup = el('div', { class: 'd-flex gap-2 mb-3' });
  if (item.trailer) {
    const trailerBtn = el('button', { class: 'btn btn-primary' }, ['Play Trailer']);
    trailerBtn.addEventListener('click', () => window.open(item.trailer, '_blank'));
    btnGroup.appendChild(trailerBtn);
  }
  const watchBtn = el('button', { class: 'btn btn-outline-primary' }, []);
  const isInWatchlist = WATCHLIST.includes(item.id.toString());
  watchBtn.textContent = isInWatchlist ? '✓ In Watchlist' : '+ Watchlist';
  watchBtn.addEventListener('click', () => { toggleWatchlist(item.id); });
  btnGroup.appendChild(watchBtn);
  const favBtn = el('button', { class: 'btn btn-outline-danger' }, []);
  const isFav = FAVORITES.includes(item.id.toString());
  favBtn.textContent = isFav ? '♥ Favorite' : '♡ Favorite';
  favBtn.addEventListener('click', () => toggleFavorite(item.id, favBtn));
  btnGroup.appendChild(favBtn);
  const shareBtn = el('button', { class: 'btn btn-outline-secondary' }, ['Share']);
  shareBtn.addEventListener('click', () => {
    navigator.clipboard?.writeText(location.href);
    showToast('Link copied!', 'success');
  });
  btnGroup.appendChild(shareBtn);

  // دکمه Play اصلی
  const playMainBtn = el('button', { class: 'btn btn-primary' }, ['▶ Play']);
  if (item.category === 'movie') {
    if (!isUserPremium()) {
      playMainBtn.disabled = true;
      playMainBtn.textContent = '🔒 Premium';
      playMainBtn.classList.remove('btn-primary');
      playMainBtn.classList.add('btn-secondary');
    } else {
      playMainBtn.addEventListener('click', () => {
        showToast('در حال پخش فیلم...', 'info');
      });
    }
  } else if (item.category === 'series') {
    playMainBtn.disabled = true;
    playMainBtn.textContent = '▶ سریال (انتخاب قسمت)';
    playMainBtn.classList.remove('btn-secondary');
    playMainBtn.classList.add('btn-primary');
    playMainBtn.style.opacity = '0.7';
  } else {
    playMainBtn.disabled = true;
    playMainBtn.textContent = '▶ نامشخص';
  }
  btnGroup.appendChild(playMainBtn);
  col2.appendChild(btnGroup);

  // امتیازدهی
  const userRatingDiv = el('div', { class: 'user-rating mt-3' });
  userRatingDiv.appendChild(el('h3', {}, ['Your Rating']));
  const starsContainer = el('div', { class: 'rating-stars', 'data-movie-id': item.id });
  for (let i = 1; i <= 10; i++) {
    starsContainer.appendChild(el('i', { class: 'star far fa-star', 'data-rating': i }));
  }
  userRatingDiv.appendChild(starsContainer);
  const ratingText = el('small', {}, ['Not rated']);
  userRatingDiv.appendChild(ratingText);
  if (window.userRatings && window.userRatings[item.id]) {
    const userScore = window.userRatings[item.id];
    ratingText.textContent = `${userScore}/10`;
    const stars = starsContainer.querySelectorAll('.star');
    stars.forEach((star, idx) => {
      if (idx < userScore) star.classList.add('fas', 'active');
      else star.classList.add('far');
      star.classList.remove('fas');
    });
  }
  attachRatingStarsEvents(starsContainer);
  col2.appendChild(userRatingDiv);

  // آمار
  const statsDiv = el('div', { class: 'stats d-flex gap-3 mt-3' });
  statsDiv.appendChild(el('div', { class: 'stat' }, [el('span', { class: 'label' }, ['Average Rating: ']), el('span', { class: 'value', id: 'modal-average-rating' }, [item.imdb || '0'])]));
  statsDiv.appendChild(el('div', { class: 'stat' }, [el('span', { class: 'label' }, ['Total Ratings: ']), el('span', { class: 'value', id: 'modal-total-ratings' }, ['0'])]));
  col2.appendChild(statsDiv);

  // بخش سریال
  if (item.category === 'series') {
    const seriesContainer = el('div', { class: 'mt-4', id: `series-${item.id}` });
    seriesContainer.innerHTML = '<div class="text-center">در حال بارگذاری قسمت‌ها...</div>';
    col2.appendChild(seriesContainer);
    fetch(`/movies/api/series-seasons/${item.id}/`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.seasons && data.seasons.length) {
          seriesContainer.innerHTML = '';
          data.seasons.forEach(season => {
            const seasonDiv = el('div', { class: 'mb-3 border rounded' });
            const seasonHeader = el('div', { class: 'bg-dark p-2 d-flex justify-content-between', style: 'cursor:pointer' }, [
              el('strong', { style: 'color:white' }, [`فصل ${season.season_number}: ${season.title || ''}`]),
              el('span', { class: 'toggle-icon', style: 'color:white' }, ['▼'])
            ]);
            const episodesDiv = el('div', { class: 'p-2', style: 'display:none' });
            season.episodes.forEach(ep => {
              const epRow = el('div', { class: 'd-flex justify-content-between border-bottom py-2' });
              epRow.appendChild(el('span', {}, [`قسمت ${ep.episode_number}: ${ep.title} (${ep.duration} دقیقه)`]));
              if (ep.video_url) {
                const watchBtn = el('button', { class: 'btn btn-sm btn-primary' }, ['پخش']);
                if (!isUserPremium()) {
                  watchBtn.disabled = true;
                  watchBtn.textContent = '🔒 Premium';
                  watchBtn.classList.remove('btn-primary');
                  watchBtn.classList.add('btn-secondary');
                } else {
                  watchBtn.addEventListener('click', () => window.open(ep.video_url, '_blank'));
                }
                epRow.appendChild(watchBtn);
              } else {
                epRow.appendChild(el('span', { class: 'text-muted' }, ['بدون لینک']));
              }
              episodesDiv.appendChild(epRow);
            });
            seasonHeader.addEventListener('click', () => {
              const visible = episodesDiv.style.display === 'block';
              episodesDiv.style.display = visible ? 'none' : 'block';
              seasonHeader.querySelector('.toggle-icon').textContent = visible ? '▼' : '▲';
            });
            seasonDiv.appendChild(seasonHeader);
            seasonDiv.appendChild(episodesDiv);
            seriesContainer.appendChild(seasonDiv);
          });
        } else {
          seriesContainer.innerHTML = '<div class="alert alert-info">هیچ قسمتی برای این سریال ثبت نشده است.</div>';
        }
      })
      .catch(err => { seriesContainer.innerHTML = '<div class="alert alert-danger">خطا در بارگذاری قسمت‌ها</div>'; console.error(err); });
  }

  // واکنش‌ها
  const reactions = el('div', { class: 'd-flex gap-2 mb-3' });
  ['👍','❤️','😂','😢'].forEach(emo => {
    const btn = el('button', { class: 'btn btn-sm btn-outline-secondary' }, [emo, ' ', el('span',{class:'count'}, ['0'])]);
    btn.addEventListener('click', () => {
      const span = btn.querySelector('.count');
      span.textContent = (Number(span.textContent) || 0) + 1;
    });
    reactions.appendChild(btn);
  });
  col2.appendChild(reactions);

  // کامنت‌ها
  const commentsWrap = el('div', {});
  commentsWrap.appendChild(el('h5', {}, ['Reviews & Comments']));
  const commentsList = el('div', { id: 'modal-comments', class: 'mb-3' });
  commentsWrap.appendChild(commentsList);
  const cmForm = el('form', { class: 'row g-2', id: 'comment-form-modal' });
  const textInput = el('textarea', { placeholder: 'Write your comment...', id: 'cm-text', class: 'form-control', rows: 2 });
  const submitBtn = el('button', { class: 'btn btn-primary', type: 'submit' }, ['Post Comment']);
  const isLoggedIn = USER && (USER.is_authenticated === true || USER.is_authenticated === 'true');
if (!isLoggedIn) {
  submitBtn.disabled = true;
  submitBtn.textContent = 'Login to Comment';
  submitBtn.classList.remove('btn-primary');
  submitBtn.classList.add('btn-secondary');
}

  if (!USER || !USER.is_authenticated) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Login to Comment';
    submitBtn.classList.remove('btn-primary');
    submitBtn.classList.add('btn-secondary');
  }
  cmForm.appendChild(el('div', { class: 'col-12' }, [textInput]));
  cmForm.appendChild(el('div', { class: 'col-12' }, [submitBtn]));
  commentsWrap.appendChild(cmForm);
  col2.appendChild(commentsWrap);

  row.appendChild(col1);
  row.appendChild(col2);
  container.appendChild(row);
  body.appendChild(container);

  const modal = new bootstrap.Modal($('#modal-item'));
  modal.show();

  loadMovieComments(item.id, 'modal-comments');
  cmForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const text = textInput.value.trim();
    if (await submitComment(item.id, text)) {
      textInput.value = '';
    }
  });
}

// مقداردهی اولیه
function init() {
  MOVIES = LS.get('movies', MOVIES);
  WATCHLIST = LS.get('watchlist', []);
  FAVORITES = LS.get('favorites', []);
  CHAT = LS.get('chat', []);
  if (window.siteData && window.siteData.user) {
    USER = window.siteData.user;
    loadUserWatchlist();
    loadUserFavorites();
    loadUserRatings();
  } else {
    USER = { is_authenticated: false };
  }
  populateGenres();
  renderHomeSections();
  renderMoviesList();
  renderSeriesList();
  renderWatchlist();
  renderFavorites();
  renderChat();
  renderRankings('week');
  updateAuthUI();
  applyTheme();
}
init();
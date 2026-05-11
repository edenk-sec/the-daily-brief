const CATEGORY_EMOJI = {
  Technology: '💻', World: '🌍', Science: '🔬',
  Finance: '📈', Health: '🩺', Sports: '🏃'
};

let allArticles = [];
let activeCategory = 'all';
let searchQuery = '';
let isListView = false;

async function fetchArticles() {
  const res = await fetch('./articles.json');
  allArticles = await res.json();
  render();
}

function render() {
  renderTicker();
  renderHero();
  renderArticles();
  renderTrending();
  renderCategoryTags();
}

function renderTicker() {
  const el = document.getElementById('ticker-content');
  const items = allArticles.map(a => `<span>◆ ${a.title}</span>`).join('');
  el.innerHTML = items + items;
}

function renderHero() {
  const featured = allArticles.filter(a => a.featured);
  const [main, ...sides] = featured;
  if (!main) return;

  document.getElementById('hero-main').innerHTML = `
    <div class="hero-card" onclick="openArticle(${main.id})">
      <div class="hero-image ${main.image}">${CATEGORY_EMOJI[main.category] || '📰'}</div>
      <div class="hero-body">
        <span class="category-badge">${main.category}</span>
        <h1 class="hero-title">${main.title}</h1>
        <p class="hero-summary">${main.summary}</p>
        <div class="meta">
          <span class="meta-author">${main.author}</span>
          <span>${formatDate(main.date)}</span>
          <span>${main.readTime}</span>
        </div>
      </div>
    </div>`;

  document.getElementById('hero-side').innerHTML = sides.slice(0, 3).map(a => `
    <div class="side-card" onclick="openArticle(${a.id})">
      <div class="side-image ${a.image}">${CATEGORY_EMOJI[a.category] || '📰'}</div>
      <div>
        <span class="category-badge">${a.category}</span>
        <div class="side-title">${a.title}</div>
        <div class="meta" style="margin-top:6px">
          <span>${formatDate(a.date)}</span>
          <span>${a.readTime}</span>
        </div>
      </div>
    </div>`).join('');
}

function renderArticles() {
  const grid = document.getElementById('articles-grid');
  const title = document.getElementById('section-title');

  let filtered = allArticles;
  if (activeCategory !== 'all') {
    filtered = filtered.filter(a => a.category === activeCategory);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  }

  title.textContent = activeCategory === 'all'
    ? (searchQuery ? `Results for "${searchQuery}"` : 'Latest Stories')
    : activeCategory;

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-results"><h3>No articles found</h3><p>Try a different search or category.</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map(a => `
    <div class="article-card" onclick="openArticle(${a.id})">
      <div class="article-image ${a.image}">${CATEGORY_EMOJI[a.category] || '📰'}</div>
      <div class="article-body">
        <span class="category-badge">${a.category}</span>
        <h3 class="article-title">${a.title}</h3>
        <p class="article-summary">${a.summary}</p>
        <div class="meta">
          <span class="meta-author">${a.author}</span>
          <span>${formatDate(a.date)}</span>
          <span>${a.readTime}</span>
        </div>
      </div>
    </div>`).join('');
}

function renderTrending() {
  const el = document.getElementById('trending-list');
  el.innerHTML = allArticles.slice(0, 5).map((a, i) => `
    <li class="trending-item" onclick="openArticle(${a.id})">
      <span class="trending-num">${i + 1}</span>
      <div>
        <div class="trending-title">${a.title}</div>
        <div class="trending-meta">${a.category} · ${a.readTime}</div>
      </div>
    </li>`).join('');
}

function renderCategoryTags() {
  const cats = [...new Set(allArticles.map(a => a.category))];
  document.getElementById('category-tags').innerHTML = cats.map(c => `
    <span class="cat-tag ${activeCategory === c ? 'active' : ''}" onclick="setCategory('${c}')">
      ${c}
    </span>`).join('');
}

function openArticle(id) {
  const a = allArticles.find(x => x.id === id);
  if (!a) return;
  document.getElementById('modal-content').innerHTML = `
    <div class="modal-category"><span class="category-badge">${a.category}</span></div>
    <h2 class="modal-title">${a.title}</h2>
    <div class="modal-meta">
      <span>By <strong>${a.author}</strong></span>
      <span>${formatDate(a.date)}</span>
      <span>${a.readTime}</span>
    </div>
    <div class="modal-image ${a.image}">${CATEGORY_EMOJI[a.category] || '📰'}</div>
    <p class="modal-body">${a.content}</p>`;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function setCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll('.nav-link').forEach(el => {
    el.classList.toggle('active', el.dataset.category === cat || (cat === 'all' && el.dataset.category === 'all'));
  });
  renderArticles();
  renderCategoryTags();
  document.querySelector('.main').scrollIntoView({ behavior: 'smooth' });
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Set date in header
document.getElementById('date-line').textContent =
  new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// Nav clicks
document.querySelectorAll('.nav-link').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    setCategory(el.dataset.category);
  });
});

// Search
document.getElementById('search-input').addEventListener('input', e => {
  searchQuery = e.target.value.trim();
  activeCategory = 'all';
  document.querySelectorAll('.nav-link').forEach(el => el.classList.toggle('active', el.dataset.category === 'all'));
  renderArticles();
  renderCategoryTags();
});

// View toggle
document.getElementById('grid-btn').addEventListener('click', () => {
  isListView = false;
  document.getElementById('articles-grid').classList.remove('list-view');
  document.getElementById('grid-btn').classList.add('active');
  document.getElementById('list-btn').classList.remove('active');
});
document.getElementById('list-btn').addEventListener('click', () => {
  isListView = true;
  document.getElementById('articles-grid').classList.add('list-view');
  document.getElementById('list-btn').classList.add('active');
  document.getElementById('grid-btn').classList.remove('active');
});

// Modal close
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

fetchArticles();

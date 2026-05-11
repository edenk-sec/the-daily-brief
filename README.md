# The Daily Brief

A lightweight localhost news website built with vanilla HTML, CSS, and JavaScript — no framework dependencies.

## Features

- Browsable news feed with 9 sample articles across 6 categories
- Breaking news ticker
- Featured hero section
- Live search and category filtering
- Grid / list view toggle
- Article modal with full content
- Responsive layout (mobile-friendly)
- Newsletter signup sidebar

## Getting Started

**Requirements:** Node.js (any version with built-in `http`)

```bash
node server.js
```

Then open [http://localhost:4000](http://localhost:4000).

## Project Structure

```
news-site/
├── server.js          # Minimal HTTP server + article data (no dependencies)
└── public/
    ├── index.html     # Page structure
    ├── style.css      # All styles
    └── app.js         # Rendering + interactivity
```

## Adding Articles

Edit the `articles` array in `server.js`. Each article takes:

```js
{
  id: 10,
  title: "Your headline",
  summary: "One-sentence summary shown in the card.",
  content: "Full article body shown in the modal.",
  category: "Technology",   // Technology | World | Science | Finance | Health | Sports
  author: "Author Name",
  date: "2026-05-11",
  readTime: "3 min read",
  featured: false,          // true = shown in hero section
  image: "tech"             // tech | world | science | finance | health | sports
}
```

## Customization

- **Port:** Change `PORT` at the top of `server.js`
- **Site name:** Edit `The Daily Brief` in `index.html` and `style.css`
- **Colors:** CSS custom properties at the top of `style.css` (`--red`, `--accent`, etc.)

# 💡 Grippy Box

> A lightweight Google Keep clone for capturing notes with color coding, pinning, and search.

[![Deploy to GitHub Pages](https://github.com/xerohour/grippy-box/actions/workflows/static.yml/badge.svg)](https://github.com/xerohour/grippy-box/actions/workflows/static.yml)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://xerohour.github.io/grippy-box/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## ✨ Features

- 📝 **Add Notes** — Quickly capture your thoughts
- ✏️ **Edit Notes** — Update your notes anytime
- 🗑️ **Delete Notes** — Remove notes with a confirmation prompt
- 📌 **Pin Notes** — Keep important notes at the top
- 🎨 **Color Coding** — Categorize with 5 background colors (White, Blue, Green, Yellow, Pink)
- 🔍 **Search** — Real-time debounced search by title and content
- 💾 **Persistence** — Notes saved in `localStorage` across browser sessions
- 🌙 **Dark Mode** — Automatic dark theme via `prefers-color-scheme`
- ♿ **Accessible** — Keyboard navigation, ARIA labels, focus management, screen reader support
- 🛡️ **Secure** — XSS-safe rendering, localStorage error handling

---

## 🚀 Quick Start

1. **Clone the repo**
   ```bash
   git clone https://github.com/xerohour/grippy-box.git
   cd grippy-box
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html — no build step needed!
   open index.html          # macOS
   start index.html         # Windows
   xdg-open index.html      # Linux
   ```

That's it. No `npm install`, no build tools — just vanilla HTML, CSS, and JavaScript.

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic structure with ARIA landmarks |
| CSS3 | Custom properties, dark mode, responsive grid |
| Vanilla JS | Zero dependencies, event delegation |
| Font Awesome 6 | UI icons |
| localStorage | Client-side persistence |

---

## 🌐 Deployment

### GitHub Pages

Pushes to `master` automatically deploy via the included GitHub Actions workflow.

### Vercel

Import the repo on [vercel.com](https://vercel.com) — the included `vercel.json` handles routing with zero config.

---

## 📁 Project Structure

```
grippy-box/
├── index.html          # Main HTML with embedded CSS
├── script.js           # Application logic
├── vercel.json         # Vercel deployment config
├── CHANGELOG.md        # Version history
└── .github/
    └── workflows/
        └── static.yml  # GitHub Pages deploy workflow
```

---

## 💾 Data Persistence

Notes are stored in the browser's `localStorage` under the key `keep-notes`. This means:

- ✅ Notes persist across page refreshes and browser restarts
- ✅ No server or database required
- ⚠️ Clearing browser data will erase your notes
- ⚠️ Notes are per-browser (not synced across devices)
- ⚠️ Storage quota is ~5MB (thousands of notes fit easily)

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Escape` | Close dialog |
| `Ctrl + Enter` | Save note (in dialog) |
| `Tab` / `Shift+Tab` | Navigate between elements |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

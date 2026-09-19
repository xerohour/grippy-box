# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-05-21

### Added
- **Security:** XSS-safe rendering using `textContent` instead of `innerHTML` for user content.
- **Accessibility:** Skip link, ARIA labels/roles, focus trapping in dialogs, keyboard shortcuts (Escape, Ctrl+Enter), screen reader announcements via `aria-live`.
- **Dark Mode:** Automatic dark theme via `prefers-color-scheme` CSS media query.
- **Delete Confirmation:** Custom confirm dialog replaces browser `confirm()`.
- **Debounced Search:** 250ms debounce on search input for better performance.
- **localStorage Error Handling:** Graceful fallback when storage is full or unavailable (private browsing).
- **Favicon:** SVG emoji favicon (💡) for browser tabs.
- **Meta/OG Tags:** `description`, `theme-color`, and Open Graph metadata.
- **Focus Management:** `focus-visible` outlines, focus restoration after dialog close.
- **Event Delegation:** Single delegated click listener on notes grid instead of per-note bindings.
- **Empty Note Validation:** Prevents saving notes with no title or content.

### Changed
- **Dialog Styles:** Moved all inline styles from `showNoteDialog()` into CSS classes.
- **HTML Structure:** Semantic `<main>`, `<button>` for add-note, `role="list"`/`role="listitem"` for notes grid.
- **Search Input:** Changed from `type="text"` to `type="search"`.
- **README:** Complete rewrite with emojis, badges, quickstart, keyboard shortcuts, data persistence docs.

---

## [1.0.0] - 2026-05-01

### Added
- **Core Functionality:** Initial release of the Google Keep Clone.
- **Note Management:** Support for adding, editing, deleting, and pinning notes.
- **Color Coding:** Ability to categorize notes with background colors (White, Blue, Green, Yellow, Pink).
- **Search:** Real-time search filtering by note title and content.
- **Persistence:** Full `LocalStorage` integration to save notes across browser sessions.
- **Project Documentation:** Comprehensive `README.md` with features and setup guide.
- **Deployment:** 
  - GitHub Actions workflow for automatic deployment to GitHub Pages.
  - Vercel configuration (`vercel.json`) for static site hosting.

### Changed
- **Code Organization:** Refactored inline JavaScript from `index.html` into a separate `script.js` file for better maintainability and cleaner structure.

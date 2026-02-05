# BootBlocks Theme

This repository contains the **BootBlocks** WordPress block theme.

## What Was Done Today

### WordPress Reset + Setup
- Stopped containers and removed volumes (`docker compose down -v`).
- Brought WordPress back up fresh (`docker compose up -d --build`).
- Installed WordPress via WP‑CLI.
- Switched site language to **German (de_DE)**.
- Purged all posts/pages, created a new **Startseite** (homepage), and set it as the front page.

### Theme Structure
- Rebuilt the theme as a block theme with templates and template parts.
- Added **container** and **container-fluid** page templates:
  - `templates/page-container.html`
  - `templates/page-fluid.html`
- Registered those templates in `theme.json` so they appear in the page settings dropdown.
- Ensured the **navigation width matches the chosen template** by adding two header variants:
  - `parts/header-container.html`
  - `parts/header-fluid.html`

### Editor “Invalid Block” Fixes
- Fixed multiple invalid block errors caused by mismatched block wrappers in templates/parts.
- Cleaned up database template parts that were overriding theme files.
- Removed old revisions and trashed content to avoid stale/invalid blocks reappearing.

### Carousel Work
- Brought back BootBlocks custom blocks (via `assets/js/blocks.js`).
- Added a **height control** to the BootBlocks carousel block (slider in block settings).
- Made carousel height consistent with `object-fit: cover`.
- Ensured front‑end and editor rendering stay in sync by shifting carousel output to a **server‑rendered** block in `functions.php`.

### Sticky Navigation
- Implemented sticky header behavior using the template part wrapper.

### File Highlights
- `functions.php` — theme setup, assets, editor assets, and server‑rendered carousel.
- `assets/js/blocks.js` — BootBlocks block registrations + carousel height setting.
- `style.css` — layout styles, carousel height CSS variable, sticky header, etc.
- `theme.json` — template registration for container vs. fluid.
- `templates/` + `parts/` — cleaned and valid block markup only.

## How To Use Templates
In the page editor, open **Page Settings → Template** and choose:
- **Page (Container)**
- **Page (Container Fluid)**

These templates automatically select the matching header width.

## Development Notes
- Theme path: `wp-content/themes/bootblocks`
- Git initialized in this theme directory.
- Remote: `git@github.com:l0tek/bootblocks.git`

## Admin Access (local)
- URL: `http://localhost`
- User: `admin`
- Password: `Admin123!`

(Please change the password after login.)

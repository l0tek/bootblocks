# BootBlocks Theme

Bootstrap‑basiertes WordPress‑Block‑Theme mit Container/Container‑Fluid Layouts.

## Installation

1. Theme nach `wp-content/themes/bootblocks` kopieren.
2. In WordPress unter **Design → Themes** aktivieren.

## Nutzung

### Templates (Container vs. Container‑Fluid)
Im Seiten‑Editor unter **Seite → Template** wählst du:
- **Page (Container)**
- **Page (Container Fluid)**

Die Navigation passt sich automatisch an die jeweilige Breite an.

### Carousel‑Block (BootBlocks)
Im Block‑Inserter findest du die Kategorie **BootBlocks** mit dem Carousel‑Block.
Die Höhe lässt sich im Block‑Inspector unter **Carousel Settings → Height (px)** einstellen.

## Struktur
- `functions.php` – Theme‑Setup, Assets, Block‑Registrierung
- `assets/js/blocks.js` – BootBlocks‑Blocks
- `style.css` – Theme‑Styles
- `templates/` – Page Templates
- `parts/` – Header/Footer Template‑Teile

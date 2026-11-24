# Rolando Tin Huerta Jr. — Public Portfolio & 2026 Résumé

Public static portfolio migrated from `rolando-huerta.open-bread-1630.chatgpt.site` and enhanced with the 2026 Master Résumé, a 31-track **Star Keep Retro 16-Bit OST** player (Vol. 1 & Vol. 2) with persistent mini-player across views, SharkFilet.com video walkthrough, 15-slide Visual Bible presentation, YouTube channels, and GitHub Pages automation.

## Architecture & Hosting Notes

- **100% Static Site:** Pure HTML5, CSS, and vanilla ES module JavaScript (`index.html`, `styles.css`, `app.js`, `ost-tracks.js`, `resume/index.html`, and `mockup/index.html`). No Node/Vite build step, database, server-side functions, or API keys are needed—making it directly compatible with **GitHub Pages** (`actions/deploy-pages@v4`).
- **Relative Paths:** All navigation, image, audio, and PDF links use relative paths so the site renders identically at a root custom domain or at a GitHub Pages project subpath such as `https://sharkfilet.github.io/rolando-huerta-portfolio/`.
- **Included Media:**
  - `assets/rolando-huerta.jpeg`, `assets/rolando-huerta-photo.jpg`, and `assets/showcase/*` — original portfolio and showcase graphics, Vol. 1 & Vol. 2 Retro OST covers, SharkFilet walkthrough thumbnail, and Visual Bible cover.
  - `assets/audio/*.m4a` & `assets/audio/vol2/*.m4a` — all 31 tracks across Vol. 1 (17 tracks) and Vol. 2: Cities & Idle (14 tracks) encoded as web-ready AAC `.m4a`, with a persistent always-visible mini-player that keeps streaming uninterrupted when switching to the in-page 2026 Résumé view.
  - `resume/Rolando_Huerta_Resume_2026_Master.pdf` & `resume/index.html` — 2026 Master Résumé PDF and matching interactive HTML résumé view.
  - `assets/downloads/*` — Star Keep 15-slide Visual Bible presentation PDF and Vol. 1 & Vol. 2 soundtrack tracklist sheets.
  - `mockup/` — Experimental **Arcanum Ledger** obsidian-and-gold theme mockup featuring Rolando's real suit portrait.

## Local Preview

Serve the repository folder locally with any static HTTP server:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.

## Publishing to GitHub & Enabling GitHub Pages

1. Create a **public** repository named `SharkFilet/rolando-huerta-portfolio` (or push this folder via GitHub Desktop / `git push`).
2. In the GitHub repository, open **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Pushing to `main` triggers `.github/workflows/deploy.yml` and publishes the site to `https://sharkfilet.github.io/rolando-huerta-portfolio/`.

## Privacy & Accuracy Notes

- Zero secrets, tokens, `.env` files, or internal company source code are present in this repository.
- `resume/Rolando_Huerta_Resume_2026_Master.pdf` intentionally includes your San Antonio location, email (`rolando.t.huerta@gmail.com`), and phone number `(361) 406-9089` as supplied in the PDF. Confirm you want those public before pushing.
- Credential qualifiers follow the 2026 résumé: Brown University B.A. (2007–2011), University of Oxford Executive Diploma (coursework completed; formal diploma conferral pending), and University of San Diego MBA / M.S. (admitted; coursework undertaken; deferred).

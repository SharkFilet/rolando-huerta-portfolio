# Rolando Tin Huerta Jr. — Public Portfolio & 2026 Résumé

Public static portfolio migrated from `rolando-huerta.open-bread-1630.chatgpt.site` and enhanced with the 2026 Master Résumé, an interactive 17-track **Star Keep Retro 16-Bit OST** player, playable RPG preview modal, downloads kit, and GitHub Pages automation.

## Architecture & Hosting Notes

- **100% Static Site:** Pure HTML5, CSS, and vanilla ES module JavaScript (`index.html`, `styles.css`, `app.js`, and `resume/index.html`). No Node/Vite build step, database, server-side functions, or API keys are needed—making it directly compatible with **GitHub Pages** (`actions/deploy-pages@v4`).
- **Relative Paths:** All navigation, image, audio, and PDF links use relative paths so the site renders identically at a root custom domain or at a GitHub Pages project subpath such as `https://sharkfilet.github.io/rolando-huerta-portfolio/`.
- **Included Media:**
  - `assets/rolando-huerta.jpeg` and `assets/showcase/*` — original portfolio and showcase graphics plus the Star Keep Retro 16-Bit OST cover.
  - `assets/audio/*.m4a` — all 17 tracks of the BeepBox 16-bit Retro OST encoded as web-ready AAC `.m4a` (`preload="none"` so bandwidth is only used on Play).
  - `resume/Rolando_Huerta_Resume_2026_Master.pdf` & `resume/index.html` — 2026 Master Résumé PDF and matching interactive HTML résumé view.
  - `assets/downloads/star-keep-retro-ost-notes.txt` — downloadable soundtrack tracklist and credits.

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

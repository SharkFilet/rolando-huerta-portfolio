import { OST_TRACKS, HERO_DECK } from './ost-tracks.js';

if (!Object.hasOwn(HTMLElement.prototype, 'popover')) {
  import('https://unpkg.com/@oddbird/popover-polyfill@latest/dist/popover.min.js').catch(() => {});
}

const ASSET_BASE = document.body.dataset.base || './';
const STORAGE_KEY = 'rth_ost_state_v2';
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function assetUrl(relPath) {
  return new URL(relPath, new URL(ASSET_BASE, window.location.href)).href;
}

function readAudioState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAudioState(patch) {
  try {
    const current = readAudioState();
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
  } catch {
    // Ignore storage quota or private-mode restrictions
  }
}

function initNavbar(onViewNavigate) {
  const header = document.querySelector('.site-header');
  const inner = header?.querySelector('.header-inner');
  const menu = document.getElementById('site-menu');
  if (!header || !inner || !menu) return;

  let lastWide = null;
  let lastWidth = header.clientWidth;

  const updateLayout = (forceMeasure = false) => {
    const currentWidth = header.clientWidth;
    if (!forceMeasure && lastWide === false && currentWidth <= lastWidth) {
      lastWidth = currentWidth;
      return;
    }
    lastWidth = currentWidth;

    const wasOpen = !header.classList.contains('is-wide') && menu.matches(':popover-open');
    header.classList.add('is-measuring');
    header.classList.add('is-wide');
    menu.removeAttribute('popover');

    const fits = inner.scrollWidth <= inner.clientWidth + 1;
    header.classList.toggle('is-wide', fits);
    if (fits) {
      menu.removeAttribute('popover');
    } else {
      menu.setAttribute('popover', 'auto');
      if (wasOpen && typeof menu.showPopover === 'function') {
        try {
          menu.showPopover();
        } catch {
          // Ignore if popover state changed
        }
      }
    }
    lastWide = fits;

    requestAnimationFrame(() => {
      header.classList.remove('is-measuring');
    });
  };

  updateLayout(true);

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => updateLayout(true));
    ro.observe(header);
    ro.observe(menu);
  } else {
    window.addEventListener('resize', () => updateLayout(true));
  }

  menu.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    if (!header.classList.contains('is-wide') && typeof menu.hidePopover === 'function') {
      try {
        menu.hidePopover();
      } catch {
        // Ignore if already closed
      }
    }
    if (link.dataset.view && onViewNavigate) {
      event.preventDefault();
      onViewNavigate(link.dataset.view, link.dataset.scrollTarget || null);
    }
  });

  // Scroll spy for portfolio sections
  const sectionLinks = [...menu.querySelectorAll('a[href^="#"]')];
  const targets = sectionLinks
    .map((a) => ({ link: a, target: document.querySelector(a.getAttribute('href')) }))
    .filter((entry) => entry.target);

  if (targets.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        if (document.body.dataset.activeView === 'resume') return;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const item of targets) {
            if (item.target === entry.target) {
              item.link.setAttribute('aria-current', 'true');
            } else {
              item.link.removeAttribute('aria-current');
            }
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );

    for (const item of targets) {
      spy.observe(item.target);
    }
  }
}

function initViewSwitcher() {
  const portfolioView = document.getElementById('portfolio-view');
  const resumeView = document.getElementById('resume-view');
  if (!portfolioView || !resumeView) return null;

  const setActiveNavForView = (viewName) => {
    for (const link of document.querySelectorAll('#site-menu a')) {
      if (viewName === 'resume') {
        if (link.dataset.view === 'resume') {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      } else if (link.dataset.view === 'resume') {
        link.removeAttribute('aria-current');
      }
    }
  };

  const applyView = (viewName, scrollTarget = null, pushHistory = true) => {
    const showResume = viewName === 'resume';

    portfolioView.hidden = showResume;
    resumeView.hidden = !showResume;
    document.body.dataset.activeView = showResume ? 'resume' : 'portfolio';
    setActiveNavForView(viewName);

    if (showResume) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
    } else if (scrollTarget) {
      const el = document.querySelector(scrollTarget);
      el?.scrollIntoView({ behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
    }

    if (pushHistory) {
      const nextHash = showResume ? '#resume' : scrollTarget || '#setup';
      if (window.location.hash !== nextHash) {
        history.pushState({ view: viewName, scrollTarget }, '', nextHash);
      }
    }

    if (showResume) {
      document.getElementById('resume-heading')?.focus({ preventScroll: true });
    } else if (scrollTarget) {
      const targetEl = document.querySelector(scrollTarget);
      const heading = targetEl?.querySelector('h1, h2') || targetEl;
      heading?.focus?.({ preventScroll: true });
    } else {
      document.getElementById('main-content')?.focus({ preventScroll: true });
    }
  };

  // Wire any inline triggers with data-view
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-view]');
    if (!trigger) return;
    // Let navbar handler run for #site-menu links to avoid double firing
    if (trigger.closest('#site-menu')) return;
    event.preventDefault();
    applyView(trigger.dataset.view, trigger.dataset.scrollTarget || null, true);
  });

  // Also allow regular #section links inside mini-player / resume view to jump back to portfolio
  document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor || anchor.dataset.view) return;
    const hash = anchor.getAttribute('href');
    if (hash === '#resume') {
      event.preventDefault();
      applyView('resume', null, true);
      return;
    }
    if (document.body.dataset.activeView === 'resume' && hash.length > 1) {
      const targetEl = document.querySelector(hash);
      if (targetEl && portfolioView.contains(targetEl)) {
        event.preventDefault();
        applyView('portfolio', hash, true);
      }
    }
  });

  window.addEventListener('popstate', () => {
    const hash = window.location.hash;
    if (hash === '#resume') {
      applyView('resume', null, false);
    } else {
      applyView('portfolio', hash && hash !== '#setup' ? hash : null, false);
    }
  });

  document.getElementById('inline-print-resume-btn')?.addEventListener('click', () => {
    window.print();
  });

  if (window.location.hash === '#resume') {
    applyView('resume', null, false);
  }

  return applyView;
}

function initHeroDeck(onViewNavigate) {
  const eyebrow = document.getElementById('hero-card-eyebrow');
  const number = document.getElementById('hero-card-number');
  const title = document.getElementById('hero-card-title');
  const copy = document.getElementById('hero-card-copy');
  const link = document.getElementById('hero-card-link');
  const nextBtn = document.getElementById('hero-card-next');
  const counter = document.getElementById('hero-card-counter');
  if (!eyebrow || !number || !title || !copy || !link || !nextBtn || !counter) return;

  let index = 0;

  const render = () => {
    const slide = HERO_DECK[index];
    eyebrow.textContent = slide.eyebrow;
    number.textContent = slide.number;
    title.textContent = slide.title;
    copy.textContent = slide.copy;
    link.textContent = slide.linkText;
    link.setAttribute('href', slide.linkHref);
    if (slide.linkHref.startsWith('#')) {
      link.removeAttribute('target');
      link.removeAttribute('rel');
    } else {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
    counter.textContent = `${index + 1} / ${HERO_DECK.length}`;
  };

  nextBtn.addEventListener('click', () => {
    index = (index + 1) % HERO_DECK.length;
    render();
  });

  link.addEventListener('click', (event) => {
    if (link.getAttribute('href') === '#soundtrack' && onViewNavigate) {
      event.preventDefault();
      onViewNavigate('portfolio', '#soundtrack');
    }
  });
}

function initCompetencyTabs() {
  const tablist = document.getElementById('competency-tablist');
  if (!tablist) return;
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((tab) => document.getElementById(tab.dataset.panel));

  const selectTab = (nextTab, focusIt = false) => {
    tabs.forEach((tab, idx) => {
      const active = tab === nextTab;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = panels[idx];
      if (panel) {
        panel.hidden = !active;
        if (active) panel.setAttribute('tabindex', '0');
        else panel.removeAttribute('tabindex');
      }
    });
    nextTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    if (focusIt) nextTab.focus();
  };

  tablist.addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (tab) selectTab(tab, false);
  });

  tablist.addEventListener('keydown', (event) => {
    const current = event.target.closest('[role="tab"]');
    if (!current) return;
    const idx = tabs.indexOf(current);
    let nextIdx = null;
    if (event.key === 'ArrowRight') nextIdx = (idx + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') nextIdx = (idx - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') nextIdx = 0;
    else if (event.key === 'End') nextIdx = tabs.length - 1;
    if (nextIdx !== null) {
      event.preventDefault();
      selectTab(tabs[nextIdx], true);
    }
  });
}

function initDialogs() {
  for (const trigger of document.querySelectorAll('[data-open-dialog]')) {
    trigger.addEventListener('click', () => {
      const dialog = document.getElementById(trigger.dataset.openDialog);
      if (dialog && typeof dialog.showModal === 'function') {
        dialog.showModal();
      }
    });
  }

  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const isOutside = (event, dialog) => {
      const r = dialog.getBoundingClientRect();
      return (
        event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom
      );
    };

    for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
      let pressedOutside = false;
      dialog.addEventListener('pointerdown', (event) => {
        pressedOutside = isOutside(event, dialog);
      });
      dialog.addEventListener('pointerup', (event) => {
        if (pressedOutside && isOutside(event, dialog)) {
          dialog.close();
        }
        pressedOutside = false;
      });
    }
  }
}

function initClipboardButtons() {
  const status = document.getElementById('copy-status');
  const shortBio =
    'Rolando Tin Huerta Jr. is a Systems Architect, Technical Founder, and Published Author building CreatorOS, EmotiConnect, and SharkCare at SharkFilet, Inc., alongside the Star Keep transmedia sci-fi universe (novel, Webtoon manga, playable RPG demo, and 16-bit retro OST).';

  const copyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      if (status) status.textContent = `${label} copied to clipboard.`;
    } catch {
      if (status) status.textContent = `Ready: ${text}`;
    }
  };

  document.getElementById('copy-bio-btn')?.addEventListener('click', () => {
    copyText(shortBio, 'Short bio');
  });

  document.getElementById('copy-email-btn')?.addEventListener('click', () => {
    copyText('rolando.t.huerta@gmail.com', 'Email address');
  });
}

function initYouTubeFacades(pauseOstCallback) {
  for (const btn of document.querySelectorAll('[data-yt-embed]')) {
    btn.addEventListener('click', () => {
      const container = btn.closest('.yt-facade');
      const videoId = btn.dataset.ytEmbed;
      if (!container || !videoId) return;
      pauseOstCallback?.();
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.title = btn.dataset.ytTitle || 'YouTube Video Player';
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.className = 'yt-iframe';
      container.replaceChildren(iframe);
    });
  }
}

function formatClock(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function initOstPlayer(onViewNavigate) {
  const audio = document.getElementById('ost-audio');
  const tracklistEl = document.getElementById('ost-tracklist');
  const coverImg = document.getElementById('ost-cover-img');
  const titleEl = document.getElementById('ost-current-title');
  const chapterEl = document.getElementById('ost-current-chapter');
  const badgeEl = document.getElementById('ost-mood-badge');
  const playBtn = document.getElementById('ost-play-btn');
  const prevBtn = document.getElementById('ost-prev-btn');
  const nextBtn = document.getElementById('ost-next-btn');
  const shuffleBtn = document.getElementById('ost-shuffle-btn');
  const loopBtn = document.getElementById('ost-loop-btn');
  const seekEl = document.getElementById('ost-seek');
  const timeCurEl = document.getElementById('ost-time-current');
  const timeDurEl = document.getElementById('ost-time-duration');
  const volEl = document.getElementById('ost-volume');
  const muteBtn = document.getElementById('ost-mute-btn');
  const dlCurrentEl = document.getElementById('ost-download-current');
  const filterTablist = document.getElementById('ost-filter-tablist');
  const canvas = document.getElementById('ost-visualizer');
  const navPill = document.getElementById('nav-ost-toggle');
  const heroPlayBtn = document.getElementById('hero-play-ost');

  // Persistent mini-player elements (present on both main site, mockup, and standalone /resume/)
  const miniDock = document.getElementById('mini-player');
  const miniStatus = document.getElementById('mini-status-label');
  const miniTitle = document.getElementById('mini-track-title');
  const miniPrevBtn = document.getElementById('mini-prev-btn');
  const miniPlayBtn = document.getElementById('mini-play-btn');
  const miniNextBtn = document.getElementById('mini-next-btn');
  const miniCollapseBtn = document.getElementById('mini-collapse-btn');

  if (!audio) return null;

  const saved = readAudioState();
  let currentIndex = Number.isInteger(saved.index) && saved.index >= 0 && saved.index < OST_TRACKS.length ? saved.index : 0;
  let activeFilter = 'all';
  let isShuffle = false;
  let isLoop = false;
  let userPaused = Boolean(saved.userPaused);
  let waitingForGesture = false;
  let audioCtx = null;
  let analyser = null;
  let sourceNode = null;
  let animId = null;

  if (typeof saved.volume === 'number') {
    audio.volume = Math.min(1, Math.max(0, saved.volume));
    if (volEl) volEl.value = String(audio.volume);
  }
  if (typeof saved.muted === 'boolean') {
    audio.muted = saved.muted;
  }

  const ctx2d = canvas?.getContext('2d') ?? null;

  const drawStaticBars = () => {
    if (!ctx2d || !canvas) return;
    const { width, height } = canvas;
    ctx2d.clearRect(0, 0, width, height);
    const barCount = 28;
    const gap = 4;
    const barW = Math.floor((width - gap * (barCount - 1)) / barCount);
    for (let i = 0; i < barCount; i++) {
      const pct = 0.22 + 0.48 * Math.abs(Math.sin((i + 1) * 0.65));
      const barH = Math.max(6, Math.round(height * pct));
      ctx2d.fillStyle = i % 4 === 0 ? '#e4683d' : '#a4d9ce';
      ctx2d.fillRect(i * (barW + gap), height - barH, barW, barH);
    }
  };

  const drawVisualizerFrame = () => {
    if (!ctx2d || !canvas) return;
    if (audio.paused || reducedMotionQuery.matches) {
      drawStaticBars();
      animId = null;
      return;
    }

    const { width, height } = canvas;
    ctx2d.clearRect(0, 0, width, height);
    const barCount = 28;
    const gap = 4;
    const barW = Math.floor((width - gap * (barCount - 1)) / barCount);

    if (analyser) {
      const bins = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(bins);
      for (let i = 0; i < barCount; i++) {
        const val = bins[i % bins.length] / 255;
        const barH = Math.max(6, Math.round(val * (height - 8)));
        ctx2d.fillStyle = val > 0.68 ? '#e4683d' : '#a4d9ce';
        ctx2d.fillRect(i * (barW + gap), height - barH, barW, barH);
      }
    } else {
      const t = performance.now() * 0.004;
      for (let i = 0; i < barCount; i++) {
        const val = 0.25 + 0.65 * Math.abs(Math.sin(t + i * 0.45));
        const barH = Math.max(6, Math.round(val * (height - 8)));
        ctx2d.fillStyle = val > 0.72 ? '#e4683d' : '#a4d9ce';
        ctx2d.fillRect(i * (barW + gap), height - barH, barW, barH);
      }
    }

    animId = requestAnimationFrame(drawVisualizerFrame);
  };

  const ensureAudioGraph = () => {
    if (audioCtx || !('AudioContext' in window || 'webkitAudioContext' in window)) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new Ctx();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      sourceNode = audioCtx.createMediaElementSource(audio);
      sourceNode.connect(analyser);
      analyser.connect(audioCtx.destination);
    } catch {
      analyser = null;
    }
  };

  const getFilteredIndices = () =>
    OST_TRACKS.map((track, idx) => ({ track, idx }))
      .filter(({ track }) => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'vol1') return track.vol === 1;
        if (activeFilter === 'vol2') return track.vol === 2;
        return track.mood === activeFilter;
      })
      .map(({ idx }) => idx);

  const syncPlayUI = () => {
    const playing = !audio.paused && Boolean(audio.currentSrc);
    const track = OST_TRACKS[currentIndex];
    if (playBtn) {
      playBtn.textContent = playing ? '❚❚ Pause' : '▶ Play';
      playBtn.setAttribute('aria-label', playing ? 'Pause current track' : 'Play current track');
    }
    if (miniPlayBtn) {
      miniPlayBtn.textContent = playing ? '❚❚' : '▶';
      miniPlayBtn.setAttribute('aria-label', playing ? 'Pause soundtrack' : 'Play soundtrack');
    }
    if (miniStatus) {
      if (playing) {
        miniStatus.textContent = `Vol. ${track.vol} · Playing`;
      } else if (waitingForGesture && !userPaused) {
        miniStatus.textContent = `Vol. ${track.vol} · Click ▶ or tap page`;
      } else {
        miniStatus.textContent = `Vol. ${track.vol} · Paused`;
      }
    }
    if (miniDock) {
      miniDock.classList.toggle('is-playing', playing);
    }
    if (navPill) {
      navPill.classList.toggle('is-playing', playing);
      const pillText = navPill.querySelector('.pill-label');
      if (pillText) {
        pillText.textContent = playing
          ? `V${track.vol}·${track.num} Playing`
          : 'Retro OST';
      }
    }
    if (heroPlayBtn) {
      heroPlayBtn.textContent = playing ? '❚❚ Pause Retro OST' : '▶ Play Retro OST';
    }
    if (playing && !animId && !reducedMotionQuery.matches) {
      animId = requestAnimationFrame(drawVisualizerFrame);
    } else if (!playing) {
      if (animId) cancelAnimationFrame(animId);
      animId = null;
      drawStaticBars();
    }
  };

  const renderTracklist = () => {
    if (!tracklistEl) return;
    const visible = getFilteredIndices();
    tracklistEl.innerHTML = '';

    for (const idx of visible) {
      const track = OST_TRACKS[idx];
      const li = document.createElement('li');
      li.className = `ost-track-row${idx === currentIndex ? ' is-active' : ''}`;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ost-track-trigger';
      btn.setAttribute('aria-current', idx === currentIndex ? 'true' : 'false');
      btn.innerHTML = `
        <span class="ost-track-num">V${track.vol}·${track.num}</span>
        <span class="ost-track-meta">
          <span class="ost-track-title"></span>
          <span class="ost-track-sub"></span>
        </span>
        <span class="ost-track-stamp">${track.stamp}</span>
      `;
      btn.querySelector('.ost-track-title').textContent = track.title;
      btn.querySelector('.ost-track-sub').textContent = track.chapter;
      btn.addEventListener('click', () => {
        userPaused = false;
        waitingForGesture = false;
        loadTrack(idx, true);
      });

      const dl = document.createElement('a');
      dl.className = 'ost-dl-link';
      dl.href = assetUrl(track.file);
      dl.download = `vol${track.vol}-${track.num}-${track.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.m4a`;
      dl.setAttribute('aria-label', `Download ${track.title} audio`);
      dl.textContent = '↓ M4A';

      li.append(btn, dl);
      tracklistEl.append(li);
    }
  };

  const updateNowPlayingMeta = () => {
    const track = OST_TRACKS[currentIndex];
    if (titleEl) titleEl.textContent = `V${track.vol} · ${track.num}. ${track.title}`;
    if (chapterEl) chapterEl.textContent = track.chapter;
    if (badgeEl) badgeEl.textContent = `VOL. ${track.vol} · ${track.mood.toUpperCase()}`;
    if (coverImg) {
      coverImg.src = assetUrl(track.cover);
      coverImg.alt =
        track.vol === 2
          ? 'Star Keep Volume 2 Cities and Idle 16-Bit Retro OST cover art'
          : 'Star Keep Volume 1 Retro 16-Bit OST cover art';
    }
    if (miniTitle) miniTitle.textContent = `${track.num}. ${track.title}`;
    if (dlCurrentEl) {
      dlCurrentEl.href = assetUrl(track.file);
      dlCurrentEl.download = `vol${track.vol}-${track.num}-${track.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.m4a`;
    }
    renderTracklist();
  };

  const playAudioSafely = async () => {
    ensureAudioGraph();
    if (audioCtx && audioCtx.state === 'suspended') {
      await audioCtx.resume().catch(() => {});
    }
    try {
      await audio.play();
      waitingForGesture = false;
      writeAudioState({ index: currentIndex, userPaused: false });
      syncPlayUI();
      return true;
    } catch {
      waitingForGesture = true;
      syncPlayUI();
      return false;
    }
  };

  const loadTrack = async (index, autoplay = false, resumeTime = 0) => {
    currentIndex = (index + OST_TRACKS.length) % OST_TRACKS.length;
    const track = OST_TRACKS[currentIndex];
    const resolved = assetUrl(track.file);
    if (audio.src !== resolved) {
      audio.src = resolved;
      if (resumeTime > 0) {
        audio.addEventListener(
          'loadedmetadata',
          () => {
            if (resumeTime < audio.duration) audio.currentTime = resumeTime;
          },
          { once: true },
        );
      }
    }
    writeAudioState({ index: currentIndex });
    updateNowPlayingMeta();
    if (autoplay) {
      await playAudioSafely();
    } else {
      syncPlayUI();
    }
  };

  const togglePlay = async () => {
    if (!audio.currentSrc) {
      userPaused = false;
      await loadTrack(currentIndex, true);
      return;
    }
    if (audio.paused) {
      userPaused = false;
      await playAudioSafely();
    } else {
      userPaused = true;
      waitingForGesture = false;
      audio.pause();
      writeAudioState({ userPaused: true, time: audio.currentTime });
      syncPlayUI();
    }
  };

  const playStep = (direction) => {
    userPaused = false;
    waitingForGesture = false;
    const visible = getFilteredIndices();
    const pool = visible.length ? visible : OST_TRACKS.map((_, i) => i);
    if (isShuffle && pool.length > 1) {
      const choices = pool.filter((idx) => idx !== currentIndex);
      const pick = choices[Math.floor(Math.random() * choices.length)];
      loadTrack(pick, true);
      return;
    }
    const pos = pool.indexOf(currentIndex);
    const nextPos = pos === -1 ? 0 : (pos + direction + pool.length) % pool.length;
    loadTrack(pool[nextPos], true);
  };

  playBtn?.addEventListener('click', togglePlay);
  miniPlayBtn?.addEventListener('click', togglePlay);
  prevBtn?.addEventListener('click', () => playStep(-1));
  miniPrevBtn?.addEventListener('click', () => playStep(-1));
  nextBtn?.addEventListener('click', () => playStep(1));
  miniNextBtn?.addEventListener('click', () => playStep(1));
  heroPlayBtn?.addEventListener('click', togglePlay);

  navPill?.addEventListener('click', () => {
    if (onViewNavigate && document.body.dataset.activeView === 'resume') {
      onViewNavigate('portfolio', '#soundtrack');
    } else {
      document.getElementById('soundtrack')?.scrollIntoView({ behavior: reducedMotionQuery.matches ? 'auto' : 'smooth' });
    }
    if (audio.paused) togglePlay();
  });

  miniCollapseBtn?.addEventListener('click', () => {
    if (!miniDock) return;
    const collapsed = miniDock.classList.toggle('is-collapsed');
    miniCollapseBtn.setAttribute('aria-expanded', String(!collapsed));
    miniCollapseBtn.textContent = collapsed ? '♫' : '—';
    miniCollapseBtn.setAttribute('aria-label', collapsed ? 'Expand mini-player' : 'Minimize mini-player');
  });

  shuffleBtn?.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.setAttribute('aria-pressed', String(isShuffle));
  });

  loopBtn?.addEventListener('click', () => {
    isLoop = !isLoop;
    audio.loop = isLoop;
    loopBtn.setAttribute('aria-pressed', String(isLoop));
  });

  volEl?.addEventListener('input', () => {
    audio.volume = Number(volEl.value);
    audio.muted = audio.volume === 0;
    writeAudioState({ volume: audio.volume, muted: audio.muted });
    if (muteBtn) muteBtn.setAttribute('aria-pressed', String(audio.muted));
  });

  muteBtn?.addEventListener('click', () => {
    audio.muted = !audio.muted;
    writeAudioState({ muted: audio.muted });
    muteBtn.setAttribute('aria-pressed', String(audio.muted));
    muteBtn.textContent = audio.muted ? 'Muted' : 'Mute';
  });

  seekEl?.addEventListener('input', () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = (Number(seekEl.value) / 100) * audio.duration;
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (timeCurEl) timeCurEl.textContent = formatClock(audio.currentTime);
    if (seekEl && Number.isFinite(audio.duration) && audio.duration > 0) {
      seekEl.value = String((audio.currentTime / audio.duration) * 100);
    }
    if (Math.floor(audio.currentTime) % 2 === 0) {
      writeAudioState({ time: audio.currentTime });
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    if (timeDurEl) timeDurEl.textContent = formatClock(audio.duration);
  });

  audio.addEventListener('play', syncPlayUI);
  audio.addEventListener('pause', syncPlayUI);
  audio.addEventListener('ended', () => {
    if (!isLoop) playStep(1);
  });

  if (filterTablist) {
    const filterTabs = [...filterTablist.querySelectorAll('[role="tab"]')];
    const selectFilter = (tab, focusIt = false) => {
      activeFilter = tab.dataset.mood || 'all';
      filterTabs.forEach((btn) => {
        const active = btn === tab;
        btn.setAttribute('aria-selected', String(active));
        btn.tabIndex = active ? 0 : -1;
      });
      renderTracklist();
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      if (focusIt) tab.focus();
    };

    filterTablist.addEventListener('click', (event) => {
      const tab = event.target.closest('[role="tab"]');
      if (tab) selectFilter(tab, false);
    });

    filterTablist.addEventListener('keydown', (event) => {
      const current = event.target.closest('[role="tab"]');
      if (!current) return;
      const idx = filterTabs.indexOf(current);
      let nextIdx = null;
      if (event.key === 'ArrowRight') nextIdx = (idx + 1) % filterTabs.length;
      else if (event.key === 'ArrowLeft') nextIdx = (idx - 1 + filterTabs.length) % filterTabs.length;
      else if (event.key === 'Home') nextIdx = 0;
      else if (event.key === 'End') nextIdx = filterTabs.length - 1;
      if (nextIdx !== null) {
        event.preventDefault();
        selectFilter(filterTabs[nextIdx], true);
      }
    });
  }

  reducedMotionQuery.addEventListener('change', () => {
    if (reducedMotionQuery.matches) {
      drawStaticBars();
    } else if (!audio.paused && !animId) {
      animId = requestAnimationFrame(drawVisualizerFrame);
    }
  });

  // First-gesture autostart fallback if browser blocked unmuted autoplay on initial load
  const handleFirstGesture = (event) => {
    if (!waitingForGesture || userPaused || !audio.paused) return;
    // Do not hijack clicks on Pause, Mute, or Video facade buttons
    if (event.target.closest('#ost-play-btn, #mini-play-btn, #hero-play-ost, #nav-ost-toggle, #ost-mute-btn, [data-yt-embed]')) {
      return;
    }
    waitingForGesture = false;
    playAudioSafely();
  };

  document.addEventListener('pointerdown', handleFirstGesture, { capture: true });
  document.addEventListener('keydown', handleFirstGesture, { capture: true });

  // Initialize player & attempt autostart unless the visitor explicitly paused in this session
  const startTime = typeof saved.time === 'number' ? saved.time : 0;
  loadTrack(currentIndex, !userPaused, startTime);
  drawStaticBars();

  return () => {
    if (!audio.paused) {
      userPaused = true;
      waitingForGesture = false;
      audio.pause();
      writeAudioState({ userPaused: true, time: audio.currentTime });
      syncPlayUI();
    }
  };
}

const navigateView = initViewSwitcher();
initNavbar(navigateView);
initHeroDeck(navigateView);
initCompetencyTabs();
initDialogs();
initClipboardButtons();
const pauseOst = initOstPlayer(navigateView);
initYouTubeFacades(pauseOst);

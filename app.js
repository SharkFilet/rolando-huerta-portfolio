if (!Object.hasOwn(HTMLElement.prototype, 'popover')) {
  import('https://unpkg.com/@oddbird/popover-polyfill@latest/dist/popover.min.js').catch(() => {});
}

const TRACKS = [
  {
    num: '01',
    title: 'Star Keep Title (8-Bit Overture)',
    chapter: 'Overture · Main Title Theme',
    mood: 'adventure',
    stamp: '00:00',
    file: 'assets/audio/01-star-keep-title.m4a',
  },
  {
    num: '02',
    title: 'Skybound Academy Over Verdantis',
    chapter: 'Verdantis · Floating Citadel',
    mood: 'adventure',
    stamp: '01:15',
    file: 'assets/audio/02-skybound-academy-over-verdantis.m4a',
  },
  {
    num: '03',
    title: "Zo's Wobbly Hover Lesson",
    chapter: 'Training · Wing-Rig Flight',
    mood: 'adventure',
    stamp: '02:32',
    file: 'assets/audio/03-zos-wobbly-hover-lesson.m4a',
  },
  {
    num: '04',
    title: "Tali's Graceful Landing",
    chapter: 'Chapter 3 · Solmas Aeronaut',
    mood: 'adventure',
    stamp: '03:41',
    file: 'assets/audio/04-talis-graceful-landing.m4a',
  },
  {
    num: '05',
    title: 'Glyph Hall Reverie',
    chapter: 'Verdantis · Crystal Sanctuary',
    mood: 'lofi',
    stamp: '05:06',
    file: 'assets/audio/05-glyph-hall-reverie.m4a',
  },
  {
    num: '06',
    title: 'Null Skirmish! (Battle Theme)',
    chapter: 'Combat · Academy Encounter',
    mood: 'battle',
    stamp: '06:39',
    file: 'assets/audio/06-null-skirmish-battle.m4a',
  },
  {
    num: '07',
    title: 'The Vault Knows You',
    chapter: 'Archive · Substrate Memory',
    mood: 'lofi',
    stamp: '07:46',
    file: 'assets/audio/07-the-vault-knows-you.m4a',
  },
  {
    num: '08',
    title: 'Path to the Arcanum',
    chapter: 'Chapter 11 · Dawn Departure',
    mood: 'adventure',
    stamp: '09:08',
    file: 'assets/audio/08-path-to-the-arcanum.m4a',
  },
  {
    num: '09',
    title: 'Meditating Beneath the Orb',
    chapter: 'Verdantis · Resonance Choice',
    mood: 'lofi',
    stamp: '10:19',
    file: 'assets/audio/09-meditating-beneath-the-orb.m4a',
  },
  {
    num: '10',
    title: "Captain Kael's March",
    chapter: 'Seventh Fleet · Command Tempo',
    mood: 'battle',
    stamp: '11:49',
    file: 'assets/audio/10-captain-kaels-march.m4a',
  },
  {
    num: '11',
    title: 'A Melody in Static',
    chapter: 'Signal · Deep Space Drift',
    mood: 'lofi',
    stamp: '12:54',
    file: 'assets/audio/11-a-melody-in-static.m4a',
  },
  {
    num: '12',
    title: 'The Ark Buried Beneath',
    chapter: 'Caldran IV · Ancient Core',
    mood: 'lofi',
    stamp: '14:17',
    file: 'assets/audio/12-the-ark-buried-beneath.m4a',
  },
  {
    num: '13',
    title: 'Last Night on Nyx',
    chapter: 'Nocturne · Orbital Quiet',
    mood: 'lofi',
    stamp: '15:52',
    file: 'assets/audio/13-last-night-on-nyx.m4a',
  },
  {
    num: '14',
    title: 'Battle of Baal (Boss Showdown)',
    chapter: 'Chapter 13 · Boss Theme',
    mood: 'battle',
    stamp: '17:23',
    file: 'assets/audio/14-battle-of-baal-boss.m4a',
  },
  {
    num: '15',
    title: 'Fragments in the Golden Stream',
    chapter: 'EP Title · Concept Suite',
    mood: 'adventure',
    stamp: '18:27',
    file: 'assets/audio/15-fragments-in-the-golden-stream.m4a',
  },
  {
    num: '16',
    title: 'Golden Age Dawns (Credits & Starlight)',
    chapter: 'Finale · Credits Roll',
    mood: 'adventure',
    stamp: '19:42',
    file: 'assets/audio/16-golden-age-dawns.m4a',
  },
  {
    num: '17',
    title: 'Orbital Horizon (Cosmic Modular Bonus Track)',
    chapter: 'Bonus · Extended Modular Cut',
    mood: 'lofi',
    stamp: '20:58',
    file: 'assets/audio/17-orbital-horizon-bonus.m4a',
  },
];

const HERO_DECK = [
  {
    eyebrow: 'Current focus · Venture',
    number: '01',
    title: 'SharkFilet, Inc.',
    copy: 'Delaware C-Corp engineering CreatorOS, EmotiConnect, and SharkCare across React 19, TanStack, Supabase, and Stripe Custom Accounts (546 tests across 94 suites).',
    linkText: 'Visit sharkfilet.com ↗',
    linkHref: 'https://sharkfilet.com',
  },
  {
    eyebrow: 'Current focus · Transmedia',
    number: '02',
    title: 'Star Keep: The Ark',
    copy: 'Published sci-fi universe spanning a full-length novel, Webtoon Canvas manga, and a playable 16-bit style RPG Demo built with RPG Maker MZ & Node.js.',
    linkText: 'Play RPG on Itch.io ↗',
    linkHref: 'https://sharkfilet.itch.io/star-keep-the-ark',
  },
  {
    eyebrow: 'Current focus · Soundtrack',
    number: '03',
    title: 'Retro 16-Bit OST',
    copy: '17 original SNES/GBA-inspired chiptune and cosmic lo-fi tracks crafted from scratch in BeepBox. Stream every cue or download tracks right below.',
    linkText: 'Jump to OST Console ↓',
    linkHref: '#soundtrack',
  },
];

function initNavbar() {
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
          // Ignore if popover state already changed
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
    if (link && !header.classList.contains('is-wide') && typeof menu.hidePopover === 'function') {
      try {
        menu.hidePopover();
      } catch {
        // Ignore if already closed
      }
    }
  });

  // Scroll spy for section links
  const sectionLinks = [...menu.querySelectorAll('a[href^="#"]')];
  const targets = sectionLinks
    .map((a) => ({ link: a, target: document.querySelector(a.getAttribute('href')) }))
    .filter((entry) => entry.target);

  if (targets.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (entries) => {
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
      { rootMargin: '-35% 0px -55% 0px' },
    );

    for (const item of targets) {
      spy.observe(item.target);
    }
  }
}

function initHeroDeck() {
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

  // Fallback light-dismiss for browsers without dialog closedby support (Safari)
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

function formatClock(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function initOstPlayer() {
  const audio = document.getElementById('ost-audio');
  const tracklistEl = document.getElementById('ost-tracklist');
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
  const miniDock = document.getElementById('mini-player');
  const miniTitle = document.getElementById('mini-track-title');
  const miniPlayBtn = document.getElementById('mini-play-btn');
  const miniNextBtn = document.getElementById('mini-next-btn');
  const miniCloseBtn = document.getElementById('mini-close-btn');

  if (!audio || !tracklistEl || !titleEl || !playBtn) return;

  let currentIndex = 0;
  let activeFilter = 'all';
  let isShuffle = false;
  let isLoop = false;
  let hasStartedPlayback = false;
  let audioCtx = null;
  let analyser = null;
  let sourceNode = null;
  let animId = null;

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ctx2d = canvas?.getContext('2d') ?? null;

  const drawStaticBars = () => {
    if (!ctx2d || !canvas) return;
    const { width, height } = canvas;
    ctx2d.clearRect(0, 0, width, height);
    const barCount = 24;
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
    const barCount = 24;
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
    TRACKS.map((track, idx) => ({ track, idx }))
      .filter(({ track }) => activeFilter === 'all' || track.mood === activeFilter)
      .map(({ idx }) => idx);

  const syncPlayUI = () => {
    const playing = !audio.paused && Boolean(audio.currentSrc);
    const label = playing ? 'Pause' : 'Play';
    playBtn.textContent = playing ? '❚❚ Pause' : '▶ Play';
    playBtn.setAttribute('aria-label', playing ? 'Pause current track' : 'Play current track');
    if (miniPlayBtn) {
      miniPlayBtn.textContent = playing ? '❚❚' : '▶';
      miniPlayBtn.setAttribute('aria-label', label);
    }
    if (navPill) {
      navPill.classList.toggle('is-playing', playing);
      const pillText = navPill.querySelector('.pill-label');
      if (pillText) {
        pillText.textContent = playing
          ? `Playing ${TRACKS[currentIndex].num}`
          : 'Retro OST';
      }
    }
    if (heroPlayBtn) {
      heroPlayBtn.textContent = playing ? '❚❚ Pause Retro OST' : '▶ Play Retro OST';
    }
    if (miniDock && hasStartedPlayback) {
      miniDock.hidden = false;
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
    const visible = getFilteredIndices();
    tracklistEl.innerHTML = '';

    for (const idx of visible) {
      const track = TRACKS[idx];
      const li = document.createElement('li');
      li.className = `ost-track-row${idx === currentIndex ? ' is-active' : ''}`;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ost-track-trigger';
      btn.setAttribute('aria-current', idx === currentIndex ? 'true' : 'false');
      btn.innerHTML = `
        <span class="ost-track-num">${track.num}</span>
        <span class="ost-track-meta">
          <span class="ost-track-title"></span>
          <span class="ost-track-sub"></span>
        </span>
        <span class="ost-track-stamp">${track.stamp}</span>
      `;
      btn.querySelector('.ost-track-title').textContent = track.title;
      btn.querySelector('.ost-track-sub').textContent = track.chapter;
      btn.addEventListener('click', () => loadTrack(idx, true));

      const dl = document.createElement('a');
      dl.className = 'ost-dl-link';
      dl.href = track.file;
      dl.download = `${track.num}-${track.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.m4a`;
      dl.setAttribute('aria-label', `Download ${track.title} audio`);
      dl.textContent = '↓ M4A';

      li.append(btn, dl);
      tracklistEl.append(li);
    }
  };

  const updateNowPlayingMeta = () => {
    const track = TRACKS[currentIndex];
    titleEl.textContent = `${track.num}. ${track.title}`;
    if (chapterEl) chapterEl.textContent = track.chapter;
    if (badgeEl) badgeEl.textContent = `16-Bit OST · ${track.mood.toUpperCase()}`;
    if (miniTitle) miniTitle.textContent = `${track.num}. ${track.title}`;
    if (dlCurrentEl) {
      dlCurrentEl.href = track.file;
      dlCurrentEl.download = `${track.num}-${track.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.m4a`;
    }
    renderTracklist();
  };

  const loadTrack = async (index, autoplay = false) => {
    currentIndex = (index + TRACKS.length) % TRACKS.length;
    const track = TRACKS[currentIndex];
    const resolved = new URL(track.file, window.location.href).href;
    if (audio.src !== resolved) {
      audio.src = track.file;
    }
    updateNowPlayingMeta();
    if (autoplay) {
      hasStartedPlayback = true;
      ensureAudioGraph();
      if (audioCtx && audioCtx.state === 'suspended') {
        await audioCtx.resume().catch(() => {});
      }
      await audio.play().catch(() => {});
    }
    syncPlayUI();
  };

  const togglePlay = async () => {
    if (!audio.currentSrc) {
      await loadTrack(currentIndex, true);
      return;
    }
    if (audio.paused) {
      hasStartedPlayback = true;
      ensureAudioGraph();
      if (audioCtx && audioCtx.state === 'suspended') {
        await audioCtx.resume().catch(() => {});
      }
      await audio.play().catch(() => {});
    } else {
      audio.pause();
    }
    syncPlayUI();
  };

  const playStep = (direction) => {
    const visible = getFilteredIndices();
    const pool = visible.length ? visible : TRACKS.map((_, i) => i);
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

  playBtn.addEventListener('click', togglePlay);
  miniPlayBtn?.addEventListener('click', togglePlay);
  prevBtn?.addEventListener('click', () => playStep(-1));
  nextBtn?.addEventListener('click', () => playStep(1));
  miniNextBtn?.addEventListener('click', () => playStep(1));

  heroPlayBtn?.addEventListener('click', () => {
    togglePlay();
  });

  navPill?.addEventListener('click', () => {
    if (!hasStartedPlayback) {
      document.getElementById('soundtrack')?.scrollIntoView({ behavior: reducedMotionQuery.matches ? 'auto' : 'smooth' });
      togglePlay();
    } else {
      togglePlay();
    }
  });

  miniCloseBtn?.addEventListener('click', () => {
    audio.pause();
    hasStartedPlayback = false;
    if (miniDock) miniDock.hidden = true;
    syncPlayUI();
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
    if (muteBtn) muteBtn.setAttribute('aria-pressed', String(audio.muted));
  });

  muteBtn?.addEventListener('click', () => {
    audio.muted = !audio.muted;
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

  updateNowPlayingMeta();
  drawStaticBars();
}

initNavbar();
initHeroDeck();
initCompetencyTabs();
initDialogs();
initClipboardButtons();
initOstPlayer();

(() => {
  const PRACTICE_HEADLINE = '新型スマート家電の販売好調、テクノロジー株に買い';
  const state = { mode: '', lastHeadline: '', practiceAlerted: false, dismissed: new Set(), timer: null };

  const mode = () => (document.getElementById('gameModeLabel')?.textContent || '').includes('練習用') ? 'practice' : 'main';
  const isPlaying = () => !document.getElementById('gameScreen')?.classList.contains('hidden');

  const install = () => {
    const game = document.getElementById('gameScreen');
    const topbar = game?.querySelector('.topbar');
    const feed = document.getElementById('newsFeed');
    const newsPanel = feed?.closest('.news-panel');
    if (!game || !topbar || !feed || !newsPanel) return setTimeout(install, 100);

    const style = document.createElement('style');
    style.textContent = `
      .stable-alert{position:relative;z-index:20;max-height:0;overflow:hidden;transition:max-height .22s ease;background:#f6f8fc}
      .stable-alert.show{max-height:90px}
      .stable-alert-card{display:flex;align-items:center;gap:10px;min-height:54px;max-width:1200px;margin:0 auto;padding:8px 14px;background:#fff;border-bottom:1px solid #dfe6ef;box-shadow:0 4px 12px rgba(27,42,72,.08)}
      .stable-alert-tag{flex:0 0 auto;background:#e43131;color:#fff;border-radius:5px;padding:5px 7px;font-size:11px;font-weight:900}
      .stable-alert-title{flex:1;min-width:0;margin:0;color:#1b2433;font-size:14px;font-weight:900;line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .stable-alert-close{flex:0 0 auto;width:30px;height:30px;border:0;border-radius:50%;background:#eef2f7;color:#526176;font-size:20px;line-height:1;cursor:pointer}
      .practice-news-static{display:none}.practice-news-static.show{display:block}.practice-news-static .news-item{margin-top:0}
      .news-feed.practice-hidden{display:none}
      @media(max-width:760px){.stable-alert.show{max-height:100px}.stable-alert-card{padding:8px 12px}.stable-alert-title{font-size:13px;white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}}
    `;
    document.head.appendChild(style);

    const alert = document.createElement('div');
    alert.className = 'stable-alert';
    alert.innerHTML = '<div class="stable-alert-card"><span class="stable-alert-tag">速報</span><p class="stable-alert-title"></p><button class="stable-alert-close" type="button" aria-label="閉じる">×</button></div>';
    topbar.insertAdjacentElement('afterend', alert);
    const title = alert.querySelector('.stable-alert-title');

    const practiceBox = document.createElement('div');
    practiceBox.className = 'practice-news-static';
    practiceBox.innerHTML = `<article class="news-item is-latest"><div><span class="news-tag">速報</span><time>09:05</time></div><p>${PRACTICE_HEADLINE}</p></article>`;
    feed.insertAdjacentElement('afterend', practiceBox);

    const close = () => { alert.classList.remove('show'); clearTimeout(state.timer); };
    alert.querySelector('.stable-alert-close').addEventListener('click', close);
    alert.addEventListener('click', close);
    const show = (headline) => {
      if (!headline || state.dismissed.has(headline)) return;
      title.textContent = headline;
      alert.classList.add('show');
      clearTimeout(state.timer);
      state.timer = setTimeout(close, 4200);
    };

    const setPracticeView = () => {
      feed.classList.add('practice-hidden');
      practiceBox.classList.add('show');
      const scenario = document.getElementById('scenarioTitle');
      const count = document.getElementById('newsCount');
      if (scenario) scenario.textContent = '練習ニュース';
      if (count) count.textContent = '1件';
      if (!state.practiceAlerted) {
        state.practiceAlerted = true;
        show(PRACTICE_HEADLINE);
      }
    };
    const setMainView = () => {
      feed.classList.remove('practice-hidden');
      practiceBox.classList.remove('show');
    };

    const tick = () => {
      if (!isPlaying()) {
        state.mode = '';
        state.lastHeadline = '';
        state.practiceAlerted = false;
        setMainView();
        return;
      }
      const nextMode = mode();
      if (state.mode !== nextMode) {
        state.mode = nextMode;
        state.lastHeadline = '';
        state.practiceAlerted = false;
      }
      if (nextMode === 'practice') {
        setPracticeView();
        return;
      }
      setMainView();
      const headline = feed.querySelector('.news-item p')?.textContent?.trim() || '';
      if (headline && headline !== state.lastHeadline) {
        state.lastHeadline = headline;
        show(headline);
      }
    };

    document.addEventListener('click', (event) => {
      if (event.target.closest('.stable-alert')) {
        const current = title.textContent;
        if (current) state.dismissed.add(current);
        close();
      }
    }, true);
    setInterval(tick, 120);
  };
  install();
})();
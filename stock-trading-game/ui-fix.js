(() => {
  const PRACTICE_HEADLINE = '新型スマート家電の販売好調、テクノロジー株に買い';
  const isPractice = () => (document.getElementById('gameModeLabel')?.textContent || '').includes('練習用');
  const closeBreaking = () => document.querySelectorAll('.breaking-news.show').forEach(el => el.classList.remove('show'));

  // 速報カード全体をタップしても必ず閉じる
  document.addEventListener('click', (event) => {
    if (event.target.closest('.breaking-news')) closeBreaking();
  }, true);
  document.addEventListener('pointerup', (event) => {
    if (event.target.closest('.breaking-news')) closeBreaking();
  }, true);

  let started = false;
  const renderPracticeNews = () => {
    const feed = document.getElementById('newsFeed');
    const title = document.getElementById('scenarioTitle');
    const count = document.getElementById('newsCount');
    if (!started || !isPractice() || !feed) return;
    if (!feed.querySelector('[data-practice-news="1"]')) {
      feed.innerHTML = `<article class="news-item is-latest" data-practice-news="1"><div><span class="news-tag">速報</span><time>09:05</time></div><p>${PRACTICE_HEADLINE}</p></article>`;
    }
    if (title) title.textContent = '練習ニュース';
    if (count) count.textContent = '1件';
  };

  const boot = () => {
    const start = document.getElementById('practiceStart');
    const feed = document.getElementById('newsFeed');
    if (!start || !feed) { setTimeout(boot, 100); return; }

    start.addEventListener('click', () => {
      started = true;
      setTimeout(() => {
        renderPracticeNews();
        window.__showBreakingNews?.(PRACTICE_HEADLINE);
      }, 350);
    });

    new MutationObserver(() => {
      if (started && isPractice()) renderPracticeNews();
    }).observe(feed, { childList: true, subtree: false });
  };
  boot();
})();
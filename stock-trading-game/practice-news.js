(() => {
  let shown = false;
  const addPracticeNews = () => {
    const mode = document.getElementById('gameModeLabel')?.textContent || '';
    const feed = document.getElementById('newsFeed');
    if (shown || !feed || !mode.includes('練習用')) return;
    shown = true;
    const item = document.createElement('article');
    item.className = 'news-item is-latest';
    item.innerHTML = '<div><span class="news-tag">速報</span><time>09:05</time></div><p>新型スマート家電の販売好調、テクノロジー株に買い</p>';
    feed.prepend(item);
    setTimeout(() => window.__showBreakingNews?.('新型スマート家電の販売好調、テクノロジー株に買い'), 120);
  };
  const observe = () => {
    const start = document.getElementById('practiceStart');
    if (!start) { setTimeout(observe, 120); return; }
    start.addEventListener('click', () => { shown = false; setTimeout(addPracticeNews, 700); });
  };
  observe();
})();
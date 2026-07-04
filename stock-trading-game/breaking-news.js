(() => {
  const boot = () => {
    const feed = document.getElementById('newsFeed');
    const game = document.getElementById('gameScreen');
    const topbar = game?.querySelector('.topbar');
    if (!feed || !game || !topbar || window.__breakingNewsReady) return;
    window.__breakingNewsReady = true;
    const style = document.createElement('style');
    style.textContent = `
      .breaking-news{position:relative;z-index:30;max-height:0;overflow:hidden;background:#f6f8fc;transition:max-height .24s ease}
      .breaking-news.show{max-height:82px}
      .breaking-news-card{display:flex;gap:11px;align-items:center;min-height:56px;max-width:1200px;margin:0 auto;padding:8px 16px;background:#fff;border-bottom:1px solid #dfe6ef;box-shadow:0 4px 12px rgba(27,42,72,.08);touch-action:pan-y;cursor:pointer}
      .breaking-news-label{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;background:#e43131;color:#fff;border-radius:5px;padding:5px 7px;font-size:11px;font-weight:900;letter-spacing:.04em}
      .breaking-news-body{min-width:0;flex:1}.breaking-news-title{margin:0;color:#1b2433;font-size:14px;font-weight:900;line-height:1.45;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.breaking-news-sub{margin:2px 0 0;color:#69778d;font-size:11px;font-weight:700}
      .breaking-news-close{appearance:none;border:0;background:#eef2f7;color:#526176;border-radius:50%;width:28px;height:28px;font-size:20px;line-height:24px;padding:0;flex:0 0 auto;cursor:pointer}
      @media(max-width:760px){.breaking-news.show{max-height:96px}.breaking-news-card{min-height:58px;padding:8px 12px}.breaking-news-title{font-size:13px;white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.breaking-news-label{font-size:10px}.breaking-news-sub{font-size:10px}}
    `;
    document.head.appendChild(style);
    const toast = document.createElement('div');
    toast.className = 'breaking-news';
    toast.setAttribute('aria-live','polite');
    toast.innerHTML = '<div class="breaking-news-card"><span class="breaking-news-label">速報</span><div class="breaking-news-body"><p class="breaking-news-title"></p><p class="breaking-news-sub">タップまたは左右スワイプで閉じる</p></div><button class="breaking-news-close" type="button" aria-label="速報を閉じる">×</button></div>';
    topbar.insertAdjacentElement('afterend', toast);
    const titleEl = toast.querySelector('.breaking-news-title');
    const card = toast.querySelector('.breaking-news-card');
    let timer = null;
    const shownHeadlines = new Set();
    const close = () => { toast.classList.remove('show'); clearTimeout(timer); };
    toast.querySelector('.breaking-news-close').addEventListener('click', (event) => { event.preventDefault(); event.stopPropagation(); close(); });
    let startX = 0;
    card.addEventListener('pointerdown', (event) => { startX = event.clientX; });
    card.addEventListener('pointerup', (event) => { if (Math.abs(event.clientX - startX) > 35) close(); else if (!event.target.closest('.breaking-news-close')) close(); });
    const show = (headline) => {
      if (!headline || shownHeadlines.has(headline)) return;
      shownHeadlines.add(headline);
      titleEl.textContent = headline;
      toast.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(close, 4200);
    };
    window.__showBreakingNews = show;
    let armed = false;
    setTimeout(() => { armed = true; }, 700);
    new MutationObserver((records) => {
      if (!armed) return;
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        const item = node.matches?.('.news-item') ? node : node.querySelector?.('.news-item');
        const headline = item?.querySelector('p')?.textContent?.trim();
        if (headline) show(headline);
      }));
    }).observe(feed, {childList:true,subtree:false});
  };
  const wait = () => document.getElementById('newsFeed') && document.getElementById('gameScreen') ? boot() : setTimeout(wait, 120);
  wait();
})();
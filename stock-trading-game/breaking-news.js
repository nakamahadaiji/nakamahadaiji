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
      .breaking-news.show{max-height:78px}
      .breaking-news-card{display:flex;gap:11px;align-items:center;min-height:56px;max-width:1200px;margin:0 auto;padding:8px 16px;background:#fff;border-bottom:1px solid #dfe6ef;box-shadow:0 4px 12px rgba(27,42,72,.08);touch-action:pan-y}
      .breaking-news-label{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;background:#e43131;color:#fff;border-radius:5px;padding:5px 7px;font-size:11px;font-weight:900;letter-spacing:.04em}
      .breaking-news-body{min-width:0;flex:1}.breaking-news-title{margin:0;color:#1b2433;font-size:14px;font-weight:900;line-height:1.45;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.breaking-news-sub{margin:2px 0 0;color:#69778d;font-size:11px;font-weight:700}
      .breaking-news-close{appearance:none;border:0;background:transparent;color:#78869a;font-size:22px;line-height:1;padding:5px 2px 5px 9px;cursor:pointer}
      @media(max-width:760px){.breaking-news.show{max-height:92px}.breaking-news-card{min-height:58px;padding:8px 12px}.breaking-news-title{font-size:13px;white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.breaking-news-label{font-size:10px}.breaking-news-sub{font-size:10px}}
    `;
    document.head.appendChild(style);

    const toast = document.createElement('div');
    toast.className = 'breaking-news';
    toast.setAttribute('aria-live','polite');
    toast.innerHTML = '<div class="breaking-news-card"><span class="breaking-news-label">速報</span><div class="breaking-news-body"><p class="breaking-news-title"></p><p class="breaking-news-sub">市場に新しい材料が入りました</p></div><button class="breaking-news-close" type="button" aria-label="速報を閉じる">×</button></div>';
    topbar.insertAdjacentElement('afterend', toast);

    const titleEl = toast.querySelector('.breaking-news-title');
    const close = () => {
      toast.classList.remove('show');
      clearTimeout(timer);
    };
    toast.querySelector('.breaking-news-close').addEventListener('click', close);

    let timer = null;
    let armed = false;
    let startX = 0;
    toast.addEventListener('pointerdown', (event) => { startX = event.clientX; });
    toast.addEventListener('pointerup', (event) => {
      if (Math.abs(event.clientX - startX) > 45) close();
    });

    const show = (headline) => {
      if (!headline) return;
      titleEl.textContent = headline;
      toast.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(close, 4200);
    };

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
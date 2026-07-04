(() => {
  const boot = () => {
    const feed = document.getElementById('newsFeed');
    if (!feed || window.__breakingNewsReady) return;
    window.__breakingNewsReady = true;

    const style = document.createElement('style');
    style.textContent = `
      .breaking-news{position:fixed;z-index:9999;top:76px;left:50%;width:min(620px,calc(100vw - 28px));transform:translate(-50%,-18px);opacity:0;pointer-events:none;transition:opacity .22s ease,transform .22s ease}
      .breaking-news.show{opacity:1;transform:translate(-50%,0)}
      .breaking-news-card{display:flex;gap:11px;align-items:flex-start;background:rgba(255,255,255,.98);border:1px solid #e1e7f0;border-left:6px solid #e43131;border-radius:12px;padding:12px 15px;box-shadow:0 12px 30px rgba(27,42,72,.18)}
      .breaking-news-label{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;background:#e43131;color:#fff;border-radius:5px;padding:5px 7px;font-size:11px;font-weight:900;letter-spacing:.04em}
      .breaking-news-body{min-width:0}.breaking-news-title{margin:0;color:#1b2433;font-size:14px;font-weight:900;line-height:1.5}.breaking-news-sub{margin:3px 0 0;color:#69778d;font-size:11px;font-weight:700}
      @media(max-width:760px){.breaking-news{top:63px}.breaking-news-card{padding:11px 12px;border-radius:10px}.breaking-news-title{font-size:13px}.breaking-news-label{font-size:10px}}
    `;
    document.head.appendChild(style);

    const toast = document.createElement('div');
    toast.className = 'breaking-news';
    toast.setAttribute('aria-live','polite');
    toast.innerHTML = '<div class="breaking-news-card"><span class="breaking-news-label">速報</span><div class="breaking-news-body"><p class="breaking-news-title"></p><p class="breaking-news-sub">市場に新しい材料が入りました</p></div></div>';
    document.body.appendChild(toast);
    const titleEl = toast.querySelector('.breaking-news-title');
    let timer = null;
    let armed = false;

    const show = (headline) => {
      if (!headline) return;
      titleEl.textContent = headline;
      toast.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove('show'), 4200);
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
  const wait = () => document.getElementById('newsFeed') ? boot() : setTimeout(wait, 120);
  wait();
})();
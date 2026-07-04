(() => {
  const sourceName = {
    '速報': '市場速報', '企業': '企業ニュース', '市場': '国内市場', '海外': '海外市場',
    '商品': '商品市場', '業種': '業界ニュース', '為替': '為替市場', '政策': '政策ニュース',
    '債券': '債券市場', '電力': 'エネルギー', '消費': '消費ニュース', '観測': 'マーケット観測', '引け前': '引け前情報'
  };
  const openItems = window.__stockNewsOpenItems || (window.__stockNewsOpenItems = new Set());
  const summary = (title) => {
    if (/上方修正|上積み|受注|拡大/.test(title)) return '需要の強さを示す材料として受け止められています。関連企業にも買いが広がるか、市場の反応が注目されます。';
    if (/上昇|急伸|高まで|買い/.test(title)) return '市場では関連銘柄への資金流入が意識されています。どの企業まで買いが波及するかを確認します。';
    if (/下落|売り|軟調|重し|警戒|縮小/.test(title)) return '短期筋の売りが出やすい局面です。影響を受ける業種と、逆に資金が向かう業種を見極めます。';
    if (/利上げ|金利/.test(title)) return '金利の変化は、銀行・不動産・輸出関連など幅広い業種の見通しに影響します。';
    if (/原油|資源|鉄鉱石|銅/.test(title)) return '資源価格の変動は、資源会社だけでなく運輸・化学・食品などのコストにも波及します。';
    if (/半導体|AI|データセンター/.test(title)) return '設備投資の方向性を示す材料として、部品・装置・通信関連まで幅広く注目されています。';
    if (/中国/.test(title)) return '中国の景気・政策の変化は、素材や機械、消費関連の需要見通しに影響します。';
    return 'この材料を受け、市場がどの業種を買い、どの業種を売るかに注目が集まっています。';
  };
  const addStyle = () => {
    if (document.getElementById('newsReaderStyle')) return;
    const style = document.createElement('style');
    style.id = 'newsReaderStyle';
    style.textContent = `
      .news-item{padding:14px 15px!important}
      .news-item p{font-size:15px!important;line-height:1.58!important;letter-spacing:.01em}
      .news-source{font-size:11px;font-weight:800;color:#64748b;margin-right:auto;padding-left:8px}
      .news-summary{display:none;margin-top:8px;color:#59687b;font-size:12px;line-height:1.68;font-weight:500}
      .news-item.is-open .news-summary{display:block}
      .news-open{display:block;margin-top:9px;padding:0;border:0;background:transparent;color:#1d5cab;font:inherit;font-size:11px;font-weight:800;cursor:pointer}
      .news-item.is-open{background:#f6f9ff}
      @media(max-width:760px){.news-item{padding:13px 14px!important}.news-item p{font-size:14px!important}.news-summary{font-size:12px!important}.news-open{font-size:12px!important}}
    `;
    document.head.appendChild(style);
  };
  const decorate = () => {
    const feed = document.getElementById('newsFeed');
    if (!feed) return;
    addStyle();
    feed.querySelectorAll('.news-item').forEach((item) => {
      const title = item.querySelector('p')?.textContent?.trim() || '';
      if (openItems.has(title)) item.classList.add('is-open');
      if (item.dataset.newsReader === '1') return;
      item.dataset.newsReader = '1';
      const tag = item.querySelector('.news-tag')?.textContent?.trim() || '';
      const meta = item.querySelector('div');
      if (meta) {
        const source = document.createElement('span');
        source.className = 'news-source';
        source.textContent = sourceName[tag] || 'マーケット情報';
        const time = meta.querySelector('time');
        if (time) meta.insertBefore(source, time); else meta.appendChild(source);
      }
      const lead = document.createElement('span');
      lead.className = 'news-summary';
      lead.textContent = summary(title);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'news-open';
      button.textContent = openItems.has(title) ? '閉じる' : '詳細を読む';
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const isOpen = item.classList.toggle('is-open');
        if (isOpen) openItems.add(title); else openItems.delete(title);
        button.textContent = isOpen ? '閉じる' : '詳細を読む';
      });
      item.append(lead, button);
    });
  };
  const watch = () => {
    const feed = document.getElementById('newsFeed');
    if (!feed) { setTimeout(watch, 120); return; }
    decorate();
    new MutationObserver(decorate).observe(feed, { childList: true, subtree: true });
  };
  watch();
})();
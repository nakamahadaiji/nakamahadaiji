(() => {
  const sourceName = {
    '速報': '市場速報', '企業': '企業ニュース', '市場': '国内市場', '海外': '海外市場',
    '商品': '商品市場', '業種': '業界ニュース', '為替': '為替市場', '政策': '政策ニュース',
    '債券': '債券市場', '電力': 'エネルギー', '消費': '消費ニュース', '観測': 'マーケット観測', '引け前': '引け前情報'
  };
  const openItems = window.__stockNewsOpenItems || (window.__stockNewsOpenItems = new Set());
  const summary = (title) => {
    if (/AIデータセンター投資|生成AI向け設備投資|AI関連/.test(title)) return 'AI向けの設備投資拡大を受け、半導体製造装置や電子部品、通信関連にも思惑買いが広がる可能性がある。';
    if (/半導体|電子部品|光通信部品|装置受注|国内工場/.test(title)) return '装置・部品の需要増が意識され、半導体関連を中心に業績改善への期待が高まりやすい局面となっている。';
    if (/中国政府|中国向け|中国関連|中国の景気/.test(title)) return '中国の景気対策は、建設や工場で使われる機械・素材の需要を押し上げる材料として市場で受け止められている。';
    if (/鉄鉱石|銅価格|資源価格|資源関連/.test(title)) return '資源価格の上昇は商社や素材株の収益期待につながる一方、原材料コストの増加を意識する動きも出ている。';
    if (/原油|WTI|石油元売り|中東情勢/.test(title)) return '原油高を受け、石油・商社株に買いが入りやすい一方、燃料費の負担が重い運輸株には売りが出やすい。';
    if (/利上げ|長期金利|利ざや|地銀|銀行株|金融株/.test(title)) return '金利上昇は銀行の利ざや改善期待につながる一方、不動産や高PER銘柄には重荷となる可能性がある。';
    if (/円安|輸出採算/.test(title)) return '円安進行を受け、自動車や電機など海外売上比率の高い企業では、採算改善への期待が意識されやすい。';
    if (/円高/.test(title)) return '円高進行により、輸出関連企業の採算悪化が意識されている。自動車・電機・機械株の値動きに注目が集まる。';
    if (/利益確定売り|一服|上げ幅を縮小|短期の売り/.test(title)) return '好材料が出た後でも、短期的な利益確定売りで株価が伸び悩む展開となっている。';
    if (/高値を更新|買い戻し|追随買い|買い直し/.test(title)) return '上昇基調の業種へ資金が戻る展開。出遅れた関連銘柄にも買いが波及するかが焦点となる。';
    if (/防衛関連/.test(title)) return '安全保障をめぐる材料を受け、機械・電機・精密機器など防衛関連株に資金が向かう場面がみられる。';
    if (/上方修正|上積み|受注|拡大/.test(title)) return '業績見通しの改善や受注増を受け、同業他社を含めた収益拡大への期待が相場を支えている。';
    if (/上昇|急伸|高まで/.test(title)) return '材料を受けた買いが先行しており、関連業種への波及の広がりが注目されている。';
    if (/下落|売り|軟調|重し|警戒|縮小/.test(title)) return '先行きへの警戒感から売りが優勢となっている。影響の大きい業種を中心に値動きが荒くなりやすい。';
    return 'この材料を受け、企業業績への影響や関連業種への波及を見極める動きが広がっている。';
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
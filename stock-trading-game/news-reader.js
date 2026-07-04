(() => {
  const sourceName = {
    '速報': '市場速報', '企業': '企業ニュース', '市場': '国内市場', '海外': '海外市場',
    '商品': '商品市場', '業種': '業界ニュース', '為替': '為替市場', '政策': '政策ニュース',
    '債券': '債券市場', '電力': 'エネルギー', '消費': '消費ニュース', '観測': 'マーケット観測', '引け前': '引け前情報'
  };
  const openItems = window.__stockNewsOpenItems || (window.__stockNewsOpenItems = new Set());
  const summary = (title) => {
    if (/AIデータセンター投資|生成AI向け設備投資|AI関連/.test(title)) return '【注目】半導体製造装置・電子部品・通信。AI向けの設備投資が増えると、直接関係する企業から買われやすくなります。';
    if (/半導体|電子部品|光通信部品|装置受注|国内工場/.test(title)) return '【注目】半導体・電機・精密機器。装置や部品の需要増は、関連企業の売上期待につながりやすい材料です。';
    if (/中国政府|中国向け|中国関連|中国の景気/.test(title)) return '【注目】機械・鉄鋼・非鉄金属・商社。中国の景気対策は、建設や工場で使う素材・機械の需要増につながる可能性があります。';
    if (/鉄鉱石|銅価格|資源価格|資源関連/.test(title)) return '【注目】非鉄金属・鉄鋼・商社。資源価格が上がると、資源を扱う企業の収益期待が高まりやすい一方、原材料費の上昇には注意が必要です。';
    if (/原油|WTI|石油元売り|中東情勢/.test(title)) return '【注目】石油・商社は追い風、空運・陸運は逆風になりやすい場面です。燃料コストが上がる業種まで考えるのがポイントです。';
    if (/利上げ|長期金利|利ざや|地銀|銀行株|金融株/.test(title)) return '【注目】銀行・保険は追い風、不動産は逆風になりやすい材料です。金利が上がると、銀行の利ざや改善が期待されます。';
    if (/円安|輸出採算/.test(title)) return '【注目】自動車・電機・機械。海外で売る企業は、円安になると円換算の利益が増えやすくなります。';
    if (/円高/.test(title)) return '【注目】輸出関連は利益が減る懸念から売られやすい場面です。自動車・電機・機械の値動きを見てみよう。';
    if (/利益確定売り|一服|上げ幅を縮小|短期の売り/.test(title)) return '【見方】好材料が出ていても、直前まで上がっていた銘柄は利益確定売りが出ることがあります。買うタイミングに注意。';
    if (/高値を更新|買い戻し|追随買い|買い直し/.test(title)) return '【見方】上昇している業種に資金が戻っています。すでに上がった銘柄を追うか、まだ反応していない関連銘柄を探すかが判断ポイントです。';
    if (/防衛関連/.test(title)) return '【注目】機械・電機・精密機器。政策や安全保障に関する材料では、防衛関連に資金が向かうことがあります。';
    if (/上方修正|上積み|受注|拡大/.test(title)) return '【ヒント】業績の上方修正や受注増は、その企業の売上・利益が伸びる期待につながります。同じ業界の企業にも注目。';
    if (/上昇|急伸|高まで/.test(title)) return '【ヒント】価格上昇の背景を確認しよう。直接メリットを受ける業種だけでなく、関連企業まで買いが広がることがあります。';
    if (/下落|売り|軟調|重し|警戒|縮小/.test(title)) return '【ヒント】悪材料では、最も影響を受ける業種から売られやすくなります。逆に影響を受けにくい業種へ資金が移ることもあります。';
    return '【ヒント】このニュースで「売上が増えそうな企業」と「コストが増えそうな企業」を分けて考えてみよう。';
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
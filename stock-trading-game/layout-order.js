(() => {
  const arrange = () => {
    const center = document.querySelector('.center-column');
    const left = document.querySelector('.left-column');
    const quote = center?.querySelector('.quote-panel');
    const order = center?.querySelector('.order-panel');
    const news = document.querySelector('.news-panel');
    const market = left?.querySelector('.market-panel');
    if (!center || !left || !quote || !order || !news || !market) return setTimeout(arrange, 80);
    if (order.previousElementSibling !== quote) quote.insertAdjacentElement('afterend', order);
    if (news.previousElementSibling !== market) market.insertAdjacentElement('afterend', news);
  };

  const installGuide = () => {
    if (document.getElementById('beginnerGuide')) return;
    const style = document.createElement('style');
    style.textContent = `
      #beginnerGuide{position:fixed!important;inset:0!important;z-index:2147483647!important;display:none!important;align-items:flex-end!important;justify-content:center!important;padding:16px 14px calc(16px + env(safe-area-inset-bottom))!important;background:rgba(13,22,38,.52)!important}
      #beginnerGuide.is-open{display:flex!important}#beginnerGuide .guide-card{width:min(470px,100%);max-height:88vh;overflow:auto;background:#fff;border-radius:20px;padding:20px;box-sizing:border-box;box-shadow:0 20px 52px rgba(0,0,0,.32);font-family:-apple-system,BlinkMacSystemFont,"Hiragino Sans",sans-serif}
      #beginnerGuide .guide-label{margin:0 0 6px;color:#1d5cab;font-size:12px;font-weight:900;letter-spacing:.08em}#beginnerGuide h2{margin:0;color:#1e2938;font-size:21px;line-height:1.35}#beginnerGuide .guide-lead{margin:8px 0 14px;color:#59697e;font-size:14px;line-height:1.6}
      #beginnerGuide ol{margin:0 0 14px;padding:0;list-style:none;display:grid;gap:8px}#beginnerGuide li{display:flex;gap:9px;align-items:flex-start;background:#f3f7fb;border-radius:11px;padding:10px;color:#253247;font-weight:750;font-size:14px;line-height:1.45}#beginnerGuide li b{display:grid;place-items:center;flex:0 0 auto;width:22px;height:22px;border-radius:50%;background:#1d5cab;color:#fff;font-size:12px}
      #beginnerGuide .guide-mission{margin:0 0 14px;padding:11px 12px;border-radius:11px;background:#fff5dc;color:#76521d;font-size:13px;font-weight:800;line-height:1.5}#beginnerGuide button{width:100%;min-height:48px;border:0;border-radius:12px;background:#1d5cab;color:#fff;font-size:16px;font-weight:900}
      .beginner-help-button{margin-left:8px;border:1px solid #d9e2ef;border-radius:999px;background:#fff;color:#42526b;padding:6px 9px;font-size:12px;font-weight:800;cursor:pointer}
    `;
    document.head.appendChild(style);
    const panel = document.createElement('div');
    panel.id = 'beginnerGuide';
    panel.innerHTML = '<div class="guide-card" role="dialog" aria-modal="true"><p class="guide-label">はじめてガイド</p><h2></h2><p class="guide-lead">正解を当てるゲームではありません。まずは少ない株数で、値動きを体験しよう。</p><ol></ol><p class="guide-mission"></p><button type="button">ゲームをはじめる</button></div>';
    document.body.appendChild(panel);
    const title = panel.querySelector('h2');
    const list = panel.querySelector('ol');
    const mission = panel.querySelector('.guide-mission');
    const close = () => panel.classList.remove('is-open');
    panel.querySelector('button').addEventListener('click', close);
    panel.addEventListener('click', e => { if (e.target === panel) close(); });
    const open = practice => {
      title.textContent = practice ? 'まずは1回、売買してみよう！' : 'ニュースを味方にしてみよう！';
      list.innerHTML = practice
        ? '<li><b>1</b><span>左下のニュースを読む</span></li><li><b>2</b><span>銘柄一覧から「ネオリンク」を選ぶ</span></li><li><b>3</b><span>「10株」を押してから「買う」</span></li><li><b>4</b><span>値動きを見て、好きなタイミングで売る</span></li>'
        : '<li><b>1</b><span>左下のニュースを読む</span></li><li><b>2</b><span>関係しそうな業種の会社を1つ選ぶ</span></li><li><b>3</b><span>まずは「10株」だけ買ってみる</span></li><li><b>4</b><span>ニュースと値動きを比べながら売る</span></li>';
      mission.textContent = practice ? '🎯 ミッション：ネオリンクを10株買って、株価が動く感覚をつかもう。' : '🎯 ミッション：ニュースと関係する会社を1社選び、10株買ってみよう。';
      panel.classList.add('is-open');
    };
    document.addEventListener('click', event => {
      const button = event.target.closest('#practiceStart,#mainStart,.beginner-help-button');
      if (!button) return;
      const practice = button.id === 'practiceStart' || (button.id !== 'mainStart' && (document.getElementById('gameModeLabel')?.textContent || '').includes('練習用'));
      setTimeout(() => open(practice), 180);
    }, true);
    const practiceButton = document.getElementById('practiceStart');
    if (practiceButton) {
      const sub = practiceButton.querySelector('.mode-top small');
      const desc = practiceButton.querySelector('.mode-description');
      const action = practiceButton.querySelector('.mode-action');
      if (sub) sub.textContent = 'はじめてはこちら';
      if (desc) desc.textContent = 'ニュースを1通読んで、売買の流れを体験しよう。';
      if (action) action.textContent = '練習をはじめる　→';
    }
    const topbar = document.querySelector('.topbar');
    if (topbar && !topbar.querySelector('.beginner-help-button')) {
      const help = document.createElement('button');
      help.type = 'button';
      help.className = 'beginner-help-button';
      help.textContent = '？ガイド';
      topbar.appendChild(help);
    }
  };

  arrange();
  installGuide();
})();
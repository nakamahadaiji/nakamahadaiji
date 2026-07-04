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

  const beginnerGuide = () => {
    const practice = document.getElementById('practiceStart');
    const main = document.getElementById('mainStart');
    if (!practice || !main) return setTimeout(beginnerGuide, 80);

    const style = document.createElement('style');
    style.textContent = `
      .beginner-help{position:fixed;inset:0;z-index:1000;display:none;align-items:flex-end;justify-content:center;background:rgba(20,30,46,.48);padding:18px 14px calc(18px + env(safe-area-inset-bottom))}
      .beginner-help.show{display:flex}.beginner-card{width:min(460px,100%);background:#fff;border-radius:20px;padding:20px;box-shadow:0 18px 48px rgba(18,30,50,.28)}
      .beginner-kicker{margin:0 0 6px;color:#1d5cab;font-size:12px;font-weight:900;letter-spacing:.06em}.beginner-card h2{margin:0;color:#1b2433;font-size:22px}.beginner-card>p{margin:8px 0 15px;color:#5f6e83;font-size:14px;line-height:1.6}
      .beginner-steps{display:grid;gap:8px;margin:0 0 16px;padding:0;list-style:none}.beginner-steps li{display:flex;gap:10px;align-items:flex-start;padding:10px 11px;border-radius:11px;background:#f4f7fb;color:#2b3748;font-size:14px;font-weight:700;line-height:1.45}.beginner-num{display:grid;place-items:center;flex:0 0 auto;width:22px;height:22px;border-radius:50%;background:#1d5cab;color:#fff;font-size:12px}
      .beginner-mission{margin:0 0 16px;padding:11px 12px;border-radius:11px;background:#fff6df;color:#75511d;font-size:13px;line-height:1.55;font-weight:800}.beginner-start{width:100%;min-height:48px;border:0;border-radius:12px;background:#1d5cab;color:#fff;font-size:16px;font-weight:900;cursor:pointer}.beginner-help-button{margin-left:8px;border:1px solid #d9e2ef;border-radius:999px;background:#fff;color:#42526b;padding:6px 9px;font-size:12px;font-weight:800;cursor:pointer}
      @media(max-width:760px){.beginner-card{padding:18px}.beginner-card h2{font-size:20px}}
    `;
    document.head.appendChild(style);

    const modal = document.createElement('div');
    modal.className = 'beginner-help';
    modal.innerHTML = '<div class="beginner-card" role="dialog" aria-modal="true"><p class="beginner-kicker">はじめてガイド</p><h2></h2><p class="beginner-lead"></p><ol class="beginner-steps"></ol><p class="beginner-mission"></p><button class="beginner-start" type="button">やってみる！</button></div>';
    document.body.appendChild(modal);
    const title = modal.querySelector('h2');
    const lead = modal.querySelector('.beginner-lead');
    const steps = modal.querySelector('.beginner-steps');
    const mission = modal.querySelector('.beginner-mission');
    const close = () => modal.classList.remove('show');
    modal.querySelector('.beginner-start').addEventListener('click', close);

    const openGuide = (isPractice) => {
      title.textContent = isPractice ? 'まずは1回、売買してみよう！' : 'ニュースを味方にしてみよう！';
      lead.textContent = '正解を当てるゲームではありません。小さく買って、値動きを体験することが大切です。';
      steps.innerHTML = isPractice
        ? '<li><span class="beginner-num">1</span><span>左下のニュースを読む</span></li><li><span class="beginner-num">2</span><span>銘柄一覧から「ネオリンク」を選ぶ</span></li><li><span class="beginner-num">3</span><span>株価を見ながら「10株」を買う</span></li><li><span class="beginner-num">4</span><span>上がったら売って、結果を見よう</span></li>'
        : '<li><span class="beginner-num">1</span><span>左下のニュースで、動きそうな業種を探す</span></li><li><span class="beginner-num">2</span><span>銘柄一覧から関係する会社を1つ選ぶ</span></li><li><span class="beginner-num">3</span><span>まずは「10株」を買って様子を見る</span></li><li><span class="beginner-num">4</span><span>株価が動いた理由を考えて売る</span></li>';
      mission.innerHTML = isPractice ? '🎯 ミッション：ネオリンクを10株買って、値動きを1回体験しよう。' : '🎯 ミッション：ニュースと関係する会社を1社選んで、10株買ってみよう。';
      modal.classList.add('show');
    };

    practice.querySelector('.mode-top small').textContent = 'はじめてはこちら';
    practice.querySelector('.mode-description').textContent = 'ニュースを1通読んで、売買の流れを体験しよう。';
    practice.querySelector('.mode-action').textContent = '練習をはじめる　→';
    practice.addEventListener('click', () => setTimeout(() => openGuide(true), 120));
    main.addEventListener('click', () => setTimeout(() => openGuide(false), 120));

    const topbar = document.querySelector('.topbar');
    if (topbar && !topbar.querySelector('.beginner-help-button')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'beginner-help-button';
      button.textContent = '？ガイド';
      button.addEventListener('click', () => {
        const isPractice = (document.getElementById('gameModeLabel')?.textContent || '').includes('練習用');
        openGuide(isPractice);
      });
      topbar.appendChild(button);
    }
  };

  arrange();
  beginnerGuide();
})();
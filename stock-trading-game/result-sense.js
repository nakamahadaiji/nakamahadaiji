(() => {
  const reviews = {
    god: [
      ['神センス！', 'ニュースの流れを何度も利益に変えた！', '関係の近い会社を早く選び、上がった場面で売れた。'],
      ['神センス！', '大きなチャンスをしっかり取れた！', '業種選びと売るタイミングが、何回もかみ合った。'],
      ['神センス！', '運だけでは出しにくい高記録！', 'ニュース後の値動きを読み、利益を積み上げられた。']
    ],
    great: [
      ['めっちゃセンスあり！', 'ニュースを使って、しっかり利益を出せた！', '関係する業種や会社を、うまく選べている。'],
      ['めっちゃセンスあり！', 'かなり良い判断ができた！', '買う会社と売るタイミングが、何度も当たった。'],
      ['めっちゃセンスあり！', 'あと少しで神センス！', 'チャンスを逃さず、値上がりを利益に変えられた。']
    ],
    good: [
      ['ちょいセンスあり！', 'ニュースをヒントに、利益を出せた！', '動きそうな業種を、ある程度当てられている。'],
      ['ちょいセンスあり！', 'かなり良いスタート！', '大きく外さず、上がる会社を選べた場面があった。'],
      ['ちょいセンスあり！', '次はもっと上をねらえる！', '会社選びはよかったので、売るタイミングがカギ。']
    ],
    normal: [
      ['ふつう！', '大きく負けずに最後まで取引できた。', '利益チャンスはあったが、取り切れない場面もあった。'],
      ['ふつう！', 'ここから伸ばせる結果！', 'ニュースと会社のつながりを、もう少し意識すると良い。'],
      ['ふつう！', '次はもっと上をねらえる！', '買う理由・売る理由を決めると、判断が安定しやすい。']
    ],
    training: [
      ['センス修行中！', '今回は少し苦戦したかも。', 'ニュースと関係が近い会社を選び切れなかった。'],
      ['センス修行中！', '次はかなり変わるはず！', '買う会社か、売るタイミングを見直すと利益が残りやすい。'],
      ['センス修行中！', '小さく試して、感覚をつかもう！', '10株ずつなら、値動きを見ながら調整しやすい。']
    ],
    reverse: [
      ['逆張り王！', '今回は相場と逆に動いた場面が多かった。', 'ニュースと関係が遠い会社を選んだ可能性がある。'],
      ['逆張り王！', 'でも、次の伸びしろは大きい！', 'ニュース→業種→会社の順で考えると選びやすくなる。'],
      ['逆張り王！', '次は10株からリベンジ！', '大きく買いすぎず、上がったら早めに売る作戦が有効。']
    ]
  };

  const style = document.createElement('style');
  style.textContent = `
    .sense-result{margin:16px auto 0;padding:15px 16px;max-width:520px;border:2px solid #d7e4f5;border-radius:16px;background:#f8fbff;text-align:left;box-sizing:border-box}
    .sense-result.god{border-color:#f1bc32;background:#fff9e9}.sense-result.great{border-color:#5c98e2;background:#f4f9ff}.sense-result.good{border-color:#79b6a0;background:#f3fbf7}.sense-result.normal{border-color:#b8c3d2;background:#fafbfd}.sense-result.training{border-color:#e2ae5d;background:#fff9ef}.sense-result.reverse{border-color:#de8882;background:#fff5f4}
    .sense-label{margin:0;color:#5a6b82;font-size:12px;font-weight:900;letter-spacing:.08em}.sense-title{margin:3px 0 8px;color:#172842;font-size:23px;font-weight:950;line-height:1.25}.sense-amount{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 10px;padding:8px 10px;border-radius:10px;background:#fff;color:#4b5d74;font-size:13px;font-weight:800}.sense-amount strong{color:#172842;font-size:20px}.sense-comment{margin:0 0 7px;color:#25364f;font-size:15px;font-weight:900;line-height:1.55}.sense-reason{margin:0;color:#53637a;font-size:13px;line-height:1.6}.sense-reason b{color:#1d5cab}
    @media(max-width:760px){.sense-result{margin-top:13px;padding:14px}.sense-title{font-size:21px}.sense-comment{font-size:14px}.sense-amount strong{font-size:18px}}
  `;
  document.head.appendChild(style);

  const getAsset = () => {
    const text = document.getElementById('resultAsset')?.textContent || '';
    const number = Number(text.replace(/[^0-9]/g, ''));
    return Number.isFinite(number) ? number : 0;
  };
  const getStart = () => (document.getElementById('gameModeLabel')?.textContent || '').includes('練習用') ? 1000000 : 100000;
  const grade = (asset, start) => {
    const ratio = asset / start;
    if (ratio >= 1.8) return 'god';
    if (ratio >= 1.5) return 'great';
    if (ratio >= 1.3) return 'good';
    if (ratio >= 1.0) return 'normal';
    if (ratio >= 0.8) return 'training';
    return 'reverse';
  };
  const yen = amount => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(amount);

  let lastKey = '';
  const render = () => {
    const result = document.getElementById('resultScreen');
    const amount = getAsset();
    if (!result || result.classList.contains('hidden') || !amount) return;
    const start = getStart();
    const level = grade(amount, start);
    const key = `${amount}-${level}`;
    if (key === lastKey && document.getElementById('senseResult')) return;
    lastKey = key;
    document.getElementById('senseResult')?.remove();
    const [title, comment, reason] = reviews[level][Math.floor(Math.random() * reviews[level].length)];
    const card = document.createElement('section');
    card.id = 'senseResult';
    card.className = `sense-result ${level}`;
    card.innerHTML = `<p class="sense-label">今回の株センス</p><h2 class="sense-title">${title}</h2><p class="sense-amount"><span>最終金額</span><strong>${yen(amount)}</strong></p><p class="sense-comment">${comment}</p><p class="sense-reason"><b>理由：</b>${reason}</p>`;
    const anchor = document.getElementById('resultProfit');
    if (anchor) anchor.insertAdjacentElement('afterend', card);
  };

  new MutationObserver(render).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  setInterval(render, 400);
  render();
})();
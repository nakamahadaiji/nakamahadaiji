(() => {
  'use strict';

  const PRACTICE = [
    { id: 'NLC', code: 'NLC', name: 'ネオリンク', sector: 'テクノロジー', price: 1240, vol: 0.018 },
    { id: 'MRT', code: 'MRT', name: 'みらい電機', sector: '電力・インフラ', price: 870, vol: 0.012 },
    { id: 'SFO', code: 'SFO', name: 'サンフーズ', sector: '食品', price: 640, vol: 0.015 },
    { id: 'BTA', code: 'BTA', name: 'バンクタス', sector: '金融', price: 1520, vol: 0.016 },
    { id: 'KRT', code: 'KRT', name: 'キラテック', sector: '製造業', price: 980, vol: 0.024 }
  ];

  const SCENARIOS = [
    {
      name: '金融政策ショック',
      news: [
        [0, '速報', '日銀、追加利上げを決定　政策金利を0.25％引き上げ', ['銀行', '金融'], 0.045],
        [22, '債券', '長期金利が上昇　不動産株に売り', ['不動産', '建設'], -0.040],
        [48, '為替', '円相場、一時148円台前半　輸出株の重荷に', ['輸送用機器', '電気機器', '機械'], -0.030],
        [76, '市場', '銀行株、買いが加速', ['銀行', '金融'], 0.024],
        [106, '企業', '大手地銀、利ざや改善見通しを公表', ['銀行', '金融'], 0.018],
        [139, '海外', '米長期金利も上昇　高PER株に重し', ['情報・通信', '電気機器', '精密'], -0.022],
        [174, '市場', '不動産株、下げ幅を拡大', ['不動産'], -0.016],
        [207, '為替', '円高一服　輸出株に買い戻し', ['輸送用機器', '電気機器', '機械'], 0.018],
        [240, '観測', '次回会合での追加対応を見極め', ['銀行', '金融'], -0.010],
        [272, '引け前', 'セクター間の差が拡大', ['不動産', '銀行'], 0.004]
      ]
    },
    {
      name: '資源価格急騰',
      news: [
        [0, '速報', '中東情勢の緊迫化で原油先物が急伸', ['鉱業', '石油', '卸売'], 0.046],
        [21, '商品', 'WTI原油、前日比7％高まで上昇', ['鉱業', '石油'], 0.030],
        [47, '業種', '燃料費上昇懸念で航空・陸運株に売り', ['空運', '陸運', '輸送'], -0.050],
        [76, '為替', '資源高を受け円売り優勢', ['輸送用機器', '電気機器', '機械'], 0.012],
        [105, '市場', '商社株に買いが広がる', ['卸売', '商社'], 0.026],
        [136, '企業', '石油元売り、収益改善期待が強まる', ['石油', '鉱業'], 0.018],
        [166, '業種', '化学・食品はコスト増を警戒', ['化学', '食品'], -0.018],
        [198, '海外', '停戦協議の報道で原油は上げ幅を縮小', ['鉱業', '石油', '卸売'], -0.022],
        [229, '市場', '防衛関連に資金流入', ['精密', '機械', '電気機器'], 0.012],
        [269, '引け前', '関連株は高安まちまち', ['鉱業', '石油'], -0.004]
      ]
    },
    {
      name: '半導体規制',
      news: [
        [0, '速報', '米政府、先端半導体装置の輸出規制を追加強化へ', ['電気機器', '精密', '情報・通信'], -0.044],
        [18, '海外', '米半導体株指数、時間外で下落', ['電気機器', '精密', '機械'], -0.024],
        [45, '企業', '対中売上比率を巡り電子部品株で選別', ['電気機器', '精密'], -0.016],
        [72, '政策', '国内半導体投資への追加支援を検討', ['電気機器', '精密', '化学', '機械'], 0.026],
        [102, '市場', '半導体材料株、押し目買いが優勢', ['化学', '電気機器'], 0.014],
        [134, '海外', '中国向けスマホ出荷の減速観測', ['電気機器', '情報・通信'], -0.018],
        [165, '為替', '円安進行が輸出採算を下支え', ['電気機器', '機械', '輸送用機器'], 0.020],
        [196, '企業', '国内工場向け装置受注、堅調との見方', ['機械', '精密', '電気機器'], 0.016],
        [228, '市場', '関連株に利益確定売り', ['電気機器', '精密', '機械'], -0.018],
        [266, '引け前', '材料株中心の売買に', ['電気機器', '精密'], -0.006]
      ]
    },
    {
      name: '中国景気対策',
      news: [
        [0, '速報', '中国政府、不動産支援と大型インフラ投資を発表', ['機械', '鉄鋼', '非鉄', '建設'], 0.044],
        [22, '商品', '鉄鉱石・銅価格が上昇　資源関連に買い', ['鉄鋼', '非鉄', '鉱業', '卸売'], 0.026],
        [50, '消費', '訪日需要の回復期待で百貨店・化粧品に物色', ['小売', '化学', 'サービス'], 0.018],
        [79, '海外', '中国不動産販売、改善は限定的との見方', ['機械', '鉄鋼', '非鉄'], -0.020],
        [108, '企業', '建機大手、中国向け出荷計画を上積み', ['機械', '建設'], 0.022],
        [139, '市場', '素材株、短期の利益確定売り', ['鉄鋼', '非鉄', '鉱業'], -0.014],
        [170, '為替', '人民元高でアジア通貨も底堅い', ['機械', '輸送用機器'], 0.010],
        [202, '海外', '追加対策の規模を巡り観測が交錯', ['機械', '鉄鋼', '非鉄'], -0.012],
        [234, '市場', '中国関連の内需銘柄にも買い広がる', ['小売', 'サービス', '化学'], 0.009],
        [267, '引け前', '建機・素材を中心に高安まちまち', ['機械', '鉄鋼', '非鉄'], -0.004]
      ]
    },
    {
      name: 'AI設備投資',
      news: [
        [0, '速報', '米IT大手、AIデータセンター投資を上方修正', ['情報・通信', '電気機器', '精密'], 0.043],
        [20, '企業', '国内通信大手、生成AI向け設備投資を拡大', ['情報・通信', '電気機器'], 0.024],
        [47, '電力', 'データセンター増設で電力需要の逼迫懸念', ['電力', 'ガス', '建設'], 0.020],
        [75, '市場', '光通信部品・サーバー関連に買い', ['電気機器', '精密', '情報・通信'], 0.018],
        [104, '海外', '米半導体株が上昇、国内関連株を支援', ['電気機器', '精密', '機械'], 0.016],
        [134, '市場', 'AI関連の一部に過熱感　利益確定売り', ['情報・通信', '電気機器', '精密'], -0.022],
        [164, '企業', '電力設備の受注見通しを上方修正', ['電力', '建設', '電気機器'], 0.015],
        [196, '業種', '通信株、巨額投資負担への懸念も', ['情報・通信', '通信'], -0.012],
        [229, '市場', '大型株中心に買い戻し', ['電気機器', '精密', '情報・通信'], 0.010],
        [266, '引け前', 'AI関連は銘柄選別色が強まる', ['情報・通信', '電気機器'], -0.005]
      ]
    },
    {
      name: '大型新薬承認',
      news: [
        [0, '速報', '米FDA、新薬を承認　対象患者は年間数十万人規模', ['医薬品'], 0.050],
        [24, '企業', '販売提携先にも買い注文が入る', ['医薬品'], 0.018],
        [52, '市場', '競合薬を持つ企業は軟調', ['医薬品'], -0.012],
        [80, '海外', '承認薬の薬価水準を見極める動き', ['医薬品'], -0.014],
        [110, '企業', '国内販売網の拡充計画を公表', ['医薬品', 'サービス'], 0.016],
        [142, '市場', 'バイオ関連に資金が波及', ['医薬品', '精密'], 0.011],
        [173, '観測', '副作用情報の精査を求める声も', ['医薬品'], -0.017],
        [205, '海外', '米医療保険大手、採用方針を検討', ['医薬品', 'サービス'], 0.009],
        [236, '市場', '材料出尽くしを意識した売り', ['医薬品'], -0.018],
        [269, '引け前', '医薬品株は高安まちまち', ['医薬品'], -0.004]
      ]
    }
  ];

  const byId = (id) => document.getElementById(id);
  const els = {
    start: byId('startScreen'), game: byId('gameScreen'), result: byId('resultScreen'),
    practice: byId('practiceStart'), main: byId('mainStart'), modeLabel: byId('gameModeLabel'),
    timer: byId('timer'), tick: byId('marketTick'), search: byId('stockSearch'), list: byId('stockList'),
    scenarioTitle: byId('scenarioTitle'), scenarioMeta: byId('scenarioMeta'), sector: byId('selectedSector'),
    name: byId('selectedName'), code: byId('selectedCode'), price: byId('selectedPrice'), change: byId('selectedChange'),
    chart: byId('chart'), holding: byId('holdingLabel'), qty: byId('quantityInput'), buy: byId('buyButton'), sell: byId('sellButton'), message: byId('orderMessage'),
    cash: byId('cash'), holdings: byId('holdingCount'), stockValue: byId('stockValue'), total: byId('totalAsset'), profit: byId('profit'), rate: byId('profitRate'), profitCard: byId('profitCard'),
    history: byId('history'), news: byId('newsFeed'), newsCount: byId('newsCount'), resultAsset: byId('resultAsset'), resultProfit: byId('resultProfit'), resultStats: byId('resultStats'), restart: byId('restartButton')
  };

  let state = { mode: 'practice', scenario: null, stocks: [], selectedId: '', cash: 0, startingCash: 1000000, seconds: 180, tick: 0, timer: null, transactions: [], query: '' };
  const yen = (value) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(Math.round(value));
  const percent = (part, base) => base ? (part / base) * 100 : 0;
  const last = (items) => items[items.length - 1];
  const seed = (text) => { let value = 0; for (const ch of String(text)) value = ((value * 31) + ch.charCodeAt(0)) >>> 0; return value; };
  const selected = () => state.stocks.find((stock) => stock.id === state.selectedId);
  const totalStockValue = () => state.stocks.reduce((sum, stock) => sum + (stock.price * stock.holdings), 0);
  const totalAssets = () => state.cash + totalStockValue();
  const profit = () => totalAssets() - state.startingCash;
  const gameClock = (tick) => { const value = 540 + tick; return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`; };

  function belongsTo(stock, keywords) {
    return keywords.some((word) => stock.sector.includes(word) || stock.name.includes(word));
  }

  function eventEffect(stock, event, time) {
    const [at, , , keywords, impact] = event;
    if (time < at || !belongsTo(stock, keywords)) return 0;
    const age = time - at;
    const ramp = Math.min(1, age / 7);
    const decay = age > 70 ? Math.max(0.35, 1 - ((age - 70) / 185)) : 1;
    const sensitivity = 0.74 + ((seed(stock.code) % 41) / 100);
    return impact * ramp * decay * sensitivity;
  }

  function marketPrice(stock, time) {
    const key = seed(stock.code);
    if (state.mode === 'practice') {
      const randomLike = Math.sin(time * 0.81 + (key % 13)) * stock.vol + Math.sin(time * 0.21) * 0.006;
      return Math.max(20, Math.round(stock.open * (1 + randomLike)));
    }
    const impact = state.scenario.news.reduce((sum, event) => sum + eventEffect(stock, event, time), 0);
    const marketWave = Math.sin(time * 0.09) * 0.003 + Math.sin(time * 0.031 + (key % 7)) * 0.0025;
    const stockNoise = Math.sin(time * 0.63 + (key % 31)) * 0.003 + Math.sin(time * 0.17 + (key % 19)) * 0.0014;
    return Math.max(10, Math.round(stock.open * (1 + impact + marketWave + stockNoise)));
  }

  function makePracticeStocks() {
    return PRACTICE.map((stock) => ({ ...stock, open: stock.price, holdings: 0, history: Array(40).fill(stock.price) }));
  }

  function makeMainStocks() {
    const companies = Array.isArray(window.REAL_COMPANIES) ? window.REAL_COMPANIES : [];
    const fallback = [
      { code: '7203', name: 'トヨタ自動車', sector: '輸送用機器' },
      { code: '8306', name: '三菱UFJフィナンシャル・グループ', sector: '銀行' },
      { code: '9432', name: 'NTT', sector: '情報・通信' },
      { code: '8035', name: '東京エレクトロン', sector: '電気機器' },
      { code: '7267', name: 'ホンダ', sector: '輸送用機器' }
    ];
    return (companies.length ? companies : fallback).map((company) => {
      const open = Math.max(120, Math.round(240 + (seed(company.code) % 6800)));
      return { id: company.code, code: company.code, name: company.name, sector: company.sector, open, price: open, holdings: 0, history: Array(40).fill(open) };
    });
  }

  function startGame(mode) {
    window.clearInterval(state.timer);
    state.mode = mode;
    state.scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    state.startingCash = mode === 'main' ? 100000 : 1000000;
    state.seconds = mode === 'main' ? 300 : 180;
    state.tick = 0;
    state.cash = state.startingCash;
    state.transactions = [];
    state.query = '';
    state.stocks = mode === 'main' ? makeMainStocks() : makePracticeStocks();
    state.selectedId = state.stocks[0] ? state.stocks[0].id : '';
    els.search.value = '';
    els.start.classList.add('hidden');
    els.result.classList.add('hidden');
    els.game.classList.remove('hidden');
    els.modeLabel.textContent = mode === 'main' ? '本番用 / 実在企業130社以上 / 5分' : '練習用 / 架空企業5社 / 3分';
    els.scenarioTitle.textContent = mode === 'main' ? state.scenario.name : 'ニュースなし';
    els.scenarioMeta.textContent = mode === 'main' ? '速報は配信時刻から市場へ反映されます' : '短期の値動きだけを見て売買します';
    els.message.textContent = '銘柄を選び、株数を入力して注文してください。';
    render();
    state.timer = window.setInterval(nextTick, 1000);
  }

  function filteredStocks() {
    const query = state.query.trim().toLowerCase();
    if (!query) return state.stocks;
    return state.stocks.filter((stock) => `${stock.name} ${stock.code} ${stock.sector}`.toLowerCase().includes(query));
  }

  function renderList() {
    const stocks = filteredStocks();
    if (!stocks.length) {
      els.list.innerHTML = '<p class="empty-history">該当する銘柄がありません。</p>';
      return;
    }
    els.list.innerHTML = stocks.map((stock) => {
      const diff = stock.price - stock.open;
      const up = diff >= 0;
      return `<button type="button" class="stock-row ${stock.id === state.selectedId ? 'active' : ''}" data-stock="${stock.id}"><span><b class="stock-name">${stock.name}</b><small class="stock-sector">${stock.code} / ${stock.sector}</small></span><span><b class="stock-price">${yen(stock.price)}</b><small class="stock-move ${up ? 'price-up' : 'price-down'}">${up ? '+' : ''}${percent(diff, stock.open).toFixed(2)}%</small></span></button>`;
    }).join('');
    els.list.querySelectorAll('[data-stock]').forEach((button) => {
      button.addEventListener('click', () => { state.selectedId = button.dataset.stock; render(); });
    });
  }

  function pathFor(points) {
    if (points.length < 2) return '';
    let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i += 1) {
      const a = points[i - 1] || points[i];
      const b = points[i];
      const c = points[i + 1];
      const d = points[i + 2] || c;
      path += ` C ${(b.x + (c.x - a.x) / 6).toFixed(1)} ${(b.y + (c.y - a.y) / 6).toFixed(1)}, ${(c.x - (d.x - b.x) / 6).toFixed(1)} ${(c.y - (d.y - b.y) / 6).toFixed(1)}, ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
    }
    return path;
  }

  function renderChart(stock) {
    const values = stock.history;
    const W = 640, H = 250, pad = { left: 42, right: 15, top: 18, bottom: 31 };
    const minimum = Math.min(...values), maximum = Math.max(...values), spread = Math.max(maximum - minimum, 1);
    const low = minimum - spread * 0.20, high = maximum + spread * 0.20;
    const x = (index) => pad.left + index * (W - pad.left - pad.right) / (values.length - 1);
    const y = (value) => pad.top + (high - value) * (H - pad.top - pad.bottom) / (high - low);
    const points = values.map((value, index) => ({ x: x(index), y: y(value) }));
    const path = pathFor(points), end = last(points), start = values[0], now = last(values), change = now - start;
    const color = change >= 0 ? '#c6403b' : '#2772b9';
    const area = `${path} L ${end.x.toFixed(1)} ${H - pad.bottom} L ${points[0].x.toFixed(1)} ${H - pad.bottom} Z`;
    const grids = [0, 0.5, 1].map((position) => {
      const value = high - (high - low) * position;
      const lineY = y(value);
      return `<line x1="${pad.left}" y1="${lineY.toFixed(1)}" x2="${W - pad.right}" y2="${lineY.toFixed(1)}" stroke="#e4eaf2" stroke-dasharray="3 5"/><text x="2" y="${(lineY + 4).toFixed(1)}" fill="#8d98a9" font-size="11">${yen(value)}</text>`;
    }).join('');
    els.chart.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="stockFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".20"/><stop offset="1" stop-color="${color}" stop-opacity=".02"/></linearGradient></defs>${grids}<path d="${area}" fill="url(#stockFill)"/><path d="${path}" fill="none" stroke="${color}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/><line x1="${pad.left}" y1="${y(start).toFixed(1)}" x2="${W - pad.right}" y2="${y(start).toFixed(1)}" stroke="#aab6c6" stroke-dasharray="5 5"/><circle cx="${end.x.toFixed(1)}" cy="${end.y.toFixed(1)}" r="5" fill="${color}" stroke="#fff" stroke-width="3"/><rect x="${W - 120}" y="12" width="104" height="24" rx="6" fill="#fff" stroke="#dfe6ef"/><text x="${W - 111}" y="28" fill="${color}" font-size="12" font-weight="700">${change >= 0 ? '+' : ''}${percent(change, start).toFixed(2)}%</text><text x="${pad.left}" y="${H - 8}" fill="#8995a7" font-size="11">40秒前</text><text x="${W - pad.right - 24}" y="${H - 8}" fill="#8995a7" font-size="11">現在</text></svg>`;
  }

  function renderQuote() {
    const stock = selected();
    if (!stock) return;
    const diff = stock.price - stock.open;
    const up = diff >= 0;
    els.sector.textContent = stock.sector;
    els.name.textContent = stock.name;
    els.code.textContent = stock.code;
    els.price.textContent = yen(stock.price);
    els.change.textContent = `${diff >= 0 ? '+' : ''}${yen(diff)} (${up ? '+' : ''}${percent(diff, stock.open).toFixed(2)}%)`;
    els.change.className = up ? 'price-up' : 'price-down';
    els.holding.textContent = `保有 ${stock.holdings}株`;
    renderChart(stock);
  }

  function renderNews() {
    if (state.mode !== 'main') {
      els.newsCount.textContent = '';
      els.news.innerHTML = '<p class="empty-history">本番用でニュースが表示されます。</p>';
      return;
    }
    const news = state.scenario.news.filter((item) => item[0] <= state.tick);
    els.newsCount.textContent = `${news.length} / ${state.scenario.news.length}件`;
    els.news.innerHTML = news.slice().reverse().map((item, index) => `<article class="news-item ${index === 0 ? 'is-latest' : ''}"><div><span class="news-tag">${item[1]}</span><time>${gameClock(item[0])}</time></div><p>${item[2]}</p></article>`).join('');
  }

  function renderAssets() {
    const stocks = totalStockValue(), total = totalAssets(), gain = profit(), rate = percent(gain, state.startingCash);
    els.cash.textContent = yen(state.cash);
    els.holdings.textContent = `${state.stocks.filter((stock) => stock.holdings > 0).length}銘柄`;
    els.stockValue.textContent = yen(stocks);
    els.total.textContent = yen(total);
    els.profit.textContent = `${gain > 0 ? '+' : gain < 0 ? '-' : '±'}${yen(Math.abs(gain))}`;
    els.rate.textContent = `${rate >= 0 ? '+' : ''}${rate.toFixed(2)}%`;
    els.profitCard.className = `profit-card ${gain > 0 ? 'positive' : gain < 0 ? 'negative' : 'neutral'}`;
  }

  function renderHistory() {
    els.history.innerHTML = state.transactions.length ? state.transactions.slice(0, 12).map((item) => `<div class="history-item ${item.kind}"><div class="history-main"><span>${item.kind === 'buy' ? '購入' : '売却'} ${item.name}</span><span>${yen(item.total)}</span></div><div class="history-sub">${item.qty}株 × ${yen(item.price)} / TICK ${item.tick}</div></div>`).join('') : '<p class="empty-history">まだ取引はありません。</p>';
  }

  function render() {
    els.timer.textContent = `${String(Math.floor(state.seconds / 60)).padStart(2, '0')}:${String(state.seconds % 60).padStart(2, '0')}`;
    els.tick.textContent = `TICK ${state.tick}`;
    renderList();
    renderQuote();
    renderNews();
    renderAssets();
    renderHistory();
  }

  function nextTick() {
    state.tick += 1;
    state.stocks.forEach((stock) => {
      stock.price = marketPrice(stock, state.tick);
      stock.history.push(stock.price);
      if (stock.history.length > 40) stock.history.shift();
    });
    state.seconds -= 1;
    render();
    if (state.seconds <= 0) finish();
  }

  function trade(kind) {
    const stock = selected();
    if (!stock) return;
    const qty = Math.max(1, Math.floor(Number(els.qty.value) || 0));
    const total = stock.price * qty;
    if (kind === 'buy') {
      if (total > state.cash) {
        els.message.textContent = '現金残高が足りません。株数を減らしてください。';
        els.message.style.color = '#bc3430';
        return;
      }
      state.cash -= total;
      stock.holdings += qty;
    } else {
      if (qty > stock.holdings) {
        els.message.textContent = `売却できるのは${stock.holdings}株までです。`;
        els.message.style.color = '#bc3430';
        return;
      }
      state.cash += total;
      stock.holdings -= qty;
    }
    state.transactions.unshift({ kind, name: stock.name, qty, price: stock.price, total, tick: state.tick });
    els.message.textContent = `${stock.name}を${qty}株${kind === 'buy' ? '購入' : '売却'}しました。`;
    els.message.style.color = '#287b57';
    render();
  }

  function finish() {
    window.clearInterval(state.timer);
    els.game.classList.add('hidden');
    els.result.classList.remove('hidden');
    const gain = profit();
    const rate = percent(gain, state.startingCash);
    els.resultAsset.textContent = yen(totalAssets());
    els.resultProfit.textContent = `${gain > 0 ? '+' : gain < 0 ? '-' : '±'}${yen(Math.abs(gain))}（${rate >= 0 ? '+' : ''}${rate.toFixed(2)}%）`;
    els.resultProfit.className = `result-profit ${gain > 0 ? 'positive' : gain < 0 ? 'negative' : 'neutral'}`;
    els.resultStats.innerHTML = `<div><span>売買回数</span><strong>${state.transactions.length}回</strong></div><div><span>保有銘柄数</span><strong>${state.stocks.filter((stock) => stock.holdings > 0).length}銘柄</strong></div><div><span>配信ニュース</span><strong>${state.mode === 'main' ? state.scenario.news.filter((item) => item[0] <= state.tick).length : 0}件</strong></div>`;
  }

  els.practice.addEventListener('click', () => startGame('practice'));
  els.main.addEventListener('click', () => startGame('main'));
  els.buy.addEventListener('click', () => trade('buy'));
  els.sell.addEventListener('click', () => trade('sell'));
  els.restart.addEventListener('click', () => { els.result.classList.add('hidden'); els.start.classList.remove('hidden'); });
  els.search.addEventListener('input', (event) => { state.query = event.target.value; renderList(); });
  document.querySelectorAll('[data-qty]').forEach((button) => button.addEventListener('click', () => { els.qty.value = button.dataset.qty; }));
})();

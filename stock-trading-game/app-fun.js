(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const el = {
    start: $('startScreen'), game: $('gameScreen'), result: $('resultScreen'),
    practice: $('practiceStart'), main: $('mainStart'), timer: $('timer'), tick: $('marketTick'), modeLabel: $('gameModeLabel'),
    search: $('stockSearch'), list: $('stockList'), sector: $('selectedSector'), name: $('selectedName'), code: $('selectedCode'), price: $('selectedPrice'), change: $('selectedChange'), chart: $('chart'),
    scenarioTitle: $('scenarioTitle'), scenarioMeta: $('scenarioMeta'), news: $('newsFeed'), newsCount: $('newsCount'),
    holding: $('holdingLabel'), qty: $('quantityInput'), buy: $('buyButton'), sell: $('sellButton'), message: $('orderMessage'),
    cash: $('cash'), holdings: $('holdingCount'), stockValue: $('stockValue'), total: $('totalAsset'), profit: $('profit'), rate: $('profitRate'), profitCard: $('profitCard'), history: $('history'),
    resultAsset: $('resultAsset'), resultProfit: $('resultProfit'), resultStats: $('resultStats'), restart: $('restartButton')
  };

  const PRACTICE = [
    ['NLC','ネオリンク','テクノロジー',1240,.018],['MRT','みらい電機','電力・インフラ',870,.013],['SFO','サンフーズ','食品',640,.015],['BTA','バンクタス','金融',1520,.016],['KRT','キラテック','製造業',980,.024]
  ];

  const SCENARIOS = [
    { name:'AI投資ラリー', base:.006, news:[
      [0,'速報','米IT大手、AIデータセンター投資を上方修正',['情報・通信','電気機器','精密'],.055],
      [28,'企業','国内通信大手、生成AI向け設備投資を拡大',['情報・通信','電気機器'],.035],
      [56,'電力','データセンター増設で電力設備に受注期待',['電力','建設','電気機器'],.030],
      [88,'市場','AI関連に短期の利益確定売り',['情報・通信','電気機器','精密'],-.022],
      [120,'海外','米半導体株が上昇、国内関連株を支援',['電気機器','精密','機械'],.033],
      [154,'企業','光通信部品、通期見通しを上方修正',['電気機器','精密','情報・通信'],.042],
      [190,'市場','大型株に買い戻し、指数は高値圏',['情報・通信','電気機器','精密'],.020],
      [226,'業種','通信株、投資負担を意識して選別',['情報・通信','通信'],-.012],
      [258,'引け前','AI関連に追随買いが入る',['情報・通信','電気機器','精密'],.018]
    ]},
    { name:'中国景気対策', base:.004, news:[
      [0,'速報','中国政府、不動産支援と大型インフラ投資を発表',['機械','鉄鋼','非鉄','建設'],.052],
      [25,'商品','鉄鉱石・銅価格が上昇　資源関連に買い',['鉄鋼','非鉄','鉱業','卸売'],.034],
      [54,'消費','訪日需要の回復期待で百貨店・化粧品に物色',['小売','化学','サービス'],.025],
      [84,'海外','政策の実効性を見極める動き',['機械','鉄鋼','非鉄'],-.017],
      [116,'企業','建機大手、中国向け出荷計画を上積み',['機械','建設'],.040],
      [150,'市場','素材株、利益確定売りで一服',['鉄鋼','非鉄','鉱業'],-.014],
      [183,'為替','人民元高でアジア株も底堅い',['機械','輸送用機器'],.018],
      [216,'市場','中国関連の内需銘柄にも買い広がる',['小売','サービス','化学'],.020],
      [255,'引け前','建機・資源株が再び買われる',['機械','鉄鋼','非鉄','鉱業'],.016]
    ]},
    { name:'資源価格急騰', base:.003, news:[
      [0,'速報','中東情勢の緊迫化で原油先物が急伸',['鉱業','石油','卸売'],.055],
      [25,'商品','WTI原油、前日比7％高まで上昇',['鉱業','石油'],.040],
      [55,'業種','燃料費上昇懸念で航空・陸運株に売り',['空運','陸運','輸送'],-.042],
      [85,'市場','商社株に買いが広がる',['卸売','商社'],.035],
      [116,'企業','石油元売り、収益改善期待が強まる',['石油','鉱業'],.030],
      [148,'海外','停戦協議の報道で原油は上げ幅を縮小',['鉱業','石油','卸売'],-.020],
      [182,'市場','防衛関連に資金流入',['精密','機械','電気機器'],.022],
      [216,'為替','資源高を受け円売り優勢',['輸送用機器','電気機器','機械'],.016],
      [256,'引け前','資源関連に買い直し',['鉱業','石油','卸売'],.018]
    ]},
    { name:'半導体巻き返し', base:.005, news:[
      [0,'速報','国内半導体投資への追加支援を政府が検討',['電気機器','精密','化学','機械'],.050],
      [28,'企業','国内工場向け装置受注、堅調との見方',['機械','精密','電気機器'],.032],
      [58,'海外','米半導体株指数が上昇',['電気機器','精密','機械'],.028],
      [88,'市場','関連株に短期の利益確定売り',['電気機器','精密','機械'],-.018],
      [120,'企業','電子部品メーカー、通期利益予想を上方修正',['電気機器','精密'],.040],
      [152,'為替','円安進行が輸出採算を下支え',['電気機器','機械','輸送用機器'],.022],
      [186,'市場','半導体材料株に買いが波及',['化学','電気機器'],.024],
      [220,'海外','中国向け需要の警戒感で値動き荒く',['電気機器','情報・通信'],-.013],
      [255,'引け前','装置・材料株が高値を更新',['機械','精密','化学','電気機器'],.017]
    ]},
    { name:'金利メリハリ相場', base:.002, news:[
      [0,'速報','日銀、追加利上げを決定　政策金利を0.25％引き上げ',['銀行','金融'],.052],
      [27,'債券','長期金利が上昇　不動産株に売り',['不動産','建設'],-.040],
      [56,'市場','銀行株、買いが加速',['銀行','金融'],.032],
      [86,'為替','円高進行で輸出株は軟調',['輸送用機器','電気機器','機械'],-.022],
      [118,'企業','大手地銀、利ざや改善見通しを公表',['銀行','金融'],.026],
      [150,'市場','金利上昇が一服、輸出株に買い戻し',['輸送用機器','電気機器','機械'],.024],
      [184,'海外','米長期金利も上昇　高PER株に重し',['情報・通信','電気機器','精密'],-.014],
      [220,'市場','金融株中心に資金が戻る',['銀行','金融','保険'],.020],
      [256,'引け前','値がさ株に買いが入り指数を押し上げ',['銀行','金融'],.012]
    ]}
  ];

  let s = { mode:'practice', scenario:null, stocks:[], selected:'', cash:0, startCash:1000000, seconds:180, tick:0, timer:null, trades:[], query:'' };
  const yen = (v) => new Intl.NumberFormat('ja-JP',{style:'currency',currency:'JPY',maximumFractionDigits:0}).format(Math.round(v));
  const pct = (a,b) => b ? 100*a/b : 0;
  const last = (a) => a[a.length-1];
  const hash = (txt) => { let n=0; for (const c of String(txt)) n=((n*31)+c.charCodeAt(0))>>>0; return n; };
  const current = () => s.stocks.find((x)=>x.id===s.selected);
  const stockValue = () => s.stocks.reduce((sum,x)=>sum+x.price*x.holdings,0);
  const assets = () => s.cash+stockValue();
  const profit = () => assets()-s.startCash;

  function match(stock, words){ return words.some((w)=>stock.sector.includes(w)||stock.name.includes(w)); }
  function effect(stock,event,time){
    const [at,,,words,impact]=event;
    if(time<at || !match(stock,words)) return 0;
    const age=time-at, ramp=Math.min(1,age/5), fade=age>72?Math.max(.28,1-(age-72)/175):1;
    const sensitivity=.82+((hash(stock.code)%35)/100);
    return impact*ramp*fade*sensitivity;
  }
  function calc(stock,time){
    const key=hash(stock.code);
    if(s.mode==='practice') return Math.max(30,Math.round(stock.open*(1+Math.sin(time*.78+(key%17))*stock.vol+Math.sin(time*.19)*.006)));
    const newsImpact=s.scenario.news.reduce((sum,e)=>sum+effect(stock,e,time),0);
    const broad=s.scenario.base*(time/300)+Math.sin(time*.07)*.0035;
    const individual=Math.sin(time*.47+(key%23))*.0035+Math.sin(time*.13+(key%9))*.002;
    return Math.max(10,Math.round(stock.open*(1+broad+newsImpact+individual)));
  }
  function mainStocks(){
    const companies=Array.isArray(window.REAL_COMPANIES)&&window.REAL_COMPANIES.length?window.REAL_COMPANIES:[
      {code:'7203',name:'トヨタ自動車',sector:'輸送用機器'},{code:'8306',name:'三菱UFJフィナンシャル・グループ',sector:'銀行'},{code:'8035',name:'東京エレクトロン',sector:'電気機器'},{code:'9432',name:'NTT',sector:'情報・通信'},{code:'9501',name:'東京電力HD',sector:'電力'}
    ];
    return companies.map((c)=>{const open=Math.max(120,Math.round(300+(hash(c.code)%2300)));return {id:c.code,code:c.code,name:c.name,sector:c.sector,open,price:open,holdings:0,history:Array(40).fill(open)};});
  }
  function practiceStocks(){return PRACTICE.map(([id,name,sector,price,vol])=>({id,code:id,name,sector,open:price,price,vol,holdings:0,history:Array(40).fill(price)}));}

  function start(mode){
    clearInterval(s.timer); s.mode=mode; s.scenario=SCENARIOS[Math.floor(Math.random()*SCENARIOS.length)]; s.startCash=mode==='main'?100000:1000000; s.seconds=mode==='main'?300:180; s.tick=0; s.cash=s.startCash; s.trades=[]; s.query=''; s.stocks=mode==='main'?mainStocks():practiceStocks(); s.selected=s.stocks[0].id;
    el.search.value=''; el.start.classList.add('hidden'); el.result.classList.add('hidden'); el.game.classList.remove('hidden');
    el.modeLabel.textContent=mode==='main'?'本番用 / 実在企業130社以上 / 5分':'練習用 / 架空企業5社 / 3分';
    el.scenarioTitle.textContent=mode==='main'?s.scenario.name:'ニュースなし';
    el.scenarioMeta.textContent=mode==='main'?'上昇材料・下落材料が時刻ごとに市場へ反映されます':'短期の値動きだけを見て売買します';
    el.message.textContent=mode==='main'?'ニュースを読んで、先回りしてみよう。':'銘柄を選び、株数を入力して注文してください。';
    render(); s.timer=setInterval(tick,1000);
  }

  function visible(){const q=s.query.trim().toLowerCase();return q?s.stocks.filter((x)=>`${x.name} ${x.code} ${x.sector}`.toLowerCase().includes(q)):s.stocks;}
  function renderList(){
    const list=visible();
    el.list.innerHTML=list.length?list.map((x)=>{const d=x.price-x.open,up=d>=0;return `<button type="button" class="stock-row ${x.id===s.selected?'active':''}" data-stock="${x.id}"><span><b class="stock-name">${x.name}</b><small class="stock-sector">${x.code} / ${x.sector}</small></span><span><b class="stock-price">${yen(x.price)}</b><small class="stock-move ${up?'price-up':'price-down'}">${up?'+':''}${pct(d,x.open).toFixed(2)}%</small></span></button>`;}).join(''):'<p class="empty-history">該当する銘柄がありません。</p>';
    el.list.querySelectorAll('[data-stock]').forEach((b)=>b.addEventListener('click',()=>{s.selected=b.dataset.stock;render();}));
  }
  function smooth(points){let d=`M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;for(let i=0;i<points.length-1;i++){const a=points[i-1]||points[i],b=points[i],c=points[i+1],z=points[i+2]||c;d+=` C ${(b.x+(c.x-a.x)/6).toFixed(1)} ${(b.y+(c.y-a.y)/6).toFixed(1)}, ${(c.x-(z.x-b.x)/6).toFixed(1)} ${(c.y-(z.y-b.y)/6).toFixed(1)}, ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;}return d;}
  function renderChart(x){
    const a=x.history,W=640,H=250,p={l:42,r:15,t:18,b:31},min=Math.min(...a),max=Math.max(...a),span=Math.max(max-min,1),low=min-span*.2,high=max+span*.2;
    const X=(i)=>p.l+i*(W-p.l-p.r)/(a.length-1),Y=(v)=>p.t+(high-v)*(H-p.t-p.b)/(high-low),pts=a.map((v,i)=>({x:X(i),y:Y(v)})),line=smooth(pts),end=last(pts),diff=last(a)-a[0],color=diff>=0?'#c6403b':'#2772b9';
    const grid=[0,.5,1].map((k)=>{const v=high-(high-low)*k,yy=Y(v);return `<line x1="${p.l}" y1="${yy.toFixed(1)}" x2="${W-p.r}" y2="${yy.toFixed(1)}" stroke="#e4eaf2" stroke-dasharray="3 5"/><text x="2" y="${(yy+4).toFixed(1)}" fill="#8d98a9" font-size="11">${yen(v)}</text>`;}).join('');
    el.chart.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".20"/><stop offset="1" stop-color="${color}" stop-opacity=".02"/></linearGradient></defs>${grid}<path d="${line} L ${end.x.toFixed(1)} ${H-p.b} L ${pts[0].x.toFixed(1)} ${H-p.b} Z" fill="url(#fill)"/><path d="${line}" fill="none" stroke="${color}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${end.x.toFixed(1)}" cy="${end.y.toFixed(1)}" r="5" fill="${color}" stroke="#fff" stroke-width="3"/><rect x="${W-120}" y="12" width="104" height="24" rx="6" fill="#fff" stroke="#dfe6ef"/><text x="${W-111}" y="28" fill="${color}" font-size="12" font-weight="700">${diff>=0?'+':''}${pct(diff,a[0]).toFixed(2)}%</text><text x="${p.l}" y="${H-8}" fill="#8995a7" font-size="11">40秒前</text><text x="${W-p.r-24}" y="${H-8}" fill="#8995a7" font-size="11">現在</text></svg>`;
  }
  function renderQuote(){const x=s.stocks.find((v)=>v.id===s.selected);if(!x)return;const d=x.price-x.open,up=d>=0;el.sector.textContent=x.sector;el.name.textContent=x.name;el.code.textContent=x.code;el.price.textContent=yen(x.price);el.change.textContent=`${d>=0?'+':''}${yen(d)} (${up?'+':''}${pct(d,x.open).toFixed(2)}%)`;el.change.className=up?'price-up':'price-down';el.holding.textContent=`保有 ${x.holdings}株`;renderChart(x);}
  function renderNews(){if(s.mode!=='main'){el.newsCount.textContent='';el.news.innerHTML='<p class="empty-history">本番用でニュースが表示されます。</p>';return;}const items=s.scenario.news.filter((n)=>n[0]<=s.tick);el.newsCount.textContent=`${items.length} / ${s.scenario.news.length}件`;el.news.innerHTML=items.slice().reverse().map((n,i)=>`<article class="news-item ${i===0?'is-latest':''}"><div><span class="news-tag">${n[1]}</span><time>${String(9+Math.floor(n[0]/60)).padStart(2,'0')}:${String(n[0]%60).padStart(2,'0')}</time></div><p>${n[2]}</p></article>`).join('');}
  function renderAssets(){const v=stockValue(),t=assets(),g=profit(),r=pct(g,s.startCash);el.cash.textContent=yen(s.cash);el.holdings.textContent=`${s.stocks.filter((x)=>x.holdings>0).length}銘柄`;el.stockValue.textContent=yen(v);el.total.textContent=yen(t);el.profit.textContent=`${g>0?'+':g<0?'-':'±'}${yen(Math.abs(g))}`;el.rate.textContent=`${r>=0?'+':''}${r.toFixed(2)}%`;el.profitCard.className=`profit-card ${g>0?'positive':g<0?'negative':'neutral'}`;}
  function renderHistory(){el.history.innerHTML=s.trades.length?s.trades.slice(0,12).map((x)=>`<div class="history-item ${x.kind}"><div class="history-main"><span>${x.kind==='buy'?'購入':'売却'} ${x.name}</span><span>${yen(x.total)}</span></div><div class="history-sub">${x.qty}株 × ${yen(x.price)} / TICK ${x.tick}</div></div>`).join(''):'<p class="empty-history">まだ取引はありません。</p>';}
  function render(){el.timer.textContent=`${String(Math.floor(s.seconds/60)).padStart(2,'0')}:${String(s.seconds%60).padStart(2,'0')}`;el.tick.textContent=`TICK ${s.tick}`;renderList();renderQuote();renderNews();renderAssets();renderHistory();}
  function tick(){s.tick++;s.stocks.forEach((x)=>{x.price=calc(x,s.tick);x.history.push(x.price);if(x.history.length>40)x.history.shift();});s.seconds--;render();if(s.seconds<=0)finish();}
  function trade(kind){const x=current();if(!x)return;const qty=Math.max(1,Math.floor(Number(el.qty.value)||0)),total=x.price*qty;if(kind==='buy'){if(total>s.cash){el.message.textContent='現金残高が足りません。株数を減らしてください。';el.message.style.color='#bc3430';return;}s.cash-=total;x.holdings+=qty;}else{if(qty>x.holdings){el.message.textContent=`売却できるのは${x.holdings}株までです。`;el.message.style.color='#bc3430';return;}s.cash+=total;x.holdings-=qty;}s.trades.unshift({kind,name:x.name,qty,price:x.price,total,tick:s.tick});el.message.textContent=`${x.name}を${qty}株${kind==='buy'?'購入':'売却'}しました。`;el.message.style.color='#287b57';render();}
  function finish(){clearInterval(s.timer);el.game.classList.add('hidden');el.result.classList.remove('hidden');const g=profit(),r=pct(g,s.startCash);el.resultAsset.textContent=yen(assets());el.resultProfit.textContent=`${g>0?'+':g<0?'-':'±'}${yen(Math.abs(g))}（${r>=0?'+':''}${r.toFixed(2)}%）`;el.resultProfit.className=`result-profit ${g>0?'positive':g<0?'negative':'neutral'}`;el.resultStats.innerHTML=`<div><span>売買回数</span><strong>${s.trades.length}回</strong></div><div><span>保有銘柄数</span><strong>${s.stocks.filter((x)=>x.holdings>0).length}銘柄</strong></div><div><span>配信ニュース</span><strong>${s.mode==='main'?s.scenario.news.length:0}件</strong></div>`;}

  el.practice.addEventListener('click',()=>start('practice'));
  el.main.addEventListener('click',()=>start('main'));
  el.buy.addEventListener('click',()=>trade('buy'));
  el.sell.addEventListener('click',()=>trade('sell'));
  el.restart.addEventListener('click',()=>{el.result.classList.add('hidden');el.start.classList.remove('hidden');});
  el.search.addEventListener('input',(e)=>{s.query=e.target.value;renderList();});
  document.querySelectorAll('[data-qty]').forEach((b)=>b.addEventListener('click',()=>{el.qty.value=b.dataset.qty;}));
})();

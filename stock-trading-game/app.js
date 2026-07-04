const PRACTICE=[
 {id:'NLC',code:'NLC',name:'ネオリンク',sector:'テクノロジー',price:1240,vol:.018},
 {id:'MRT',code:'MRT',name:'みらい電機',sector:'電力・インフラ',price:870,vol:.012},
 {id:'SFO',code:'SFO',name:'サンフーズ',sector:'食品',price:640,vol:.015},
 {id:'BTA',code:'BTA',name:'バンクタス',sector:'金融',price:1520,vol:.016},
 {id:'KRT',code:'KRT',name:'キラテック',sector:'製造業',price:980,vol:.024}
];

const SCENARIOS=[
 {id:'rate',name:'金融政策ショック',events:[
  [0,'速報','日銀、追加利上げを決定　政策金利を0.25％引き上げ',['銀行','金融'],.042],
  [18,'債券','10年国債利回りが上昇　金利敏感株に売り',['不動産','建設'],-.040],
  [42,'為替','ドル円、一時148円台前半　円高が進行',['輸送用機器','電気機器','機械'],-.032],
  [66,'市場','銀行株、短期筋の買いが加速',['銀行','金融'],.025],
  [94,'企業','大手地銀、預貸金利ざやの改善見通しを公表',['銀行','金融'],.018],
  [123,'海外','米長期金利も上昇　高PER株に重し',['情報・通信','電気機器','精密'],-.026],
  [155,'市場','不動産株、下げ幅を拡大',['不動産'],-.020],
  [190,'為替','円高一服　輸出株に買い戻し',['輸送用機器','電気機器','機械'],.018],
  [226,'観測','市場、次回会合での追加対応を見極め',['銀行','金融'],-.012],
  [264,'引け前','指数は方向感を欠く　セクター間の差が拡大',['不動産','銀行'],.006]
 ]},
 {id:'oil',name:'資源価格急騰',events:[
  [0,'速報','中東情勢の緊迫化で原油先物が急伸',['鉱業','石油','卸売'],.046],
  [20,'商品','WTI原油、前日比7％高まで上昇',['鉱業','石油'],.030],
  [46,'業種','燃料費上昇懸念で航空・陸運株に売り',['空運','陸運','輸送'],-.050],
  [73,'為替','資源高を受け円売り優勢',['輸送用機器','電気機器','機械'],.012],
  [101,'市場','商社株に買いが広がる',['卸売','商社'],.026],
  [132,'企業','石油元売り、精製マージン拡大を意識',['石油','鉱業'],.018],
  [162,'業種','化学・食品はコスト増を警戒',['化学','食品'],-.018],
  [195,'海外','停戦協議の報道で原油は上げ幅を縮小',['鉱業','石油','卸売'],-.022],
  [228,'市場','防衛関連に資金流入',['精密','機械','電気機器'],.012],
  [268,'引け前','原油価格の値動き荒く　関連株も高安まちまち',['鉱業','石油'],-.004]
 ]},
 {id:'chip',name:'半導体規制',events:[
  [0,'速報','米政府、先端半導体装置の輸出規制を追加強化へ',['電気機器','精密','情報・通信'],-.044],
  [17,'海外','米半導体株指数、時間外で下落',['電気機器','精密','機械'],-.024],
  [43,'企業','対中売上比率を巡り電子部品株で選別',['電気機器','精密'],-.016],
  [70,'政策','政府、国内半導体投資への追加支援を検討',['電気機器','精密','化学','機械'],.026],
  [99,'市場','半導体材料株、押し目買いが優勢',['化学','電気機器'],.014],
  [132,'海外','中国向けスマホ出荷の減速観測',['電気機器','情報・通信'],-.018],
  [162,'為替','円安進行が輸出採算を下支え',['電気機器','機械','輸送用機器'],.020],
  [194,'企業','国内工場向け装置受注、堅調との見方',['機械','精密','電気機器'],.016],
  [226,'市場','関連株に利益確定売り',['電気機器','精密','機械'],-.018],
  [263,'引け前','指数は戻り鈍い　材料株中心の売買',['電気機器','精密'],-.006]
 ]},
 {id:'china',name:'中国景気対策',events:[
  [0,'速報','中国政府、不動産支援と大型インフラ投資を発表',['機械','鉄鋼','非鉄','建設'],.044],
  [22,'商品','鉄鉱石・銅価格が上昇　資源関連に買い',['鉄鋼','非鉄','鉱業','卸売'],.026],
  [49,'消費','訪日需要の回復期待で百貨店・化粧品に物色',['小売','化学','サービス'],.018],
  [77,'海外','中国不動産販売、改善は限定的との見方',['機械','鉄鋼','非鉄'],-.020],
  [106,'企業','建機大手、中国向け出荷計画を上積み',['機械','建設'],.022],
  [135,'市場','素材株、短期の利益確定売り',['鉄鋼','非鉄','鉱業'],-.014],
  [166,'為替','人民元高でアジア通貨も底堅い',['機械','輸送用機器'],.010],
  [198,'海外','追加対策の規模を巡り観測が交錯',['機械','鉄鋼','非鉄'],-.012],
  [231,'市場','中国関連の内需銘柄にも買い広がる',['小売','サービス','化学'],.009],
  [266,'引け前','建機・素材を中心に高安まちまち',['機械','鉄鋼','非鉄'],-.004]
 ]},
 {id:'ai',name:'AI設備投資',events:[
  [0,'速報','米IT大手、AIデータセンター投資を上方修正',['情報・通信','電気機器','精密'],.043],
  [19,'企業','国内通信大手、生成AI向け設備投資を拡大',['情報・通信','電気機器'],.024],
  [46,'電力','データセンター増設で電力需要の逼迫懸念',['電力','ガス','建設'],.020],
  [74,'市場','光通信部品・サーバー関連に買い',['電気機器','精密','情報・通信'],.018],
  [103,'海外','米半導体株が上昇、国内関連株を支援',['電気機器','精密','機械'],.016],
  [132,'市場','AI関連の一部に過熱感　利益確定売り',['情報・通信','電気機器','精密'],-.022],
  [162,'企業','電力設備の受注見通しを上方修正',['電力','建設','電気機器'],.015],
  [195,'業種','通信株、巨額投資負担への懸念も',['情報・通信','通信'],-.012],
  [228,'市場','大型株中心に買い戻し',['電気機器','精密','情報・通信'],.010],
  [264,'引け前','AI関連は銘柄ごとの選別色が強まる',['情報・通信','電気機器'],-.005]
 ]},
 {id:'pharma',name:'大型新薬承認',events:[
  [0,'速報','米FDA、新薬を承認　対象患者は年間数十万人規模',['医薬品'],.050],
  [24,'企業','販売提携先にも買い注文が入る',['医薬品','情報・通信'],.018],
  [51,'市場','競合薬を持つ企業は軟調',['医薬品'],-.012],
  [79,'海外','承認薬の薬価水準を見極める動き',['医薬品'],-.014],
  [109,'企業','国内販売網の拡充計画を公表',['医薬品','サービス'],.016],
  [141,'市場','バイオ関連に資金が波及',['医薬品','精密'],.011],
  [171,'観測','副作用情報の精査を求める声も',['医薬品'],-.017],
  [203,'海外','米医療保険大手、採用方針を検討',['医薬品','サービス'],.009],
  [234,'市場','材料出尽くしを意識した売り',['医薬品'],-.018],
  [268,'引け前','医薬品株は高安まちまち',['医薬品'],-.004]
 ]}
];

let mode='practice',startingCash=1000000,duration=180,stocks=[],selectedId='',cash=0,seconds=0,tick=0,timerId=null,transactions=[],searchText='',scenario=null;
const $=id=>document.getElementById(id);
const el={start:$('startScreen'),game:$('gameScreen'),result:$('resultScreen'),practice:$('practiceStart'),main:$('mainStart'),modeLabel:$('gameModeLabel'),timer:$('timer'),tick:$('marketTick'),search:$('stockSearch'),list:$('stockList'),scenarioTitle:$('scenarioTitle'),scenarioMeta:$('scenarioMeta'),sector:$('selectedSector'),name:$('selectedName'),code:$('selectedCode'),price:$('selectedPrice'),change:$('selectedChange'),chart:$('chart'),holding:$('holdingLabel'),qty:$('quantityInput'),buy:$('buyButton'),sell:$('sellButton'),message:$('orderMessage'),cash:$('cash'),holdings:$('holdingCount'),stockValue:$('stockValue'),total:$('totalAsset'),profit:$('profit'),rate:$('profitRate'),profitCard:$('profitCard'),history:$('history'),news:$('newsFeed'),newsCount:$('newsCount'),resultAsset:$('resultAsset'),resultProfit:$('resultProfit'),resultStats:$('resultStats'),restart:$('restartButton')};
const money=v=>new Intl.NumberFormat('ja-JP',{style:'currency',currency:'JPY',maximumFractionDigits:0}).format(Math.round(v));
const timeText=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
const pct=(a,b)=>b?100*a/b:0;
const selected=()=>stocks.find(s=>s.id===selectedId);
const last=a=>a[a.length-1];
const stockValue=()=>stocks.reduce((sum,s)=>sum+s.price*s.holdings,0);
const totalAsset=()=>cash+stockValue();
const profit=()=>totalAsset()-startingCash;
function seedNumber(text){let n=0;for(const ch of String(text))n=(n*31+ch.charCodeAt(0))>>>0;return n}
function createPractice(){return PRACTICE.map(s=>({...s,open:s.price,holdings:0,history:Array(40).fill(s.price)}))}
function matches(stock,groups){return groups.some(g=>stock.sector.includes(g)||stock.name.includes(g))}
function eventEffect(stock,event,t){if(t<event[0]||!matches(stock,event[3]))return 0;const age=t-event[0],ramp=Math.min(1,age/7),fade=age>64?Math.max(.34,1-(age-64)/190):1;const sensitivity=.72+((seedNumber(stock.code)%43)/100);return event[4]*ramp*fade*sensitivity}
function basePrice(company){const seed=seedNumber(company.code);return Math.max(120,Math.round(240+(seed%6800)))}
function priceAt(stock,t){const seed=seedNumber(stock.code);if(mode==='practice'){const wave=Math.sin(t*.8+(seed%13))*.012+Math.sin(t*.21)*.005;return Math.max(20,Math.round(stock.open*(1+wave)))}const events=scenario.events;const impact=events.reduce((sum,e)=>sum+eventEffect(stock,e,t),0);const market=Math.sin(t*.09)*.003+Math.sin(t*.031+(seed%7))*.0025;const noise=Math.sin(t*.63+(seed%31))*.003+Math.sin(t*.17+(seed%19))*.0014;const meanRevert=Math.sin(t*.015+(seed%11))*.002;return Math.max(10,Math.round(stock.open*(1+impact+market+noise+meanRevert)))}
function createMain(){return (window.REAL_COMPANIES||[]).map(c=>{const open=basePrice(c);const s={id:c.code,code:c.code,name:c.name,sector:c.sector,open,price:open,holdings:0,history:Array(40).fill(open)};return s})}
function pickScenario(){return SCENARIOS[Math.floor(Math.random()*SCENARIOS.length)]}
function begin(nextMode){clearInterval(timerId);mode=nextMode;duration=mode==='practice'?180:300;startingCash=mode==='practice'?1000000:100000;scenario=pickScenario();stocks=mode==='practice'?createPractice():createMain();cash=startingCash;seconds=duration;tick=0;transactions=[];searchText='';selectedId=stocks[0]?stocks[0].id:'';el.search.value='';el.start.classList.add('hidden');el.result.classList.add('hidden');el.game.classList.remove('hidden');el.modeLabel.textContent=mode==='practice'?'練習用 / 架空企業5社 / 3分':'本番用 / 実在企業130社以上 / 5分';el.scenarioTitle.textContent=mode==='main'?scenario.name:'ニュースなし';el.scenarioMeta.textContent=mode==='main'?'速報は時刻ごとに市場へ反映されます':'短期の値動きだけを見て売買します';render();timerId=setInterval(nextTick,1000)}
function visibleStocks(){const q=searchText.trim().toLowerCase();return q?stocks.filter(s=>`${s.name} ${s.code} ${s.sector}`.toLowerCase().includes(q)):stocks}
function renderList(){const list=visibleStocks();el.list.innerHTML=list.length?list.map(s=>{const d=s.price-s.open,up=d>=0;return `<button type="button" class="stock-row ${s.id===selectedId?'active':''}" data-stock="${s.id}"><span><b class="stock-name">${s.name}</b><small class="stock-sector">${s.code} / ${s.sector}</small></span><span><b class="stock-price">${money(s.price)}</b><small class="stock-move ${up?'price-up':'price-down'}">${up?'+':''}${pct(d,s.open).toFixed(2)}%</small></span></button>`}).join(''):'<p class="empty-history">該当する銘柄がありません。</p>';el.list.querySelectorAll('[data-stock]').forEach(b=>b.addEventListener('click',()=>{selectedId=b.dataset.stock;render()}))}
function smooth(points){let path=`M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;for(let i=0;i<points.length-1;i++){const a=points[i-1]||points[i],b=points[i],c=points[i+1],d=points[i+2]||c;path+=` C ${(b.x+(c.x-a.x)/6).toFixed(1)} ${(b.y+(c.y-a.y)/6).toFixed(1)}, ${(c.x-(d.x-b.x)/6).toFixed(1)} ${(c.y-(d.y-b.y)/6).toFixed(1)}, ${c.x.toFixed(1)} ${c.y.toFixed(1)}`}return path}
function renderChart(s){const d=s.history,W=640,H=250,p={l:41,r:15,t:18,b:31},min=Math.min(...d),max=Math.max(...d),span=Math.max(max-min,1),low=min-span*.2,high=max+span*.2,x=i=>p.l+i*(W-p.l-p.r)/(d.length-1),y=v=>p.t+(high-v)*(H-p.t-p.b)/(high-low),points=d.map((v,i)=>({x:x(i),y:y(v)})),line=smooth(points),end=last(points),up=last(d)>=d[0],color=up?'#c6403b':'#2772b9',start=d[0],delta=last(d)-start,grid=[0,.5,1].map(k=>{const val=high-(high-low)*k,yy=y(val);return `<line x1="${p.l}" y1="${yy.toFixed(1)}" x2="${W-p.r}" y2="${yy.toFixed(1)}" stroke="#e4eaf2" stroke-dasharray="3 5"/><text x="2" y="${(yy+4).toFixed(1)}" fill="#8d98a9" font-size="11">${money(val)}</text>`}).join(''),area=`${line} L ${end.x.toFixed(1)} ${H-p.b} L ${points[0].x.toFixed(1)} ${H-p.b} Z`;el.chart.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".20"/><stop offset="1" stop-color="${color}" stop-opacity=".02"/></linearGradient></defs>${grid}<path d="${area}" fill="url(#fill)"/><path d="${line}" fill="none" stroke="${color}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/><line x1="${p.l}" y1="${y(start).toFixed(1)}" x2="${W-p.r}" y2="${y(start).toFixed(1)}" stroke="#aab6c6" stroke-dasharray="5 5"/><circle cx="${end.x.toFixed(1)}" cy="${end.y.toFixed(1)}" r="5" fill="${color}" stroke="#fff" stroke-width="3"/><rect x="${W-120}" y="12" width="104" height="24" rx="6" fill="#fff" stroke="#dfe6ef"/><text x="${W-111}" y="28" fill="${color}" font-size="12" font-weight="700">${delta>=0?'+':''}${pct(delta,start).toFixed(2)}%</text><text x="${p.l}" y="${H-8}" fill="#8995a7" font-size="11">40秒前</text><text x="${W-p.r-24}" y="${H-8}" fill="#8995a7" font-size="11">現在</text></svg>`}
function renderQuote(){const s=selected();if(!s)return;const d=s.price-s.open,up=d>=0;el.sector.textContent=s.sector;el.name.textContent=s.name;el.code.textContent=s.code;el.price.textContent=money(s.price);el.change.textContent=`${d>=0?'+':''}${money(d)} (${up?'+':''}${pct(d,s.open).toFixed(2)}%)`;el.change.className=up?'price-up':'price-down';el.holding.textContent=`保有 ${s.holdings}株`;renderChart(s)}
function gameTime(at){const mins=9*60+at;return `${String(Math.floor(mins/60)).padStart(2,'0')}:${String(mins%60).padStart(2,'0')}`}
function renderNews(){if(mode==='practice'){el.newsCount.textContent='';el.news.innerHTML='<p class="empty-history">本番用でニュースが表示されます。</p>';return}const news=scenario.events.filter(e=>e[0]<=tick);el.newsCount.textContent=`${news.length} / ${scenario.events.length}件`;el.news.innerHTML=news.length?news.slice().reverse().map((e,i)=>`<article class="news-item ${i===0?'is-latest':''}"><div><span class="news-tag">${e[1]}</span><time>${gameTime(e[0])}</time></div><p>${e[2]}</p></article>`).join(''):'<p class="empty-history">市場開始を待っています。</p>'}
function renderAssets(){const value=stockValue(),total=totalAsset(),gain=profit(),rate=pct(gain,startingCash);el.cash.textContent=money(cash);el.holdings.textContent=`${stocks.filter(s=>s.holdings>0).length}銘柄`;el.stockValue.textContent=money(value);el.total.textContent=money(total);el.profit.textContent=`${gain>0?'+':gain<0?'-':'±'}${money(Math.abs(gain))}`;el.rate.textContent=`${rate>=0?'+':''}${rate.toFixed(2)}%`;el.profitCard.className=`profit-card ${gain>0?'positive':gain<0?'negative':'neutral'}`}
function renderHistory(){el.history.innerHTML=transactions.length?transactions.slice(0,12).map(t=>`<div class="history-item ${t.kind}"><div class="history-main"><span>${t.kind==='buy'?'購入':'売却'} ${t.name}</span><span>${money(t.total)}</span></div><div class="history-sub">${t.qty}株 × ${money(t.price)} / TICK ${t.tick}</div></div>`).join(''):'<p class="empty-history">まだ取引はありません。</p>'}
function render(){el.timer.textContent=timeText(seconds);el.tick.textContent=`TICK ${tick}`;renderList();renderQuote();renderNews();renderAssets();renderHistory()}
function nextTick(){tick++;stocks.forEach(s=>{s.price=priceAt(s,tick);s.history.push(s.price);if(s.history.length>40)s.history.shift()});seconds--;render();if(seconds<=0)finish()}
function trade(kind){const s=selected(),qty=Math.max(1,Math.floor(Number(el.qty.value)||0)),total=s.price*qty;if(kind==='buy'){if(total>cash){el.message.textContent='現金残高が足りません。株数を減らしてください。';el.message.style.color='#bc3430';return}cash-=total;s.holdings+=qty}else{if(qty>s.holdings){el.message.textContent=`売却できるのは${s.holdings}株までです。`;el.message.style.color='#bc3430';return}cash+=total;s.holdings-=qty}transactions.unshift({kind,name:s.name,qty,price:s.price,total,tick});el.message.textContent=`${s.name}を${qty}株${kind==='buy'?'購入':'売却'}しました。`;el.message.style.color='#287b57';render()}
function finish(){clearInterval(timerId);el.game.classList.add('hidden');el.result.classList.remove('hidden');const total=totalAsset(),gain=profit(),rate=pct(gain,startingCash);el.resultAsset.textContent=money(total);el.resultProfit.textContent=`${gain>0?'+':gain<0?'-':'±'}${money(Math.abs(gain))}（${rate>=0?'+':''}${rate.toFixed(2)}%）`;el.resultProfit.className=`result-profit ${gain>0?'positive':gain<0?'negative':'neutral'}`;el.resultStats.innerHTML=`<div><span>売買回数</span><strong>${transactions.length}回</strong></div><div><span>保有銘柄数</span><strong>${stocks.filter(s=>s.holdings>0).length}銘柄</strong></div><div><span>配信ニュース</span><strong>${mode==='main'?scenario.events.filter(e=>e[0]<=tick).length:0}件</strong></div>`}
el.practice.addEventListener('click',()=>begin('practice'));el.main.addEventListener('click',()=>begin('main'));el.buy.addEventListener('click',()=>trade('buy'));el.sell.addEventListener('click',()=>trade('sell'));el.restart.addEventListener('click',()=>{el.result.classList.add('hidden');el.start.classList.remove('hidden')});el.search.addEventListener('input',e=>{searchText=e.target.value;renderList()});document.querySelectorAll('[data-qty]').forEach(b=>b.addEventListener('click',()=>{el.qty.value=b.dataset.qty});
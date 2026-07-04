const PRACTICE=[
{id:'NLC',code:'NLC',name:'ネオリンク',sector:'テクノロジー',price:1240,vol:.018},
{id:'MRT',code:'MRT',name:'みらい電機',sector:'電力・インフラ',price:870,vol:.012},
{id:'SFO',code:'SFO',name:'サンフーズ',sector:'食品',price:640,vol:.015},
{id:'BTA',code:'BTA',name:'バンクタス',sector:'金融',price:1520,vol:.016},
{id:'KRT',code:'KRT',name:'キラテック',sector:'製造業',price:980,vol:.024}
];

const MARKET_THEMES=[
 {name:'金利',news:[
  {at:0,tag:'速報',title:'日銀、追加利上げを決定　政策金利を0.25％引き上げ',words:['銀行','金融'],impact:.070},
  {at:36,tag:'市場',title:'長期金利が上昇　不動産・高PER銘柄に売り',words:['不動産','建設'],impact:-.060},
  {at:74,tag:'為替',title:'円相場、一時1ドル＝148円台へ　輸出株の重荷に',words:['輸送用機器','電気機器','自動車','機械'],impact:-.045},
  {at:124,tag:'企業',title:'大手地銀、預貸金利ざやの改善見通しを発表',words:['銀行','金融'],impact:.035},
  {at:176,tag:'市場',title:'国内REIT指数、金利上昇を受け下げ幅拡大',words:['不動産'],impact:-.030}
 ]},
 {name:'原油',news:[
  {at:0,tag:'速報',title:'中東情勢の緊迫化で原油先物が急伸',words:['石油','鉱業','商社','卸売'],impact:.070},
  {at:42,tag:'商品',title:'WTI原油、一時前日比7％高　供給不安が拡大',words:['石油','鉱業'],impact:.045},
  {at:83,tag:'業種',title:'燃料費上昇懸念で航空・陸運株に売り',words:['空運','陸運','輸送'],impact:-.070},
  {at:136,tag:'為替',title:'資源高を受け円売り優勢　輸入コスト上昇を警戒',words:['小売','食品','化学'],impact:-.030},
  {at:196,tag:'市場',title:'防衛関連に資金流入　地政学リスクを意識',words:['精密','機械','電気機器'],impact:.020}
 ]},
 {name:'半導体',news:[
  {at:0,tag:'速報',title:'米政府、先端半導体装置の輸出規制を追加強化へ',words:['電気機器','精密','情報・通信','テクノロジー'],impact:-.065},
  {at:35,tag:'海外',title:'米半導体株指数が時間外で下落　国内関連株にも警戒',words:['電気機器','精密','機械'],impact:-.045},
  {at:91,tag:'企業',title:'国内ファウンドリー支援策、政府が追加予算を検討',words:['電気機器','精密','化学','機械'],impact:.035},
  {at:151,tag:'市場',title:'電子部品株、対中売上比率を巡り銘柄選別',words:['電気機器','精密'],impact:-.020},
  {at:211,tag:'為替',title:'円安進行が輸出採算を下支え',words:['電気機器','機械','自動車'],impact:.025}
 ]},
 {name:'中国',news:[
  {at:0,tag:'速報',title:'中国政府、不動産支援と大型インフラ投資を発表',words:['機械','鉄鋼','非鉄','建設'],impact:.070},
  {at:41,tag:'商品',title:'鉄鉱石・銅価格が上昇　資源関連に買い',words:['鉄鋼','非鉄','鉱業','商社','卸売'],impact:.045},
  {at:96,tag:'消費',title:'訪日需要の回復期待で百貨店・化粧品に物色',words:['小売','化学','サービス'],impact:.035},
  {at:154,tag:'海外',title:'中国景気対策の実効性を見極める動きも',words:['機械','鉄鋼','非鉄'],impact:-.020},
  {at:218,tag:'市場',title:'建機株、短期筋の利益確定売りが優勢',words:['機械','建設'],impact:-.025}
 ]},
 {name:'AI投資',news:[
  {at:0,tag:'速報',title:'米IT大手、AIデータセンター投資を上方修正',words:['情報・通信','電気機器','精密','建設'],impact:.065},
  {at:38,tag:'企業',title:'国内通信大手、生成AI向け設備投資を拡大',words:['情報・通信','通信','電気機器'],impact:.050},
  {at:89,tag:'電力',title:'データセンター増設で電力需要の逼迫懸念',words:['電力','ガス','建設'],impact:.035},
  {at:148,tag:'市場',title:'AI関連、一部で過熱感　短期の利益確定売り',words:['情報・通信','電気機器','精密'],impact:-.030},
  {at:206,tag:'企業',title:'光通信部品の受注見通しを上方修正',words:['電気機器','精密','情報・通信'],impact:.025}
 ]}
];

let mode='practice',startingCash=1000000,duration=180,stocks=[],selectedId='',cash=0,seconds=0,tick=0,timerId=null,transactions=[],searchText='',theme=null;
const $=id=>document.getElementById(id);
const el={start:$('startScreen'),loading:$('loadingScreen'),game:$('gameScreen'),result:$('resultScreen'),practice:$('practiceStart'),main:$('mainStart'),modeLabel:$('gameModeLabel'),timer:$('timer'),tick:$('marketTick'),search:$('stockSearch'),list:$('stockList'),hint:$('hintText'),chartTitle:$('chartTitle'),sector:$('selectedSector'),name:$('selectedName'),code:$('selectedCode'),price:$('selectedPrice'),change:$('selectedChange'),chart:$('chart'),holding:$('holdingLabel'),qty:$('quantityInput'),buy:$('buyButton'),sell:$('sellButton'),message:$('orderMessage'),cash:$('cash'),holdings:$('holdingCount'),stockValue:$('stockValue'),total:$('totalAsset'),profit:$('profit'),rate:$('profitRate'),profitCard:$('profitCard'),history:$('history'),news:$('newsFeed'),newsCount:$('newsCount'),resultAsset:$('resultAsset'),resultProfit:$('resultProfit'),resultStats:$('resultStats'),restart:$('restartButton')};
const money=v=>new Intl.NumberFormat('ja-JP',{style:'currency',currency:'JPY',maximumFractionDigits:0}).format(Math.round(v));
const timeText=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
const pct=(a,b)=>b?100*a/b:0;
const selected=()=>stocks.find(s=>s.id===selectedId);
const stockValue=()=>stocks.reduce((sum,s)=>sum+s.price*s.holdings,0);
const totalAsset=()=>cash+stockValue();
const profit=()=>totalAsset()-startingCash;
const last=a=>a[a.length-1];
function seedNumber(text){let n=0;for(const ch of String(text))n=(n*31+ch.charCodeAt(0))>>>0;return n}
function createPracticeStocks(){return PRACTICE.map(s=>({...s,open:s.price,holdings:0,history:Array(40).fill(s.price),replay:null}))}
function impactFor(c){return theme.news.reduce((sum,n)=>sum+(n.words.some(w=>c.sector.includes(w))?n.impact:0),0)}
function createMainStocks(){return (window.REAL_COMPANIES||[]).map(c=>{const seed=seedNumber(c.code),price=Math.max(120,Math.round(260+(seed%7300))),impact=impactFor(c),path=[];for(let i=0;i<=300;i++){const t=i/300;const progress=Math.min(1,t/.82);const drift=impact*progress;const local=Math.sin(i*.42+(seed%9))*.003+Math.sin(i*.13+(seed%17))*.0025;const shake=Math.sin(i*.91+(seed%31))*.0012;path.push(Math.max(10,Math.round(price*(1+drift+local+shake))));}path[0]=price;return{id:c.code,code:c.code,name:c.name,sector:c.sector,price,open:price,holdings:0,history:Array(40).fill(price),replay:path,vol:.02}})}
function begin(modeName){clearInterval(timerId);mode=modeName;duration=mode==='practice'?180:300;startingCash=mode==='practice'?1000000:100000;theme=MARKET_THEMES[Math.floor(Date.now()/60000)%MARKET_THEMES.length];stocks=mode==='practice'?createPracticeStocks():createMainStocks();cash=startingCash;seconds=duration;tick=0;transactions=[];searchText='';selectedId=stocks[0]?stocks[0].id:'';el.search.value='';el.start.classList.add('hidden');el.result.classList.add('hidden');el.game.classList.remove('hidden');el.modeLabel.textContent=mode==='practice'?'練習用 / 架空企業5社 / 3分':'本番用 / 実在企業130社以上 / 5分';el.chartTitle.textContent='株価チャート';el.hint.innerHTML=mode==='practice'?'表示されるのは短期の価格変動だけです。<br><strong>次の1秒を当てる材料はありません。</strong>':'ニュースと企業・業種の関係を読みながら売買しよう。';render();timerId=setInterval(nextTick,1000)}
function visibleStocks(){const q=searchText.trim().toLowerCase();return q?stocks.filter(s=>`${s.name} ${s.code} ${s.sector}`.toLowerCase().includes(q)):stocks}
function renderList(){const list=visibleStocks();el.list.innerHTML=list.length?list.map(s=>{const d=s.price-s.open,up=d>=0;return `<button type="button" class="stock-row ${s.id===selectedId?'active':''}" data-stock="${s.id}"><span><b class="stock-name">${s.name}</b><small class="stock-sector">${s.code} / ${s.sector}</small></span><span><b class="stock-price">${money(s.price)}</b><small class="stock-move ${up?'price-up':'price-down'}">${up?'+':''}${pct(d,s.open).toFixed(2)}%</small></span></button>`}).join(''):'<p class="empty-history">該当する銘柄がありません。</p>';el.list.querySelectorAll('[data-stock]').forEach(b=>b.addEventListener('click',()=>{selectedId=b.dataset.stock;render()}))}
function smoothPath(points){if(points.length<2)return '';let d=`M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;for(let i=0;i<points.length-1;i++){const p0=points[i-1]||points[i],p1=points[i],p2=points[i+1],p3=points[i+2]||p2;d+=` C ${(p1.x+(p2.x-p0.x)/6).toFixed(1)} ${(p1.y+(p2.y-p0.y)/6).toFixed(1)}, ${(p2.x-(p3.x-p1.x)/6).toFixed(1)} ${(p2.y-(p3.y-p1.y)/6).toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`}return d}
function renderChart(s){const d=s.history,W=640,H=250,p={l:38,r:16,t:18,b:32},min=Math.min(...d),max=Math.max(...d),range=Math.max(max-min,1),low=min-range*.18,high=max+range*.18,x=i=>p.l+i*(W-p.l-p.r)/(d.length-1),y=v=>p.t+(high-v)*(H-p.t-p.b)/(high-low),points=d.map((v,i)=>({x:x(i),y:y(v)})),line=smoothPath(points),end=last(points),area=`${line} L ${end.x.toFixed(1)} ${H-p.b} L ${points[0].x.toFixed(1)} ${H-p.b} Z`,down=last(d)<d[0],color=down?'#2f72b7':'#c4403d',levels=[0,.5,1].map(k=>{const value=high-(high-low)*k,yy=y(value);return `<line x1="${p.l}" y1="${yy.toFixed(1)}" x2="${W-p.r}" y2="${yy.toFixed(1)}" stroke="#e6ebf2" stroke-dasharray="3 5"/><text x="2" y="${(yy+4).toFixed(1)}" fill="#8a96a9" font-size="11">${money(value)}</text>`}).join(''),start=d[0],now=last(d),delta=now-start;el.chart.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="${color}" stop-opacity=".20"/><stop offset="100%" stop-color="${color}" stop-opacity=".02"/></linearGradient></defs>${levels}<path d="${area}" fill="url(#chartFill)"/><path d="${line}" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><line x1="${p.l}" y1="${y(start).toFixed(1)}" x2="${W-p.r}" y2="${y(start).toFixed(1)}" stroke="#aab5c5" stroke-dasharray="5 5"/><circle cx="${end.x.toFixed(1)}" cy="${end.y.toFixed(1)}" r="5" fill="${color}" stroke="#fff" stroke-width="3"/><rect x="${W-118}" y="12" width="102" height="24" rx="6" fill="#fff" stroke="#dfe6ef"/><text x="${W-110}" y="28" fill="${color}" font-size="12" font-weight="700">${delta>=0?'+':''}${pct(delta,start).toFixed(2)}%</text><text x="${p.l}" y="${H-8}" fill="#8b97a8" font-size="11">40秒前</text><text x="${W-p.r-25}" y="${H-8}" fill="#8b97a8" font-size="11">現在</text></svg>`}
function renderQuote(){const s=selected();if(!s)return;const d=s.price-s.open,up=d>=0;el.sector.textContent=s.sector;el.name.textContent=s.name;el.code.textContent=s.code;el.price.textContent=money(s.price);el.change.textContent=`${d>=0?'+':''}${money(d)} (${up?'+':''}${pct(d,s.open).toFixed(2)}%)`;el.change.className=up?'price-up':'price-down';el.holding.textContent=`保有 ${s.holdings}株`;renderChart(s)}
function renderNews(){if(mode==='practice'){el.news.innerHTML='<p class="empty-history">本番用でニュースが表示されます。</p>';el.newsCount.textContent='';return}const visible=theme.news.filter(n=>n.at<=tick);el.newsCount.textContent=`${visible.length}件`;el.news.innerHTML=visible.slice().reverse().map((n,i)=>`<article class="news-item ${i===0?'is-latest':''}"><div><span class="news-tag">${n.tag}</span><time>${timeText(Math.max(0,300-n.at)).slice(0,2)}:${String(n.at%60).padStart(2,'0')}</time></div><p>${n.title}</p></article>`).join('')||'<p class="empty-history">ニュースを待っています。</p>'}
function renderAssets(){const value=stockValue(),total=totalAsset(),gain=profit(),rate=pct(gain,startingCash);el.cash.textContent=money(cash);el.holdings.textContent=`${stocks.filter(s=>s.holdings>0).length}銘柄`;el.stockValue.textContent=money(value);el.total.textContent=money(total);el.profit.textContent=`${gain>0?'+':gain<0?'-':'±'}${money(Math.abs(gain))}`;el.rate.textContent=`${rate>=0?'+':''}${rate.toFixed(2)}%`;el.profitCard.className=`profit-card ${gain>0?'positive':gain<0?'negative':'neutral'}`}
function renderHistory(){el.history.innerHTML=transactions.length?transactions.slice(0,12).map(t=>`<div class="history-item ${t.kind}"><div class="history-main"><span>${t.kind==='buy'?'購入':'売却'} ${t.name}</span><span>${money(t.total)}</span></div><div class="history-sub">${t.qty}株 × ${money(t.price)} / TICK ${t.tick}</div></div>`).join(''):'<p class="empty-history">まだ取引はありません。</p>'}
function render(){el.timer.textContent=timeText(seconds);el.tick.textContent=`TICK ${tick}`;renderList();renderQuote();renderNews();renderAssets();renderHistory()}
function nextTick(){tick++;stocks.forEach(s=>{if(mode==='main')s.price=s.replay[Math.min(tick,s.replay.length-1)];else s.price=Math.max(30,Math.round(s.price*(1+(Math.random()-.5)*2*s.vol+(Math.random()-.5)*.004)));s.history.push(s.price);if(s.history.length>40)s.history.shift()});seconds--;render();if(seconds<=0)finish()}
function trade(kind){const s=selected(),qty=Math.max(1,Math.floor(Number(el.qty.value)||0)),total=s.price*qty;if(kind==='buy'){if(total>cash){el.message.textContent='現金残高が足りません。株数を減らしてください。';el.message.style.color='#bc3430';return}cash-=total;s.holdings+=qty}else{if(qty>s.holdings){el.message.textContent=`売却できるのは${s.holdings}株までです。`;el.message.style.color='#bc3430';return}cash+=total;s.holdings-=qty}transactions.unshift({kind,name:s.name,qty,price:s.price,total,tick});el.message.textContent=`${s.name}を${qty}株${kind==='buy'?'購入':'売却'}しました。`;el.message.style.color='#287b57';render()}
function finish(){clearInterval(timerId);el.game.classList.add('hidden');el.result.classList.remove('hidden');const total=totalAsset(),gain=profit(),rate=pct(gain,startingCash);el.resultAsset.textContent=money(total);el.resultProfit.textContent=`${gain>0?'+':gain<0?'-':'±'}${money(Math.abs(gain))}（${rate>=0?'+':''}${rate.toFixed(2)}%）`;el.resultProfit.className=`result-profit ${gain>0?'positive':gain<0?'negative':'neutral'}`;el.resultStats.innerHTML=`<div><span>売買回数</span><strong>${transactions.length}回</strong></div><div><span>保有銘柄数</span><strong>${stocks.filter(s=>s.holdings>0).length}銘柄</strong></div><div><span>開始資金</span><strong>${money(startingCash)}</strong></div>`}
el.practice.addEventListener('click',()=>begin('practice'));el.main.addEventListener('click',()=>begin('main'));el.buy.addEventListener('click',()=>trade('buy'));el.sell.addEventListener('click',()=>trade('sell'));el.restart.addEventListener('click',()=>{el.result.classList.add('hidden');el.start.classList.remove('hidden')});el.search.addEventListener('input',e=>{searchText=e.target.value;renderList()});document.querySelectorAll('[data-qty]').forEach(b=>b.addEventListener('click',()=>{el.qty.value=b.dataset.qty});
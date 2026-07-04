const PRACTICE=[
  {id:'NLC',code:'NLC',name:'ネオリンク',sector:'テクノロジー',price:1240,vol:.018},
  {id:'MRT',code:'MRT',name:'みらい電機',sector:'電力・インフラ',price:870,vol:.012},
  {id:'SFO',code:'SFO',name:'サンフーズ',sector:'食品',price:640,vol:.015},
  {id:'BTA',code:'BTA',name:'バンクタス',sector:'金融',price:1520,vol:.016},
  {id:'KRT',code:'KRT',name:'キラテック',sector:'製造業',price:980,vol:.024}
];

let mode='practice';
let startingCash=1000000;
let duration=180;
let stocks=[];
let selectedId='';
let cash=0;
let seconds=0;
let tick=0;
let timerId=null;
let transactions=[];
let searchText='';

const $=id=>document.getElementById(id);
const el={
 start:$('startScreen'),loading:$('loadingScreen'),game:$('gameScreen'),result:$('resultScreen'),
 practice:$('practiceStart'),main:$('mainStart'),loadingText:$('loadingText'),loadingBar:$('loadingBar'),
 modeLabel:$('gameModeLabel'),timer:$('timer'),tick:$('marketTick'),search:$('stockSearch'),list:$('stockList'),
 hint:$('hintText'),chartTitle:$('chartTitle'),sector:$('selectedSector'),name:$('selectedName'),code:$('selectedCode'),price:$('selectedPrice'),change:$('selectedChange'),chart:$('chart'),holding:$('holdingLabel'),qty:$('quantityInput'),buy:$('buyButton'),sell:$('sellButton'),message:$('orderMessage'),
 cash:$('cash'),holdings:$('holdingCount'),stockValue:$('stockValue'),total:$('totalAsset'),profit:$('profit'),rate:$('profitRate'),profitCard:$('profitCard'),history:$('history'),
 resultAsset:$('resultAsset'),resultProfit:$('resultProfit'),resultStats:$('resultStats'),restart:$('restartButton')
};

const money=v=>new Intl.NumberFormat('ja-JP',{style:'currency',currency:'JPY',maximumFractionDigits:0}).format(Math.round(v));
const timeText=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
const pct=(a,b)=>b?100*a/b:0;
const selected=()=>stocks.find(s=>s.id===selectedId);
const stockValue=()=>stocks.reduce((sum,s)=>sum+s.price*s.holdings,0);
const totalAsset=()=>cash+stockValue();
const profit=()=>totalAsset()-startingCash;

function seedNumber(text){
 let n=0;
 for(const ch of String(text)) n=(n*31+ch.charCodeAt(0))>>>0;
 return n;
}

function createPracticeStocks(){
 return PRACTICE.map(s=>({...s,open:s.price,holdings:0,history:Array(40).fill(s.price),replay:null}));
}

function createMainStocks(){
 const companies=window.REAL_COMPANIES||[];
 return companies.map((c,index)=>{
   const seed=seedNumber(c.code);
   const price=Math.max(120,Math.round(260+(seed%7300)));
   const drop=.035+((seed>>>3)%110)/1000;
   const rebound=.008+((seed>>>7)%45)/1000;
   const path=[];
   for(let i=0;i<=300;i++){
     const t=i/300;
     let factor;
     if(t<.16){factor=1-(drop*.35)*(t/.16)}
     else if(t<.58){factor=1-drop*(.35+.65*((t-.16)/.42))}
     else{factor=1-drop+rebound*((t-.58)/.42)}
     const wobble=Math.sin(i*1.7+(seed%10))*0.004+Math.sin(i*.31)*0.002;
     path.push(Math.max(10,Math.round(price*(factor+wobble))));
   }
   path[0]=price;
   return {id:c.code,code:c.code,name:c.name,sector:c.sector,price,open:price,holdings:0,history:Array(40).fill(price),replay:path,vol:.02};
 });
}

function begin(modeName){
 clearInterval(timerId);
 mode=modeName;
 duration=mode==='practice'?180:300;
 startingCash=mode==='practice'?1000000:100000;
 stocks=mode==='practice'?createPracticeStocks():createMainStocks();
 cash=startingCash;
 seconds=duration;
 tick=0;
 transactions=[];
 searchText='';
 selectedId=stocks[0]?.id||'';
 el.search.value='';
 el.start.classList.add('hidden');
 el.loading.classList.add('hidden');
 el.result.classList.add('hidden');
 el.game.classList.remove('hidden');
 el.modeLabel.textContent=mode==='practice'?'練習用 / 架空企業5社 / 3分':'本番用 / 実在企業130社以上 / 5分';
 el.chartTitle.textContent=mode==='practice'?'1秒足チャート':'急落シナリオ・1秒チャート';
 el.hint.innerHTML=mode==='practice'
  ?'表示されるのは短期の価格変動だけです。<br><strong>次の1秒を当てる材料はありません。</strong>'
  :'実在企業名を使った授業用の急落シナリオです。<br><strong>短期の値動きは読みにくく、結果は偶然にも左右されます。</strong>';
 render();
 timerId=setInterval(nextTick,1000);
}

function visibleStocks(){
 const q=searchText.trim().toLowerCase();
 return q?stocks.filter(s=>`${s.name} ${s.code} ${s.sector}`.toLowerCase().includes(q)):stocks;
}

function renderList(){
 const list=visibleStocks();
 el.list.innerHTML=list.length?list.map(s=>{
  const diff=s.price-s.open;
  const up=diff>=0;
  return `<button type="button" class="stock-row ${s.id===selectedId?'active':''}" data-stock="${s.id}"><span><b class="stock-name">${s.name}</b><small class="stock-sector">${s.code} / ${s.sector}</small></span><span><b class="stock-price">${money(s.price)}</b><small class="stock-move ${up?'price-up':'price-down'}">${up?'+':''}${pct(diff,s.open).toFixed(2)}%</small></span></button>`;
 }).join(''):'<p class="empty-history">該当する銘柄がありません。</p>';
 el.list.querySelectorAll('[data-stock]').forEach(b=>b.addEventListener('click',()=>{selectedId=b.dataset.stock;render();}));
}

function renderChart(s){
 const d=s.history,W=640,H=250,p={l:14,r:14,t:12,b:26};
 const min=Math.min(...d),max=Math.max(...d),range=Math.max(max-min,1),low=min-range*.15,high=max+range*.15;
 const x=i=>p.l+i*(W-p.l-p.r)/(d.length-1);
 const y=v=>p.t+(high-v)*(H-p.t-p.b)/(high-low);
 const line=d.map((v,i)=>`${i?'L':'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
 const up=d.at(-1)>=d[0];
 const color=up?'#c43d3b':'#2871b7';
 el.chart.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="M${p.l},${H-p.b} H${W-p.r}" stroke="#e2e8f0"/><path d="${line}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${x(d.length-1)}" cy="${y(d.at(-1))}" r="4" fill="${color}"/><text x="${p.l}" y="${H-6}" fill="#8b97a8" font-size="11">40秒前</text><text x="${W-p.r-28}" y="${H-6}" fill="#8b97a8" font-size="11">現在</text></svg>`;
}

function renderQuote(){
 const s=selected();
 if(!s)return;
 const diff=s.price-s.open;
 const up=diff>=0;
 el.sector.textContent=s.sector;
 el.name.textContent=s.name;
 el.code.textContent=s.code;
 el.price.textContent=money(s.price);
 el.change.textContent=`${diff>=0?'+':''}${money(diff)} (${up?'+':''}${pct(diff,s.open).toFixed(2)}%)`;
 el.change.className=up?'price-up':'price-down';
 el.holding.textContent=`保有 ${s.holdings}株`;
 renderChart(s);
}

function renderAssets(){
 const value=stockValue();
 const total=totalAsset();
 const gain=profit();
 const rate=pct(gain,startingCash);
 el.cash.textContent=money(cash);
 el.holdings.textContent=`${stocks.filter(s=>s.holdings>0).length}銘柄`;
 el.stockValue.textContent=money(value);
 el.total.textContent=money(total);
 el.profit.textContent=`${gain>0?'+':gain<0?'-':'±'}${money(Math.abs(gain))}`;
 el.rate.textContent=`${rate>=0?'+':''}${rate.toFixed(2)}%`;
 el.profitCard.className=`profit-card ${gain>0?'positive':gain<0?'negative':'neutral'}`;
}

function renderHistory(){
 el.history.innerHTML=transactions.length?transactions.slice(0,12).map(t=>`<div class="history-item ${t.kind}"><div class="history-main"><span>${t.kind==='buy'?'購入':'売却'} ${t.name}</span><span>${money(t.total)}</span></div><div class="history-sub">${t.qty}株 × ${money(t.price)} / TICK ${t.tick}</div></div>`).join(''):'<p class="empty-history">まだ取引はありません。</p>';
}

function render(){
 el.timer.textContent=timeText(seconds);
 el.tick.textContent=`TICK ${tick}`;
 renderList();renderQuote();renderAssets();renderHistory();
}

function nextTick(){
 tick++;
 stocks.forEach(s=>{
  if(mode==='main') s.price=s.replay[Math.min(tick,s.replay.length-1)];
  else s.price=Math.max(30,Math.round(s.price*(1+(Math.random()-.5)*2*s.vol+(Math.random()-.5)*.004)));
  s.history.push(s.price);
  if(s.history.length>40)s.history.shift();
 });
 seconds--;
 render();
 if(seconds<=0)finish();
}

function trade(kind){
 const s=selected();
 const qty=Math.max(1,Math.floor(Number(el.qty.value)||0));
 const total=s.price*qty;
 if(kind==='buy'){
  if(total>cash){el.message.textContent='現金残高が足りません。株数を減らしてください。';el.message.style.color='#bc3430';return;}
  cash-=total;s.holdings+=qty;
 }else{
  if(qty>s.holdings){el.message.textContent=`売却できるのは${s.holdings}株までです。`;el.message.style.color='#bc3430';return;}
  cash+=total;s.holdings-=qty;
 }
 transactions.unshift({kind,name:s.name,qty,price:s.price,total,tick});
 el.message.textContent=`${s.name}を${qty}株${kind==='buy'?'購入':'売却'}しました。`;
 el.message.style.color='#287b57';
 render();
}

function finish(){
 clearInterval(timerId);
 el.game.classList.add('hidden');
 el.result.classList.remove('hidden');
 const total=totalAsset();
 const gain=profit();
 const rate=pct(gain,startingCash);
 el.resultAsset.textContent=money(total);
 el.resultProfit.textContent=`${gain>0?'+':gain<0?'-':'±'}${money(Math.abs(gain))}（${rate>=0?'+':''}${rate.toFixed(2)}%）`;
 el.resultProfit.className=`result-profit ${gain>0?'positive':gain<0?'negative':'neutral'}`;
 el.resultStats.innerHTML=`<div><span>売買回数</span><strong>${transactions.length}回</strong></div><div><span>保有銘柄数</span><strong>${stocks.filter(s=>s.holdings>0).length}銘柄</strong></div><div><span>開始資金</span><strong>${money(startingCash)}</strong></div>`;
}

el.practice.addEventListener('click',()=>begin('practice'));
el.main.addEventListener('click',()=>begin('main'));
el.buy.addEventListener('click',()=>trade('buy'));
el.sell.addEventListener('click',()=>trade('sell'));
el.restart.addEventListener('click',()=>{el.result.classList.add('hidden');el.start.classList.remove('hidden');});
el.search.addEventListener('input',e=>{searchText=e.target.value;renderList();});
document.querySelectorAll('[data-qty]').forEach(b=>b.addEventListener('click',()=>{el.qty.value=b.dataset.qty;}));

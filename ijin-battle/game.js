(function(){
  'use strict';
  var cfg = window.GAME_CONFIG;
  var role = '';
  var teacherOK = sessionStorage.getItem('teacherOK') === '1';
  var me = localStorage.getItem(cfg.studentKey) || '';
  var cards = cfg.cards.map(function(c){return {id:c[0],type:c[1],name:c[2],kana:c[3],int:c[4],atk:c[5],def:c[6],desc:c[7],rarity:c[8],img:'images/'+c[0]+'.png'};});
  var deck = [];
  cards.forEach(function(c){var n=c.type==='great'?2:4; for(var i=0;i<n;i++){var x=Object.assign({},c); x.id=c.id+'_'+i; x.base=c.id; deck.push(x);}});
  var events = cfg.events.map(function(e){return {id:e[0],title:e[1],kana:e[2],ab:e[3],tie:e[4],kind:e[5],text:e[6]};});
  function $(id){return document.getElementById(id)}
  function ruby(n,k){return k?'<ruby>'+n+'<rt>'+k+'</rt></ruby>':n}
  function ab(x){return x==='int'?'知力':x==='atk'?'攻撃力':'防御力'}
  function stars(n){return '★★★☆☆☆'.slice(3-n,6-n)}
  function card(id){for(var i=0;i<deck.length;i++){if(deck[i].id===id)return deck[i]}return null}
  function ev(id){for(var i=0;i<events.length;i++){if(events[i].id===id)return events[i]}return events[0]}
  function total(c){return c.int+c.atk+c.def}
  function getData(){var d=null; try{d=JSON.parse(localStorage.getItem(cfg.storageKey)||'null')}catch(e){} return d || {game:{turn:1,max:5,event:events[0].id,accept:false,phase:'lobby',roomCount:1},p:{},choices:{},scores:{}}}
  function save(d){localStorage.setItem(cfg.storageKey,JSON.stringify(d));render()}
  function show(id){['home','login','teacher','student'].forEach(function(x){$(x).classList.add('hide')});$(id).classList.remove('hide')}
  function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
  function one(a){return a[Math.floor(Math.random()*a.length)]}
  function validRooms(w,p){w=Number(w)||1;if(w<=1||p<6)return 1;return Math.max(1,Math.min(w,10,Math.floor(p/3)))}
  function deal(){var g=deck.filter(function(c){return c.type==='great'}), m=deck.filter(function(c){return c.type==='common'}), out=[one(g),one(m)];shuffle(deck).forEach(function(c){if(out.length<5 && !out.some(function(x){return x.base===c.base}))out.push(c)});return shuffle(out).map(function(c){return c.id})}
  function assign(d){var list=Object.entries(d.p).sort(function(a,b){return a[1].no-b[1].no});var n=validRooms(d.game.roomCount,list.length);d.game.roomCount=n;list.forEach(function(item,i){item[1].room=(i%n)+1})}
  function initGame(){var d=getData();d.game={turn:1,max:5,event:events[0].id,accept:false,phase:'lobby',roomCount:validRooms($('roomCount').value,Object.keys(d.p).length)};d.choices={};d.scores={};Object.keys(d.p).forEach(function(k){d.p[k].used=[]});assign(d);save(d)}
  function join(){var d=getData(), used={};Object.keys(d.p).forEach(function(k){used[d.p[k].no]=true});var av=[];for(var i=1;i<=40;i++){if(!used[i])av.push(i)}if(!av.length){alert('参加上限です');return}var k='p'+Date.now()+Math.random().toString(36).slice(2,7);d.p[k]={no:one(av),room:1,hand:deal(),used:[]};me=k;localStorage.setItem(cfg.studentKey,k);assign(d);save(d)}
  function value(c,e,op){var v=c[e.ab];if(e.kind==='gekokujo'&&c.type==='common'&&op&&op.type==='great')v+=6;if(e.kind==='revolution'&&total(c)<=9)v+=5;return v}
  function cmp(a,b,e){var av=value(a,e,b),bv=value(b,e,a);if(e.kind==='low'){if(av<bv)return 1;if(av>bv)return -1}else{if(av>bv)return 1;if(av<bv)return -1}if(a[e.tie]>b[e.tie])return 1;if(a[e.tie]<b[e.tie])return -1;return 0}
  function choose(id){var d=getData(), g=d.game, p=d.p[me];if(!p||!g.accept||p.used.indexOf(id)>=0)return;var tk='t'+g.turn;d.choices[tk]=d.choices[tk]||{};d.choices[tk][me]={id:id};save(d)}
  function battle(){var d=getData(), g=d.game, tk='t'+g.turn, ch=d.choices[tk]||{}, ps=Object.entries(d.p), e=ev(g.event);ps.forEach(function(item){var k=item[0];d.scores[k]=d.scores[k]||{total:0,rounds:{}}});ps.forEach(function(item){var k=item[0],p=item[1],c=ch[k],pt=0,W=0,D=0,L=0;if(c){var mine=card(c.id);ps.forEach(function(o){var ok=o[0];if(ok===k)return;var oc=ch[ok];if(!oc){W++;pt+=3;return}var r=cmp(mine,card(oc.id),e);if(r>0){W++;pt+=3}else if(r<0){L++}else{D++;pt++}});if(p.used.indexOf(c.id)<0)p.used.push(c.id)}d.scores[k].total+=pt;d.scores[k].rounds[tk]={point:pt,W:W,D:D,L:L}});g.accept=false;g.phase='result';save(d)}
  function rankRows(d){return Object.entries(d.p).map(function(item){var k=item[0],p=item[1];return [k,p.no,p.room,(d.scores[k]&&d.scores[k].total)||0,(p.used||[]).length]}).sort(function(a,b){return b[3]-a[3]||a[1]-b[1]})}
  function renderEvent(e,el){el.innerHTML='<div class="event"><h3>'+ruby(e.title,e.kana)+'</h3><p>'+e.text+'</p><span class="pill">判定：'+ab(e.ab)+'</span><span class="pill">同点：'+ab(e.tie)+'</span></div>'}
  function renderCard(c){return '<div class="card" data-id="'+c.id+'"><div class="photo"><img src="'+c.img+'" alt="'+c.name+'"></div><div class="body"><span class="type '+(c.type==='common'?'c':'')+'">'+(c.type==='great'?'偉人':'一般')+'</span><span class="rarity r'+c.rarity+'">'+stars(c.rarity)+'</span><div class="name">'+ruby(c.name,c.kana)+'</div><div class="stats"><div class="stat">知力<br>'+c.int+'</div><div class="stat">攻撃<br>'+c.atk+'</div><div class="stat">防御<br>'+c.def+'</div></div><div class="desc">'+c.desc+'</div></div></div>'}
  function finalHtml(d){var rows=rankRows(d);if(d.game.turn<5||d.game.phase!=='result'||!rows.length)return '';return '<div class="finale"><h3>最終結果</h3><p><b>優勝：NO.'+rows[0][1]+'</b>　'+rows[0][3]+'点</p><p>称号：時代を動かした覇者</p></div>'}
  function render(){var d=getData(), g=d.game, e=ev(g.event), plist=Object.entries(d.p).map(function(x){x[1].key=x[0];return x[1]}).sort(function(a,b){return a.no-b.no});$('badge').textContent=role==='student'&&me&&d.p[me]?'NO.'+d.p[me].no+' ROOM '+d.p[me].room:cfg.label;if(role==='teacher'){$('eventSel').innerHTML=events.map(function(x){return '<option value="'+x.id+'" '+(x.id===g.event?'selected':'')+'>'+x.title+' / '+ab(x.ab)+'</option>'}).join('');renderEvent(e,$('eventBox'));$('finalBox').innerHTML=finalHtml(d);var tk='t'+g.turn,ch=d.choices[tk]||{},miss=plist.filter(function(p){return !ch[p.key]}).map(function(p){return 'NO.'+p.no});$('status').innerHTML='ターン：<b>'+g.turn+'/'+g.max+'</b><br>状態：<b>'+g.phase+'</b><br>受付：<b>'+(g.accept?'受付中':'停止中')+'</b><br>参加：<b>'+plist.length+'/40</b><br>ルーム数：<b>'+g.roomCount+'</b>';$('choices').innerHTML='選択済み：<b>'+(plist.length-miss.length)+'/'+plist.length+'</b><br>未選択：'+(miss.join('、')||'なし');var counts={};for(var i=1;i<=g.roomCount;i++)counts[i]=0;plist.forEach(function(p){counts[p.room]=(counts[p.room]||0)+1});$('rooms').innerHTML=Object.keys(counts).map(function(r){return '<div class="roomBox">ROOM '+r+'<br><span style="font-size:28px">'+counts[r]+'</span>人</div>'}).join('');$('rank').innerHTML='<table><tr><th>順位</th><th>番号</th><th>ルーム</th><th>点</th><th>使用</th></tr>'+rankRows(d).map(function(r,i){return '<tr><td>'+(i+1)+'</td><td>NO.'+r[1]+'</td><td>ROOM '+r[2]+'</td><td>'+r[3]+'</td><td>'+r[4]+'/5</td></tr>'}).join('')+'</table>'}if(role==='student'){var p=d.p[me];$('joinBox').classList.toggle('hide',!!p);$('playBox').classList.toggle('hide',!p);if(!p)return;renderEvent(e,$('sEvent'));$('sFinal').innerHTML=finalHtml(d);var t='t'+g.turn,already=d.choices[t]&&d.choices[t][me],left=5-p.used.length;$('sMsg').innerHTML=g.phase==='result'&&g.turn>=5?'ゲーム終了です。':already?'選択済みです。先生を待ってください。':g.accept?'使うカードを1枚選んでください。残り'+left+'枚です。':'先生の操作を待っています。';$('remain').innerHTML=p.hand.map(function(id,i){return '<span class="dot '+(p.used.indexOf(id)>=0?'used':'')+'">'+(i+1)+'</span>'}).join('');$('myCards').innerHTML=p.hand.filter(function(id){return p.used.indexOf(id)<0}).map(function(id){return renderCard(card(id))}).join('');var sc=d.scores[me]||{total:0,rounds:{}},r=sc.rounds[t];$('myResult').innerHTML='合計点：<b>'+(sc.total||0)+'点</b><br>使用済み：<b>'+p.used.length+'/5枚</b>'+(r?'<hr>今回：'+r.point+'点<br>勝ち:'+r.W+' 引き分け:'+r.D+' 負け:'+r.L:'')}}
  function boot(){
    $('teacherBtn').addEventListener('click',function(){if(teacherOK){role='teacher';show('teacher');render()}else{show('login')}});
    $('studentBtn').addEventListener('click',function(){role='student';show('student');render()});
    $('loginBtn').addEventListener('click',function(){if($('pass').value==='0122'){teacherOK=true;sessionStorage.setItem('teacherOK','1');role='teacher';show('teacher');render()}else{$('passMsg').textContent='パスワードが違います。'}});
    $('startBtn').addEventListener('click',initGame);
    $('roomBtn').addEventListener('click',function(){var d=getData();d.game.roomCount=validRooms($('roomCount').value,Object.keys(d.p).length);assign(d);save(d)});
    $('eventBtn').addEventListener('click',function(){var d=getData();d.game.event=$('eventSel').value;d.game.phase='event';d.game.accept=false;save(d)});
    $('openBtn').addEventListener('click',function(){var d=getData();d.game.accept=true;d.game.phase='choosing';save(d)});
    $('closeBtn').addEventListener('click',function(){var d=getData();d.game.accept=false;save(d)});
    $('battleBtn').addEventListener('click',battle);
    $('nextBtn').addEventListener('click',function(){var d=getData();if(d.game.turn<d.game.max)d.game.turn++;d.game.accept=false;d.game.phase='event';save(d)});
    $('resetBtn').addEventListener('click',function(){localStorage.removeItem(cfg.storageKey);localStorage.removeItem(cfg.studentKey);me='';render()});
    $('joinBtn').addEventListener('click',join);
    $('myCards').addEventListener('click',function(e){var el=e.target.closest('.card');if(el)choose(el.getAttribute('data-id'))});
    render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
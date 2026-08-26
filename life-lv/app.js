const KEY='life-lv-state-v1';
const statMeta={work:['仕事','💼'],money:['お金','💰'],knowledge:['知識','🧠'],health:['健康','🏃'],family:['家族','🏠'],hobby:['趣味','🎨']};
const questPool=[
{id:'read',icon:'📚',title:'30分、本を読む',desc:'知識を積み上げる',xp:30,stat:'knowledge',gain:3},
{id:'walk',icon:'👟',title:'8,000歩、歩く',desc:'身体を動かす',xp:40,stat:'health',gain:3},
{id:'family',icon:'🏠',title:'家族と1時間過ごす',desc:'画面を置いて向き合う',xp:50,stat:'family',gain:4},
{id:'save',icon:'🪙',title:'無駄遣いを1つやめる',desc:'小さな判断を資産に変える',xp:25,stat:'money',gain:3},
{id:'deepwork',icon:'⚡️',title:'集中して45分働く',desc:'通知を切って1つ終わらせる',xp:45,stat:'work',gain:4},
{id:'create',icon:'✏️',title:'何かを1つ作る',desc:'完成させることを優先する',xp:45,stat:'hobby',gain:4},
{id:'study',icon:'🧩',title:'知らないことを1つ学ぶ',desc:'10分でも調べ切る',xp:30,stat:'knowledge',gain:3},
{id:'stretch',icon:'🧘',title:'10分ストレッチ',desc:'身体を整える',xp:20,stat:'health',gain:2},
{id:'plan',icon:'🗺️',title:'明日の優先順位を3つ決める',desc:'迷いを先に減らす',xp:25,stat:'work',gain:2},
{id:'photo',icon:'📷',title:'今日を1枚残す',desc:'あとで見返したい瞬間を保存',xp:20,stat:'family',gain:2}
];
const achievements=[
{id:'first',badge:'⚔️',title:'はじまりの一歩',desc:'初めてクエストを達成',test:s=>s.clears>=1},
{id:'ten',badge:'🔥',title:'継続の火種',desc:'クエストを10回達成',test:s=>s.clears>=10},
{id:'lv5',badge:'✦',title:'LEVEL 5',desc:'プレイヤーレベル5に到達',test:s=>levelOf(s.xp)>=5},
{id:'balanced',badge:'◈',title:'バランサー',desc:'全ステータスをLV.3以上にする',test:s=>Object.values(s.stats).every(v=>v>=300)},
{id:'hundred',badge:'🏆',title:'百戦錬磨',desc:'クエストを100回達成',test:s=>s.clears>=100},
{id:'streak7',badge:'🌙',title:'一週間の証明',desc:'7日連続でクエスト達成',test:s=>s.streak>=7}
];
function baseState(){return{name:'PLAYER',className:'EXPLORER',xp:0,clears:0,stats:{work:0,money:0,knowledge:0,health:0,family:0,hobby:0},completed:{},questDate:'',questIds:[],lastActive:'',streak:0,unlocked:[]}}
let state=load();
function load(){try{return {...baseState(),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return baseState()}}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function dayKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function levelOf(xp){return Math.floor(Math.sqrt(xp/100))+1}
function levelStart(l){return (l-1)*(l-1)*100}
function levelEnd(l){return l*l*100}
function ensureToday(){const today=dayKey();if(state.questDate!==today){state.questDate=today;state.completed={};state.questIds=pickQuests();save()}}
function pickQuests(){const arr=[...questPool].sort(()=>Math.random()-.5);return arr.slice(0,4).map(q=>q.id)}
function currentQuests(){return state.questIds.map(id=>questPool.find(q=>q.id===id)).filter(Boolean)}
function updateStreak(){const today=dayKey();if(state.lastActive===today)return;const y=new Date();y.setDate(y.getDate()-1);const yesterday=dayKey(y);state.streak=state.lastActive===yesterday?state.streak+1:1;state.lastActive=today}
function completeQuest(id){if(state.completed[id])return;const q=questPool.find(x=>x.id===id);if(!q)return;const before=levelOf(state.xp);state.completed[id]=true;state.xp+=q.xp;state.clears++;state.stats[q.stat]+=q.gain*100;updateStreak();unlockAchievements();save();render();toast(`+${q.xp} EXP / ${statMeta[q.stat][0]} +${q.gain}`);const after=levelOf(state.xp);if(after>before)showLevel(after)}
function unlockAchievements(){achievements.forEach(a=>{if(!state.unlocked.includes(a.id)&&a.test(state))state.unlocked.push(a.id)})}
function render(){ensureToday();unlockAchievements();const lv=levelOf(state.xp);const start=levelStart(lv),end=levelEnd(lv),progress=Math.max(0,Math.min(100,(state.xp-start)/(end-start)*100));
qs('playerName').textContent=state.name;qs('playerClass').textContent=`CLASS / ${state.className}`;qs('levelValue').textContent=lv;qs('xpText').textContent=`${state.xp-start} / ${end-start}`;qs('xpBar').style.width=`${progress}%`;qs('xpNext').textContent=`あと${end-state.xp} EXPでLEVEL UP`;qs('streakValue').textContent=state.streak;qs('clearsValue').textContent=state.clears;qs('titlesValue').textContent=state.unlocked.length;
qs('questList').innerHTML=currentQuests().map(q=>`<article class="quest ${state.completed[q.id]?'done':''}"><div class="quest-icon">${q.icon}</div><div><h3>${q.title}</h3><p>${q.desc}</p><div class="reward">+${q.xp} EXP ・ ${statMeta[q.stat][0]} +${q.gain}</div></div><button class="clear-btn" data-quest="${q.id}" ${state.completed[q.id]?'disabled':''}>${state.completed[q.id]?'DONE':'CLEAR'}</button></article>`).join('');
qs('statusGrid').innerHTML=Object.entries(statMeta).map(([key,[name,icon]])=>{const v=state.stats[key]||0,lv=Math.floor(v/100)+1,p=v%100;return `<article class="status-card"><div class="status-top"><div class="status-name">${icon} ${name}</div><div class="status-lv">LV.${lv}</div></div><div class="progress"><i style="width:${p}%"></i></div><p>${p} / 100 to next level</p></article>`}).join('');
qs('achievementList').innerHTML=achievements.map(a=>{const unlocked=state.unlocked.includes(a.id);return `<article class="achievement ${unlocked?'':'locked'}"><span class="badge">${unlocked?a.badge:'◌'}</span>${unlocked?'<span class="tag">UNLOCKED</span>':''}<h3>${a.title}</h3><p>${a.desc}</p></article>`}).join('');
}
function qs(id){return document.getElementById(id)}
function toast(msg){const el=qs('toast');el.textContent=msg;el.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove('show'),1800)}
function showLevel(lv){qs('modalLevel').textContent=lv;qs('levelModal').classList.remove('hidden');if(navigator.vibrate)navigator.vibrate([40,30,70])}
qs('questList').addEventListener('click',e=>{const b=e.target.closest('[data-quest]');if(b)completeQuest(b.dataset.quest)});
qs('shuffleBtn').addEventListener('click',()=>{state.questIds=pickQuests();state.completed={};save();render();toast('今日のクエストを更新しました')});
qs('closeModal').addEventListener('click',()=>qs('levelModal').classList.add('hidden'));
qs('settingsBtn').addEventListener('click',()=>{qs('nameInput').value=state.name;qs('classSelect').value=state.className;qs('settingsPanel').classList.remove('hidden')});
qs('settingsPanel').addEventListener('click',e=>{if(e.target===qs('settingsPanel'))qs('settingsPanel').classList.add('hidden')});
qs('saveSettingsBtn').addEventListener('click',()=>{state.name=qs('nameInput').value.trim()||'PLAYER';state.className=qs('classSelect').value;save();render();qs('settingsPanel').classList.add('hidden');toast('設定を保存しました')});
qs('resetBtn').addEventListener('click',()=>{if(confirm('LIFE Lv.の全データを初期化しますか？')){state=baseState();ensureToday();save();render();qs('settingsPanel').classList.add('hidden')}});
document.querySelectorAll('[data-scroll]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));b.classList.add('active');const id=b.dataset.scroll;if(id==='top')window.scrollTo({top:0,behavior:'smooth'});else qs(id).scrollIntoView({behavior:'smooth',block:'start'})}));
ensureToday();render();
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});

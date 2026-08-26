const KEY='life-lv-state-v2';
const OLD_KEY='life-lv-state-v1';
const statMeta={work:['仕事','💼'],money:['お金','💰'],knowledge:['知識','🧠'],health:['健康','🏃'],family:['家族','🏠'],hobby:['趣味','🎨']};
const classMeta={
EXPLORER:{label:'探索者',bonusText:'全カテゴリ EXP +5%',xp:1.05,stat:null,statBonus:1},
CREATOR:{label:'創作者',bonusText:'趣味ステータス +50%',xp:1,stat:'hobby',statBonus:1.5},
GUARDIAN:{label:'守護者',bonusText:'家族ステータス +50%',xp:1,stat:'family',statBonus:1.5},
CHALLENGER:{label:'挑戦者',bonusText:'仕事ステータス +50%',xp:1,stat:'work',statBonus:1.5},
SCHOLAR:{label:'賢者',bonusText:'知識ステータス +50%',xp:1,stat:'knowledge',statBonus:1.5},
MERCHANT:{label:'商人',bonusText:'お金ステータス +50%',xp:1,stat:'money',statBonus:1.5}
};
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
{id:'custom',badge:'🛠️',title:'自分ルール',desc:'独自クエストを初めて作成',test:s=>s.customQuests.length>=1},
{id:'ten',badge:'🔥',title:'継続の火種',desc:'クエストを10回達成',test:s=>s.clears>=10},
{id:'lv5',badge:'✦',title:'LEVEL 5',desc:'プレイヤーレベル5に到達',test:s=>levelOf(s.xp)>=5},
{id:'balanced',badge:'◈',title:'バランサー',desc:'全ステータスをLV.3以上にする',test:s=>Object.values(s.stats).every(v=>v>=300)},
{id:'hundred',badge:'🏆',title:'百戦錬磨',desc:'クエストを100回達成',test:s=>s.clears>=100},
{id:'streak7',badge:'🌙',title:'一週間の証明',desc:'7日連続でクエスト達成',test:s=>s.streak>=7},
{id:'week300',badge:'📈',title:'伸びてる一週間',desc:'7日間で300 EXP獲得',test:s=>weekData().reduce((a,d)=>a+d.xp,0)>=300}
];
function baseState(){return{name:'PLAYER',className:'EXPLORER',xp:0,clears:0,stats:{work:0,money:0,knowledge:0,health:0,family:0,hobby:0},completed:{},questDate:'',questIds:[],customQuests:[],lastActive:'',streak:0,unlocked:[],history:{}}}
let state=load();
function load(){try{const raw=localStorage.getItem(KEY)||localStorage.getItem(OLD_KEY)||'{}';const parsed=JSON.parse(raw);const base=baseState();return {...base,...parsed,stats:{...base.stats,...(parsed.stats||{})},history:parsed.history||{},customQuests:parsed.customQuests||[]}}catch{return baseState()}}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function dayKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function levelOf(xp){return Math.floor(Math.sqrt(xp/100))+1}
function levelStart(l){return (l-1)*(l-1)*100}
function levelEnd(l){return l*l*100}
function ensureToday(){const today=dayKey();if(state.questDate!==today){state.questDate=today;state.completed={};state.questIds=pickQuests();save()}}
function pickQuests(){const arr=[...questPool].sort(()=>Math.random()-.5);return arr.slice(0,4).map(q=>q.id)}
function allQuests(){return [...questPool,...state.customQuests]}
function currentQuests(){return state.questIds.map(id=>allQuests().find(q=>q.id===id)).filter(Boolean)}
function updateStreak(){const today=dayKey();if(state.lastActive===today)return;const y=new Date();y.setDate(y.getDate()-1);state.streak=state.lastActive===dayKey(y)?state.streak+1:1;state.lastActive=today}
function getClass(){return classMeta[state.className]||classMeta.EXPLORER}
function rewardsFor(q){const c=getClass();const xp=Math.round(q.xp*c.xp);const statGain=Math.round(q.gain*(c.stat===q.stat?c.statBonus:1)*10)/10;return{xp,statGain}}
function recordHistory(xp,stat,gain){const k=dayKey();if(!state.history[k])state.history[k]={xp:0,clears:0,stats:{}};state.history[k].xp+=xp;state.history[k].clears++;state.history[k].stats[stat]=(state.history[k].stats[stat]||0)+gain}
function completeQuest(id){if(state.completed[id])return;const q=allQuests().find(x=>x.id===id);if(!q)return;const before=levelOf(state.xp);const beforeUnlocked=[...state.unlocked];const reward=rewardsFor(q);state.completed[id]=true;state.xp+=reward.xp;state.clears++;state.stats[q.stat]+=Math.round(reward.statGain*100);recordHistory(reward.xp,q.stat,reward.statGain);updateStreak();unlockAchievements();save();render();toast(`+${reward.xp} EXP / ${statMeta[q.stat][0]} +${reward.statGain}`);const after=levelOf(state.xp);if(after>before)showLevel(after);showNewAchievement(beforeUnlocked)}
function unlockAchievements(){achievements.forEach(a=>{if(!state.unlocked.includes(a.id)&&a.test(state))state.unlocked.push(a.id)})}
function showNewAchievement(before){const fresh=state.unlocked.find(id=>!before.includes(id));if(!fresh)return;const a=achievements.find(x=>x.id===fresh);setTimeout(()=>showAchievement(a),afterModalDelay())}
function afterModalDelay(){return qs('levelModal').classList.contains('hidden')?180:900}
function showAchievement(a){if(!a)return;qs('achievementBurst').textContent=a.badge;qs('achievementTitle').textContent=a.title;qs('achievementDesc').textContent=a.desc;qs('achievementModal').classList.remove('hidden');if(navigator.vibrate)navigator.vibrate([25,20,25,20,80])}
function weekData(){const names=['日','月','火','水','木','金','土'];return Array.from({length:7},(_,i)=>{const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-(6-i));const k=dayKey(d);return{key:k,label:names[d.getDay()],xp:state.history[k]?.xp||0,clears:state.history[k]?.clears||0}})}
function renderWeek(){const data=weekData(),max=Math.max(60,...data.map(x=>x.xp)),total=data.reduce((a,d)=>a+d.xp,0),clears=data.reduce((a,d)=>a+d.clears,0);qs('weekTotal').textContent=`${total} EXP`;qs('weeklyChart').innerHTML=data.map((d,i)=>`<div class="bar-col"><div class="bar-value">${d.xp||''}</div><div class="bar-track"><i style="height:${Math.max(d.xp?12:3,d.xp/max*100)}%" class="${i===6?'today-bar':''}"></i></div><span>${d.label}</span></div>`).join('');qs('weeklySummary').innerHTML=`<div><strong>${clears}</strong><span>QUESTS</span></div><div><strong>${total}</strong><span>EXP</span></div><div><strong>${Math.round(total/7)}</strong><span>AVG / DAY</span></div>`}
function render(){ensureToday();unlockAchievements();const lv=levelOf(state.xp);const start=levelStart(lv),end=levelEnd(lv),progress=Math.max(0,Math.min(100,(state.xp-start)/(end-start)*100));
qs('playerName').textContent=state.name;qs('playerClass').textContent=`CLASS / ${state.className}`;qs('classBonus').textContent=getClass().bonusText;qs('levelValue').textContent=lv;qs('xpText').textContent=`${state.xp-start} / ${end-start}`;qs('xpBar').style.width=`${progress}%`;qs('xpNext').textContent=`あと${end-state.xp} EXPでLEVEL UP`;qs('streakValue').textContent=state.streak;qs('clearsValue').textContent=state.clears;qs('titlesValue').textContent=state.unlocked.length;renderWeek();
qs('questList').innerHTML=currentQuests().map(q=>{const r=rewardsFor(q);return `<article class="quest ${state.completed[q.id]?'done':''} ${q.custom?'custom-quest':''}"><div class="quest-icon">${q.icon}</div><div><div class="quest-kicker">${q.custom?'CUSTOM QUEST':'DAILY QUEST'}</div><h3>${escapeHtml(q.title)}</h3><p>${escapeHtml(q.desc)}</p><div class="reward">+${r.xp} EXP ・ ${statMeta[q.stat][0]} +${r.statGain}</div></div><button class="clear-btn" data-quest="${q.id}" ${state.completed[q.id]?'disabled':''}>${state.completed[q.id]?'DONE':'CLEAR'}</button></article>`}).join('');
qs('statusGrid').innerHTML=Object.entries(statMeta).map(([key,[name,icon]])=>{const v=state.stats[key]||0,lv=Math.floor(v/100)+1,p=v%100;const boosted=getClass().stat===key;return `<article class="status-card ${boosted?'boosted':''}"><div class="status-top"><div class="status-name">${icon} ${name}</div><div class="status-lv">LV.${lv}</div></div>${boosted?'<div class="boost-tag">CLASS BONUS</div>':''}<div class="progress"><i style="width:${p}%"></i></div><p>${p} / 100 to next level</p></article>`}).join('');
qs('achievementList').innerHTML=achievements.map(a=>{const unlocked=state.unlocked.includes(a.id);return `<article class="achievement ${unlocked?'':'locked'}"><span class="badge">${unlocked?a.badge:'◌'}</span>${unlocked?'<span class="tag">UNLOCKED</span>':''}<h3>${a.title}</h3><p>${a.desc}</p></article>`}).join('');
}
function escapeHtml(v=''){return v.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function qs(id){return document.getElementById(id)}
function toast(msg){const el=qs('toast');el.textContent=msg;el.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove('show'),1800)}
function showLevel(lv){qs('modalLevel').textContent=lv;qs('levelModal').classList.remove('hidden');if(navigator.vibrate)navigator.vibrate([40,30,70])}
function difficultyReward(v){return v==='easy'?{xp:20,gain:2}:v==='hard'?{xp:60,gain:5}:{xp:35,gain:3}}
function createCustomQuest(){const title=qs('customTitle').value.trim(),desc=qs('customDesc').value.trim()||'自分で決めた一歩を達成する';if(!title){toast('クエスト名を入力してください');return}const reward=difficultyReward(qs('customDifficulty').value);const q={id:`custom-${Date.now()}`,icon:'⚔️',title,desc,xp:reward.xp,stat:qs('customStat').value,gain:reward.gain,custom:true};const before=[...state.unlocked];state.customQuests.push(q);state.questIds.push(q.id);unlockAchievements();save();render();qs('questPanel').classList.add('hidden');qs('customTitle').value='';qs('customDesc').value='';toast('独自クエストを追加しました');showNewAchievement(before)}
function renderClassPreview(){const c=classMeta[qs('classSelect').value]||classMeta.EXPLORER;qs('classPreview').innerHTML=`<strong>${c.label}</strong><span>${c.bonusText}</span>`}
qs('questList').addEventListener('click',e=>{const b=e.target.closest('[data-quest]');if(b)completeQuest(b.dataset.quest)});
qs('shuffleBtn').addEventListener('click',()=>{state.questIds=pickQuests();state.completed={};save();render();toast('今日のクエストを更新しました')});
qs('addQuestBtn').addEventListener('click',()=>qs('questPanel').classList.remove('hidden'));
qs('questPanel').addEventListener('click',e=>{if(e.target===qs('questPanel'))qs('questPanel').classList.add('hidden')});
qs('saveCustomQuestBtn').addEventListener('click',createCustomQuest);
qs('closeModal').addEventListener('click',()=>qs('levelModal').classList.add('hidden'));
qs('closeAchievementModal').addEventListener('click',()=>qs('achievementModal').classList.add('hidden'));
qs('settingsBtn').addEventListener('click',()=>{qs('nameInput').value=state.name;qs('classSelect').value=state.className;renderClassPreview();qs('settingsPanel').classList.remove('hidden')});
qs('classSelect').addEventListener('change',renderClassPreview);
qs('settingsPanel').addEventListener('click',e=>{if(e.target===qs('settingsPanel'))qs('settingsPanel').classList.add('hidden')});
qs('saveSettingsBtn').addEventListener('click',()=>{state.name=qs('nameInput').value.trim()||'PLAYER';state.className=qs('classSelect').value;save();render();qs('settingsPanel').classList.add('hidden');toast('設定を保存しました')});
qs('resetBtn').addEventListener('click',()=>{if(confirm('LIFE Lv.の全データを初期化しますか？')){state=baseState();ensureToday();save();render();qs('settingsPanel').classList.add('hidden')}});
document.querySelectorAll('[data-scroll]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));b.classList.add('active');const id=b.dataset.scroll;if(id==='top')window.scrollTo({top:0,behavior:'smooth'});else qs(id).scrollIntoView({behavior:'smooth',block:'start'})}));
ensureToday();render();save();
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});

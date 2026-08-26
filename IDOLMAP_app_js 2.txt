
const TIER_ORDER=['SSS','SS','S','A+','A','B+','B','C','未評価'];
const HQ44=new Set(["乃木坂46","=LOVE","iLiFE!","櫻坂46","ももいろクローバーZ","超ときめき♡宣伝部","≠ME","日向坂46","のんふぃく！","私立恵比寿中学","≒JOY","いぎなり東北産","夜光性アミューズ","ドレスコード","MEGAFON","iON!","ばってん少女隊","フルコース","ラストシーン","GILTY x GILTY","i-COL","AdamLilith","TENRIN","LADYBABY","chuLa","アキシブproject","パラディーク","Ill","MISS MERCY","テンシンランマン","ナナコロビヤオキ","ZUTTOMOTTO","ハルカエコー","Pastel Closet","RE-GE","パラレルサイダー","ポンコツコンポ","CAL&RES","AMEFURASSHI","ukka","スタプラ研究生","ヒロインズ研究生","ヒロインズ研究生大阪","浪江女子発組合"]);
const REPLACE={'AsIs':'ASP','Palette Parade':'BiTE A SHOCK','きゅるりんってしてみて':'#ババババンビ','Merry BAD TUNE.':'#2i2','NANIMONO':'東京女子流'};
let DATA={groups:[],as_of:''};
let state={tab:'list',q:'',tier:'ALL',faction:'ALL',sort:'power',rank:'power'};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const clean=v=>v===undefined||v===null||v===''?null:v;
const normName=s=>String(s||'').trim().replace(/\s+/g,'').toLowerCase();

function normMember(m){return {...m,name:m?.name||'',status:m?.status||'current',x:clean(m?.x??m?.x_url),instagram:clean(m?.instagram??m?.instagram_url),tiktok:clean(m?.tiktok??m?.tiktok_url),youtube:clean(m?.youtube??m?.youtube_url)}}
function normGroup(g,asof){
  return {...g,
    id:g.id||`g-${normName(g.name)}`,name:g.name||'',faction:clean(g.faction)||clean(g.project)||'独立/その他',
    debut_date:clean(g.debut_date),major_debut_date:clean(g.major_debut_date),
    official_hp:clean(g.official_hp??g.official_url),x:clean(g.x??g.x_url),instagram:clean(g.instagram??g.instagram_url),
    tiktok:clean(g.tiktok??g.tiktok_url),youtube:clean(g.youtube??g.youtube_url),agency:clean(g.agency),project:clean(g.project),
    label:clean(g.label),parent:clean(g.parent),live_scale:clean(g.live_scale??g.venue),category:clean(g.category),status:clean(g.status),
    members:(g.members||[]).map(normMember),power:typeof g.power==='number'?g.power:null,
    growth:typeof g.growth==='number'?g.growth:(typeof g.trend==='number'?g.trend:null),tier:clean(g.tier)||'未評価',
    tier_reason:clean(g.tier_reason??g.note),verification_status:g.verification_status??g.verification??'unreviewed',
    verification_note:g.verification_note||'',sources:Array.isArray(g.sources)?g.sources:Array.isArray(g.source_urls)?g.source_urls:[],
    last_verified:clean(g.last_verified??g.verified_at??asof),high_precision:!!g.high_precision
  };
}
function merge(base,fresh){
  const out={...base};
  for(const [k,v] of Object.entries(fresh)){
    if(k==='members'){if(Array.isArray(v)&&v.length) out.members=v;continue}
    if(k==='sources'){if(Array.isArray(v)&&v.length) out.sources=v;continue}
    if(v!==null&&v!==undefined&&v!=='') out[k]=v;
  }
  out.id=base.id||fresh.id; return out;
}
function buildBase(raw){
  const asof=raw.as_of||raw.updated||'';
  const map=new Map(),order=[];
  const add=(g,prefer)=>{
    if(!g?.name)return;
    const n=normGroup(g,asof),k=normName(n.name);
    if(!map.has(k)){map.set(k,n);order.push(k)}
    else map.set(k,prefer?merge(map.get(k),n):merge(n,map.get(k)));
  };
  (raw.directory||[]).forEach(g=>add(g,false));
  (raw.curated||[]).forEach(g=>add(g,true));
  (raw.groups||[]).forEach(g=>add(g,true));
  return order.map(k=>map.get(k));
}
async function load(){
  const [raw,hq]=await Promise.all([
    fetch('./data.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('data.json '+r.status);return r.json()}),
    fetch('./hq56.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('hq56.json '+r.status);return r.json()})
  ]);
  let groups=buildBase(raw), original=groups.length;
  let by=new Map(groups.map((g,i)=>[normName(g.name),i]));
  for(const item of (hq.groups||[])){
    const fresh=normGroup(item,raw.as_of||raw.updated||'');
    let idx=by.get(normName(fresh.name));
    if(idx===undefined && REPLACE[fresh.name]) idx=by.get(normName(REPLACE[fresh.name]));
    if(idx===undefined){console.warn('HQ overlay skipped to preserve base count:',fresh.name);continue}
    const old=groups[idx]; groups[idx]=merge(old,{...fresh,id:old.id,high_precision:true});
    by=new Map(groups.map((g,i)=>[normName(g.name),i]));
  }
  groups.forEach(g=>{if(HQ44.has(g.name))g.high_precision=true});
  console.log(`IDOLMAP: ${original} base groups, ${groups.filter(g=>g.high_precision).length} HQ`);
  DATA={groups,as_of:raw.as_of||raw.updated||'2026-08-26'};
}
function visible(){
  let a=DATA.groups.filter(g=>(state.tier==='ALL'||g.tier===state.tier)&&(state.faction==='ALL'||g.faction===state.faction)&&(!state.q||`${g.name} ${g.faction} ${g.agency||''} ${g.project||''} ${g.label||''}`.toLowerCase().includes(state.q.toLowerCase())));
  return a.sort((a,b)=>state.sort==='growth'?(b.growth??-1)-(a.growth??-1):state.sort==='name'?a.name.localeCompare(b.name,'ja'):state.sort==='tier'?((TIER_ORDER.indexOf(a.tier)<0?99:TIER_ORDER.indexOf(a.tier))-(TIER_ORDER.indexOf(b.tier)<0?99:TIER_ORDER.indexOf(b.tier))||(b.power??-1)-(a.power??-1)):(b.power??-1)-(a.power??-1));
}
function buildFilters(){
  $('#tierFilters').innerHTML=['ALL',...TIER_ORDER].map(x=>`<button class="chip ${x==='ALL'?'active':''}" data-tier="${esc(x)}">${x==='ALL'?'ALL':esc(x)}</button>`).join('');
  const fs=['ALL',...new Set(DATA.groups.map(g=>g.faction).filter(Boolean))];
  $('#factionFilters').innerHTML=fs.map(x=>`<button class="chip ${x==='ALL'?'active':''}" data-faction="${esc(x)}">${x==='ALL'?'全勢力':esc(x)}</button>`).join('');
}
function bind(){
  $('#listTab').onclick=()=>switchTab('list'); $('#mapTab').onclick=()=>switchTab('map'); $('#rankingTab').onclick=()=>switchTab('ranking');
  $('#search').oninput=e=>{state.q=e.target.value;renderAll()}; $('#sort').onchange=e=>{state.sort=e.target.value;renderAll()};
  $('#resetBtn').onclick=()=>{state.q='';state.tier='ALL';state.faction='ALL';$('#search').value='';$$('.chip').forEach(b=>b.classList.toggle('active',b.dataset.tier==='ALL'||b.dataset.faction==='ALL'));renderAll()};
  $('#tierFilters').onclick=e=>{let b=e.target.closest('[data-tier]');if(!b)return;state.tier=b.dataset.tier;$('#tierFilters').querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x===b));renderAll()};
  $('#factionFilters').onclick=e=>{let b=e.target.closest('[data-faction]');if(!b)return;state.faction=b.dataset.faction;$('#factionFilters').querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x===b));renderAll()};
  $$('.rankMode').forEach(b=>b.onclick=()=>{state.rank=b.dataset.mode;$$('.rankMode').forEach(x=>x.classList.toggle('active',x===b));renderRanking()});
  $('#shade').onclick=closeDrawer;$('#drawerClose').onclick=closeDrawer;document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});
}
function switchTab(t){
  state.tab=t; $('#listWrap').hidden=t!=='list';$('#mapWrap').hidden=t!=='map';$('#rankingWrap').hidden=t!=='ranking';
  $('#listTab').classList.toggle('active',t==='list');$('#mapTab').classList.toggle('active',t==='map');$('#rankingTab').classList.toggle('active',t==='ranking');
  if(t==='map')renderMap();if(t==='ranking')renderRanking();
}
function renderStats(){
  $('#totalGroups').textContent=DATA.groups.length;$('#scoredGroups').textContent=DATA.groups.filter(g=>g.power!==null).length;
  $('#factionCount').textContent=new Set(DATA.groups.map(g=>g.faction)).size;$('#asOf').textContent=DATA.as_of;
}
function groupCard(g){
  return `<article class="groupCard ${g.high_precision?'hq':''}" data-id="${esc(g.id)}">${g.high_precision?'<span class="hqTag">HQ</span>':''}<div class="gcFaction">${esc(g.faction)}</div><h3>${esc(g.name)}</h3><div class="scoreRowMini"><div class="scoreMini"><small>POWER</small><b>${g.power??'—'}</b></div><div class="scoreMini"><small>GROWTH</small><b>${g.growth??'—'}</b></div></div><div class="liveMini">${esc(g.live_scale||'ライブ規模 未確認')}</div><span class="tierPill">${esc(g.tier)}</span></article>`
}
function renderList(){
  const gs=visible();$('#listCount').textContent=`${gs.length} groups`;$('#groupGrid').innerHTML=gs.map(groupCard).join('')||'<div class="card" style="padding:25px">該当グループなし</div>';
  $('#groupGrid').querySelectorAll('[data-id]').forEach(x=>x.onclick=()=>openGroup(x.dataset.id));
}
function renderMap(){
  const gs=visible().filter(g=>typeof g.power==='number'&&typeof g.growth==='number');
  const el=$('#mapPoints');el.innerHTML='';
  const labels=new Set(gs.slice(0,35).map(g=>g.id));
  for(const g of gs){
    const x=Math.max(2,Math.min(98,g.growth));const y=Math.max(2,Math.min(98,g.power));
    const d=document.createElement('button');d.className=`mapPoint ${g.high_precision?'hq':''}`;d.style.left=x+'%';d.style.bottom=y+'%';d.dataset.id=g.id;d.title=`${g.name} P${g.power} G${g.growth}`;
    if(labels.has(g.id)){const l=document.createElement('span');l.className='mapLabel';l.textContent=g.name;d.appendChild(l)}
    d.onclick=()=>openGroup(g.id);el.appendChild(d);
  }
}
function renderRanking(){
  let gs=[...visible()].sort((a,b)=>state.rank==='growth'?(b.growth??-1)-(a.growth??-1):(b.power??-1)-(a.power??-1));
  $('#rankingBody').innerHTML=gs.map((g,i)=>`<tr data-id="${esc(g.id)}"><td class="rankN">${i+1}</td><td><b>${esc(g.name)}</b>${g.high_precision?' <small style="color:#1693ba">HQ</small>':''}</td><td>${esc(g.faction)}</td><td>${esc(g.tier)}</td><td>${g.power??'—'}</td><td>${g.growth??'—'}</td><td>${esc(g.live_scale||'未確認')}</td></tr>`).join('');
  $('#rankingBody').querySelectorAll('tr').forEach(x=>x.onclick=()=>openGroup(x.dataset.id));
}
function openGroup(id){
  const g=DATA.groups.find(x=>x.id===id);if(!g)return;
  const links=[['公式HP',g.official_hp],['X',g.x],['Instagram',g.instagram],['TikTok',g.tiktok],['YouTube',g.youtube]];
  const details=[['デビュー日 / 活動開始',g.debut_date],['メジャーデビュー',g.major_debut_date],['芸能事務所 / 運営',g.agency],['アイドルプロジェクト',g.project],['レーベル',g.label],['親会社 / 資本関係',g.parent],['ライブ規模 / 実績',g.live_scale],['ステータス',g.status]];
  const vm=String(g.verification_status||'unreviewed');
  $('#drawerContent').innerHTML=`<div class="dFaction">${esc(g.faction)}</div><h2>${esc(g.name)}</h2><div class="badges">${g.high_precision?'<span class="badge">HQ 高精度</span>':''}<span class="badge ${vm.startsWith('verified')?'verified':''}">${esc(vm)}</span><span class="badge">TIER ${esc(g.tier)}</span><span class="badge">POWER ${g.power??'—'}</span><span class="badge">GROWTH ${g.growth??'—'}</span></div><div class="detailGrid">${details.map(([k,v])=>`<div class="detailBox ${k.includes('ライブ')?'wide':''}"><small>${k}</small><b>${esc(v||'未確認')}</b></div>`).join('')}</div>${g.tier_reason?`<div class="reasonBox"><small>評価根拠</small><p>${esc(g.tier_reason)}</p></div>`:''}<h3>OFFICIAL LINKS</h3><div class="socialGrid">${links.map(([k,v])=>v?`<a href="${esc(v)}" target="_blank" rel="noopener">${k}<span>↗</span></a>`:`<div class="socialOff">${k}<span>未確認</span></div>`).join('')}</div><h3>MEMBERS <small>${g.members.length}</small></h3><div class="memberGrid">${g.members.length?g.members.map(m=>`<div class="member"><b>${esc(m.name)}</b><div class="memberSocials">${[['X',m.x],['IG',m.instagram],['TikTok',m.tiktok],['YT',m.youtube]].filter(x=>x[1]).map(([k,v])=>`<a href="${esc(v)}" target="_blank">${k} ↗</a>`).join('')||'<span style="font-size:8px;color:#899da6">SNS未確認</span>'}</div></div>`).join(''):'<div class="detailBox wide">メンバー情報を再監査中</div>'}</div><h3>VERIFICATION</h3><div class="detailBox"><small>最終確認</small><b>${esc(g.last_verified||DATA.as_of)}</b><p style="font-size:9px;color:#78909d">${esc(g.verification_note||'')}</p></div><h3>SOURCES</h3><div class="sources">${(g.sources||[]).map(u=>`<a href="${esc(u)}" target="_blank">${esc(u)}</a>`).join('')||'未確認'}</div>`;
  $('#drawer').classList.add('open');
}
function closeDrawer(){$('#drawer').classList.remove('open')}
function renderAll(){renderList();if(state.tab==='map')renderMap();if(state.tab==='ranking')renderRanking()}
async function boot(){await load();renderStats();buildFilters();bind();renderAll()}
boot().catch(e=>{console.error(e);document.body.insertAdjacentHTML('beforeend','<div style="position:fixed;bottom:15px;left:15px;right:15px;padding:15px;background:#173447;color:white;border-radius:12px;z-index:99">データ読み込みエラー。data.json / hq56.json を確認してください。</div>')});

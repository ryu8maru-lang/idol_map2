
const TIER_ORDER=['SSS','SS','S','A+','A','B+','B','C','未評価'];
let DATA=null,state={tier:'ALL',faction:'ALL',q:'',sort:'tier'};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

function normName(v=''){
  return String(v).normalize('NFKC').replace(/\s+/g,'').toLowerCase();
}

function clean(v){
  if(v===null || v===undefined) return null;
  if(typeof v==='string'){
    const s=v.trim();
    if(!s || ['未確認','未評価','null','None','N/A'].includes(s)) return null;
  }
  return v;
}

function normalizeMember(m){
  if(typeof m==='string'){
    return {name:m,status:'current',x:null,instagram:null,tiktok:null,youtube:null,imageUrl:null};
  }
  m=m||{};
  return {
    ...m,
    name:m.name||'',
    status:m.status||'current',
    x:clean(m.x??m.x_url),
    instagram:clean(m.instagram??m.instagram_url),
    tiktok:clean(m.tiktok??m.tiktok_url),
    youtube:clean(m.youtube??m.youtube_url),
    imageUrl:clean(m.imageUrl??m.image_url)
  };
}

function normalizeGroup(g,rawUpdated){
  g=g||{};
  return {
    ...g,
    id:g.id||`g-${normName(g.name)}`,
    name:g.name||'',
    faction:clean(g.faction)||clean(g.project)||'独立/その他',
    debut_date:clean(g.debut_date),
    official_hp:clean(g.official_hp??g.official_url),
    x:clean(g.x??g.x_url),
    instagram:clean(g.instagram??g.instagram_url),
    tiktok:clean(g.tiktok??g.tiktok_url),
    youtube:clean(g.youtube??g.youtube_url),
    imageUrl:clean(g.imageUrl??g.image_url??g.artist_photo_url),
    agency:clean(g.agency),
    project:clean(g.project),
    label:clean(g.label),
    live_scale:clean(g.live_scale??g.venue),
    members:(g.members||[]).map(normalizeMember),
    power:typeof g.power==='number'?g.power:null,
    growth:typeof g.growth==='number'?g.growth:(typeof g.trend==='number'?g.trend:null),
    tier:clean(g.tier)||'未評価',
    tier_reason:clean(g.tier_reason??g.note),
    verification_status:g.verification_status??g.verification??'unreviewed',
    verification_note:g.verification_note||'',
    sources:Array.isArray(g.sources)?g.sources:
      Array.isArray(g.source_urls)?g.source_urls:
      g.source_url?[g.source_url]:[],
    last_verified:clean(g.last_verified??g.verified_at??rawUpdated)
  };
}

function mergeGroups(base,fresh){
  const out={...base};
  for(const [k,v] of Object.entries(fresh)){
    if(k==='members'){
      if(Array.isArray(v) && v.length) out.members=v;
      continue;
    }
    if(k==='sources'){
      if(Array.isArray(v) && v.length) out.sources=v;
      continue;
    }
    if(v!==null && v!==undefined && v!=='') out[k]=v;
  }
  if(base.id) out.id=base.id;
  if(!('imageUrl' in out)) out.imageUrl=null;
  out.members=(out.members||[]).map(normalizeMember);
  return out;
}

function buildMergedGroups(raw){
  const updated=raw.as_of||raw.updated||'';
  const directory=Array.isArray(raw.directory)?raw.directory:[];
  const curated=Array.isArray(raw.curated)?raw.curated:[];
  const explicit=Array.isArray(raw.groups)?raw.groups:[];

  const map=new Map();
  const order=[];

  const add=(g,prefer=false)=>{
    if(!g?.name) return;
    const ng=normalizeGroup(g,updated);
    const key=normName(ng.name);
    if(!map.has(key)){
      map.set(key,ng);
      order.push(key);
    }else{
      map.set(key,prefer?mergeGroups(map.get(key),ng):mergeGroups(ng,map.get(key)));
    }
  };

  // 広い名簿を先に置く
  directory.forEach(g=>add(g,false));

  // curated は高精度情報として上書き
  curated.forEach(g=>add(g,true));

  // 新形式 groups があれば最優先
  explicit.forEach(g=>add(g,true));

  return order.map(k=>map.get(k));
}

async function boot(){
  const raw=await fetch('./data.json',{cache:'no-store'}).then(r=>{
    if(!r.ok) throw new Error(`data.json HTTP ${r.status}`);
    return r.json();
  });

  DATA={
    as_of:raw.as_of||raw.updated||'',
    groups:buildMergedGroups(raw)
  };

  renderStats();
  buildFactionChips();
  bind();
  render();
}

function visible(){
  let a=DATA.groups.filter(g=>
    (state.tier==='ALL'||g.tier===state.tier) &&
    (state.faction==='ALL'||g.faction===state.faction) &&
    (!state.q||(`${g.name} ${g.faction} ${g.agency||''} ${g.project||''}`).toLowerCase().includes(state.q.toLowerCase()))
  );

  return a.sort((a,b)=>
    state.sort==='power'?(b.power??-1)-(a.power??-1):
    state.sort==='growth'?(b.growth??-1)-(a.growth??-1):
    state.sort==='name'?a.name.localeCompare(b.name,'ja'):
    ((TIER_ORDER.indexOf(a.tier)===-1?999:TIER_ORDER.indexOf(a.tier)) -
     (TIER_ORDER.indexOf(b.tier)===-1?999:TIER_ORDER.indexOf(b.tier)) ||
     (b.power??-1)-(a.power??-1))
  );
}

function renderStats(){
  const gs=DATA.groups;
  $('#groupCount').textContent=gs.length;
  $('#memberCount').textContent=gs.reduce((s,g)=>s+(Array.isArray(g.members)?g.members.filter(m=>m?.status!=='former').length:0),0);
  $('#sssCount').textContent=gs.filter(g=>g.tier==='SSS').length;
  $('#verifiedDate').textContent=DATA.as_of||'—';
}

function buildFactionChips(){
  const fs=['ALL',...new Set(DATA.groups.map(g=>g.faction).filter(Boolean))];
  $('#factionChips').innerHTML=fs.map(f=>
    `<button class="chip factionChip ${f==='ALL'?'active':''}" data-faction="${esc(f)}">${f==='ALL'?'全勢力':esc(f)}</button>`
  ).join('');
}

function bind(){
  $$('.tierChip').forEach(b=>b.onclick=()=>{
    state.tier=b.dataset.tier;
    $$('.tierChip').forEach(x=>x.classList.toggle('active',x===b));
    render();
  });

  $('#factionChips').onclick=e=>{
    const b=e.target.closest('button');
    if(!b)return;
    state.faction=b.dataset.faction;
    $$('.factionChip').forEach(x=>x.classList.toggle('active',x===b));
    render();
  };

  $('#search').oninput=e=>{state.q=e.target.value;render();};
  $('#sort').onchange=e=>{state.sort=e.target.value;render();};
  $('#shade').onclick=closeDrawer;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});
}

function render(){
  const gs=visible();
  $('#resultCount').textContent=`${gs.length} groups`;
  const tiers=state.tier==='ALL'?TIER_ORDER:[state.tier];
  let html='';

  for(const t of tiers){
    const arr=gs.filter(g=>g.tier===t);
    if(!arr.length)continue;
    html+=`<div class="tierLane">
      <div class="laneHead"><div class="tierBadge" data-tier="${esc(t)}">${esc(t)}</div><span>${arr.length} groups</span></div>
      <div class="cards">${arr.map(card).join('')}</div>
    </div>`;
  }

  $('#tierMap').innerHTML=html||'<div class="empty">条件に一致するグループがありません。</div>';
  $$('.card').forEach(c=>c.onclick=()=>openDrawer(c.dataset.id));
  renderRanking(gs);
}

function card(g){
  return `<article class="card" data-id="${esc(g.id)}">
    <div class="cardTop">
      <div><div class="faction">${esc(g.faction)}</div><h3>${esc(g.name)}</h3></div>
      <span class="miniTier">${esc(g.tier)}</span>
    </div>
    <div class="meters">
      <div class="meter"><small>POWER</small><b>${g.power??'—'}</b></div>
      <div class="meter"><small>GROWTH</small><b>${g.growth??'—'}</b></div>
    </div>
    <div class="live">${esc(g.live_scale||'ライブ規模：未確認')}</div>
  </article>`;
}

function renderRanking(gs){
  const a=[...gs].sort((a,b)=>(b.power??-1)-(a.power??-1)||(b.growth??-1)-(a.growth??-1));
  $('#rankingBody').innerHTML=a.map((g,i)=>
    `<tr>
      <td class="rankNum">${i+1}</td>
      <td><b>${esc(g.name)}</b><br><small>${esc(g.faction)}</small></td>
      <td>${esc(g.tier)}</td>
      <td>${g.power??'—'}</td>
      <td>${g.growth??'—'}</td>
      <td>${esc(g.live_scale||'未確認')}</td>
    </tr>`
  ).join('');
}

function groupPhoto(g){
  if(!g.imageUrl) return '';
  return `<div style="margin:16px 0 18px;border-radius:18px;overflow:hidden;background:#eef7fa">
    <img src="${esc(g.imageUrl)}"
         alt="${esc(g.name)} アーティスト写真"
         style="display:block;width:100%;max-height:420px;object-fit:cover"
         loading="lazy"
         onerror="this.parentElement.style.display='none'">
  </div>`;
}

function openDrawer(id){
  const g=DATA.groups.find(x=>x.id===id);
  if(!g)return;

  $('#drawer').classList.add('open');

  const links=[
    ['公式HP',g.official_hp],
    ['X',g.x],
    ['Instagram',g.instagram],
    ['TikTok',g.tiktok],
    ['YouTube',g.youtube]
  ];

  const members=g.members||[];

  $('#drawerContent').innerHTML=`
    <button class="close" id="innerClose">×</button>
    <div class="detailHero">
      <div class="faction">${esc(g.faction)}</div>
      <h2>${esc(g.name)}</h2>
      <div class="scorePills">
        <span class="scorePill">TIER ${esc(g.tier)}</span>
        <span class="scorePill">POWER ${g.power??'未評価'}</span>
        <span class="scorePill">GROWTH ${g.growth??'未評価'}</span>
      </div>
    </div>

    ${groupPhoto(g)}

    <div class="detailGrid">
      <div class="detail"><small>デビュー日</small><b>${esc(g.debut_date||'未確認')}</b></div>
      <div class="detail"><small>所属・運営</small><b>${esc(g.agency||'未確認')}</b></div>
      <div class="detail"><small>プロジェクト</small><b>${esc(g.project||'未確認')}</b></div>
      <div class="detail"><small>レーベル</small><b>${esc(g.label||'未確認')}</b></div>
      <div class="detail" style="grid-column:1/-1"><small>ライブ規模・実績</small><b>${esc(g.live_scale||'未確認')}</b></div>
      <div class="detail" style="grid-column:1/-1"><small>評価根拠</small><b>${esc(g.tier_reason||'未評価')}</b></div>
    </div>

    <h3>OFFICIAL LINKS</h3>
    <div class="links">
      ${links.map(([n,u])=>u
        ? `<a class="linkBtn" target="_blank" rel="noopener" href="${esc(u)}"><span>${n}</span><span>↗</span></a>`
        : `<div class="linkOff"><span>${n}</span><span>未確認</span></div>`
      ).join('')}
    </div>

    <h3>MEMBERS <small>${members.length}</small></h3>
    <div class="members">
      ${members.length?members.map(memberCard).join(''):'<div class="empty">メンバー情報を再監査中</div>'}
    </div>

    <h3>VERIFICATION</h3>
    <div class="method">
      状態：<b>${esc(g.verification_status||'unreviewed')}</b><br>
      最終確認：${esc(g.last_verified||DATA.as_of||'未確認')}<br>
      ${esc(g.verification_note||'')}
    </div>

    <h3>SOURCES</h3>
    <div class="sources">
      ${(g.sources||[]).map(u=>`<a target="_blank" rel="noopener" href="${esc(u)}">${esc(u)}</a>`).join('')||'未確認'}
    </div>
  `;

  $('#innerClose').onclick=closeDrawer;
}

function memberCard(m){
  const links=[
    ['X',m.x||m.x_url],
    ['IG',m.instagram||m.instagram_url],
    ['TikTok',m.tiktok||m.tiktok_url],
    ['YT',m.youtube||m.youtube_url]
  ].filter(x=>x[1]);

  return `<div class="member">
    <b>${esc(m.name)}</b>
    <div class="memberLinks">
      ${links.map(([n,u])=>`<a target="_blank" rel="noopener" href="${esc(u)}">${n} ↗</a>`).join('')||
        '<span style="font-size:9px;color:#91a5ad">SNS未確認</span>'}
    </div>
  </div>`;
}

function closeDrawer(){
  $('#drawer').classList.remove('open');
}

boot().catch(err=>{
  console.error(err);
  const target=document.querySelector('#tierMap')||document.body;
  target.innerHTML=`<div class="empty">データ読み込みエラー: ${esc(err.message)}</div>`;
});

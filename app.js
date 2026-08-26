/* IDOLMAP app.js
 * Version: 2026-08-26 ver4.2 mv-imagefix
 * Fixes:
 * - MV 10 picks updated to latest requested set
 * - Quick idol search enabled under hero
 * - Current known artist images embedded directly in this file
 */
const APP_VERSION = '2026-08-26-ver4.2-mv-imagefix';

const TIER_ORDER = ['SSS','SS','S','A+','A','B+','B','C','未評価'];

const HQ44 = new Set([
  "乃木坂46","=LOVE","iLiFE!","櫻坂46","ももいろクローバーZ","超ときめき♡宣伝部","≠ME","日向坂46","のんふぃく！","私立恵比寿中学","≒JOY","いぎなり東北産","夜光性アミューズ","ドレスコード","MEGAFON","iON!","ばってん少女隊","フルコース","ラストシーン","GILTY x GILTY","i-COL","AdamLilith","TENRIN","LADYBABY","chuLa","アキシブproject","パラディーク","Ill","MISS MERCY","テンシンランマン","ナナコロビヤオキ","ZUTTOMOTTO","ハルカエコー","Pastel Closet","RE-GE","パラレルサイダー","ポンコツコンポ","CAL&RES","AMEFURASSHI","ukka","スタプラ研究生","ヒロインズ研究生","ヒロインズ研究生大阪","浪江女子発組合"
]);

const REPLACE = {
  'AsIs':'ASP',
  'Palette Parade':'BiTE A SHOCK',
  'きゅるりんってしてみて':'#ババババンビ',
  'Merry BAD TUNE.':'#2i2',
  'NANIMONO':'東京女子流'
};

const FACTION_COLORS = [
  ['坂道','#8f77ff'],
  ['イコノイジョイ','#ff6f9f'],
  ['KAWAII LAB.','#ff8fc5'],
  ['Hello! Project','#55cfa3'],
  ['48グループ','#4fa7ff'],
  ['スタダ','#49c7e8'],
  ['STARDUST','#49c7e8'],
  ['HEROINES','#e64d88'],
  ['ヒロインズ','#e64d88'],
  ['WACK','#6f7780'],
  ['avex','#ff9a55'],
  ['Sony','#668cff'],
  ['ゼロイチ','#ffbf52'],
  ['ディアステージ','#a56eea']
];

/* 五十音順ベースのおすすめMV10選（直接YouTubeへ） */
const MV_PICKS = [
  {group:'iLiFE!', title:'ガンバッテンダー', url:'https://www.youtube.com/watch?v=xlg9Wc-FJjY', video:'xlg9Wc-FJjY', note:'ライブアイドルの熱量と前向きさを詰め込んだ一曲。'},
  {group:'=LOVE', title:'絶対アイドル辞めないで', url:'https://www.youtube.com/watch?v=17NBPoc78oM', video:'17NBPoc78oM', note:'“アイドルであること”そのものを歌った現代アイドルの代表曲。'},
  {group:'いぎなり東北産', title:'服を着て、恋したい', url:'https://www.youtube.com/watch?v=2ILiRAjx2aY', video:'2ILiRAjx2aY', note:'大森靖子提供曲を、2026年に待望のMV化。'},
  {group:'きゅるりんってしてみて', title:'えぶりで大好き記念日', url:'https://www.youtube.com/watch?v=VWyB3Wrv6po', video:'VWyB3Wrv6po', note:'世界観・衣装・映像まで“かわいい”を作品化。'},
  {group:'櫻坂46', title:'桜月', url:'https://www.youtube.com/watch?v=zKLgrxHDgls', video:'zKLgrxHDgls', note:'映像美とパフォーマンスが静かに刺さる一本。'},
  {group:'高嶺のなでしこ', title:'美しく生きろ', url:'https://www.youtube.com/watch?v=IPZi16uFCqs', video:'IPZi16uFCqs', note:'HoneyWorks×たかねこの決意が伝わるメジャーデビュー曲。'},
  {group:'超ときめき♡宣伝部', title:'どりーむじゃんぼ！', url:'https://www.youtube.com/watch?v=mnpJ6i1qRPk', video:'mnpJ6i1qRPk', note:'新体制の明るさと“夢を大きく”をまっすぐ届ける2026年曲。'},
  {group:'乃木坂46', title:'是非に及ばず', url:'https://www.youtube.com/watch?v=ogAufBgPpBk', video:'ogAufBgPpBk', note:'42ndシングル表題曲。乃木坂46の現在地。'},
  {group:'ハルニシオン', title:'どんなに嫌われたって、君が好きだ', url:'https://www.youtube.com/watch?v=29YFl1XxuFg', video:'29YFl1XxuFg', note:'切実な恋心とグループの伸びを感じるMV。'},
  {group:'Rain Tree', title:'好きだよとどっちが先に言うのか？', url:'https://www.youtube.com/watch?v=SWnPlMB3WpA', video:'SWnPlMB3WpA', note:'透明感と青春の切なさが溶け合う映像作品。'}
];

/* 今はMV PICKと同じ10本をYouTube Trendとして表示 */
const YT_TREND = [...MV_PICKS];

/* 現時点で公式由来として反映済みのアー写 */
const ARTIST_IMAGE_OVERLAY = {
  "FRUITS ZIPPER": {
    artist_image: "https://asobisystem.com/wp-content/uploads/2023/11/%E2%98%85fz_ap_group.jpg",
    artist_image_source: "https://asobisystem.com/en/news/47896/",
    artist_image_status: "verified_official",
    artist_image_note: "ASOBISYSTEM official group photo"
  },
  "超ときめき♡宣伝部": {
    artist_image: "https://toki-sen.com/s3/skiyaki/uploads/artist_photo/image/16495/Asha_20220920.jpg",
    artist_image_source: "https://toki-sen.com/profiles",
    artist_image_status: "verified_official",
    artist_image_note: "Official profile image"
  },
  "日向坂46": {
    artist_image: "https://cdn.hinatazaka46.com/files/14/diary/official/member/moblog/202512/mobUSoQGZ.jpg",
    artist_image_source: "https://www.hinatazaka46.com/s/official/diary/member/list",
    artist_image_status: "verified_official",
    artist_image_note: "Official CDN image"
  }
};

let DATA = { groups: [], as_of: '' };
let state = {
  tab: 'discover',
  dbQ: '',
  dbTier: 'ALL',
  dbFaction: 'ALL',
  dbSort: 'power',
  mapQ: '',
  mapFaction: 'ALL'
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const clean = v => v === undefined || v === null || v === '' ? null : v;
const normName = s => String(s || '').trim().replace(/\s+/g, '').toLowerCase();
const ytThumb = p => p.video ? `https://img.youtube.com/vi/${p.video}/hqdefault.jpg` : null;

function factionColor(name='') {
  const hit = FACTION_COLORS.find(([k]) => name.includes(k));
  return hit ? hit[1] : '#59bfd6';
}

function normMember(m) {
  return {
    ...m,
    name: m?.name || '',
    status: m?.status || 'current',
    x: clean(m?.x ?? m?.x_url),
    instagram: clean(m?.instagram ?? m?.instagram_url),
    tiktok: clean(m?.tiktok ?? m?.tiktok_url),
    youtube: clean(m?.youtube ?? m?.youtube_url)
  };
}

function normGroup(g, asof) {
  return {
    ...g,
    id: g.id || `g-${normName(g.name)}`,
    name: g.name || '',
    faction: clean(g.faction) || clean(g.project) || '独立/その他',
    debut_date: clean(g.debut_date),
    major_debut_date: clean(g.major_debut_date),
    official_hp: clean(g.official_hp ?? g.official_url),
    x: clean(g.x ?? g.x_url),
    instagram: clean(g.instagram ?? g.instagram_url),
    tiktok: clean(g.tiktok ?? g.tiktok_url),
    youtube: clean(g.youtube ?? g.youtube_url),
    agency: clean(g.agency),
    project: clean(g.project),
    label: clean(g.label),
    parent: clean(g.parent),
    live_scale: clean(g.live_scale ?? g.venue),
    artist_image: clean(g.artist_image),
    members: (g.members || []).map(normMember),
    power: typeof g.power === 'number' ? g.power : null,
    growth: typeof g.growth === 'number' ? g.growth : (typeof g.trend === 'number' ? g.trend : null),
    tier: clean(g.tier) || '未評価',
    tier_reason: clean(g.tier_reason ?? g.note),
    verification_status: g.verification_status ?? g.verification ?? 'unreviewed',
    verification_note: g.verification_note || '',
    sources: Array.isArray(g.sources) ? g.sources : (Array.isArray(g.source_urls) ? g.source_urls : []),
    last_verified: clean(g.last_verified ?? g.verified_at ?? asof),
    high_precision: !!g.high_precision
  };
}

function merge(base, fresh) {
  const out = { ...base };
  for (const [k, v] of Object.entries(fresh)) {
    if (k === 'members') {
      if (Array.isArray(v) && v.length) out.members = v;
      continue;
    }
    if (k === 'sources') {
      if (Array.isArray(v) && v.length) out.sources = v;
      continue;
    }
    if (v !== null && v !== undefined && v !== '') out[k] = v;
  }
  out.id = base.id || fresh.id;
  return out;
}

function buildBase(raw) {
  const asof = raw.as_of || raw.updated || '';
  const map = new Map();
  const order = [];
  const add = (g, prefer) => {
    if (!g?.name) return;
    const n = normGroup(g, asof);
    const k = normName(n.name);
    if (!map.has(k)) {
      map.set(k, n);
      order.push(k);
    } else {
      map.set(k, prefer ? merge(map.get(k), n) : merge(n, map.get(k)));
    }
  };
  (raw.directory || []).forEach(g => add(g, false));
  (raw.curated || []).forEach(g => add(g, true));
  (raw.groups || []).forEach(g => add(g, true));
  return order.map(k => map.get(k));
}

async function load() {
  const [raw, hq] = await Promise.all([
    fetch('./data.json', { cache: 'no-store' }).then(r => { if (!r.ok) throw Error('data.json ' + r.status); return r.json(); }),
    fetch('./hq56.json', { cache: 'no-store' }).then(r => { if (!r.ok) throw Error('hq56.json ' + r.status); return r.json(); })
  ]);

  let groups = buildBase(raw);
  let by = new Map(groups.map((g, i) => [normName(g.name), i]));

  for (const item of (hq.groups || [])) {
    const fresh = normGroup(item, raw.as_of || raw.updated || '');
    let idx = by.get(normName(fresh.name));
    if (idx === undefined && REPLACE[fresh.name]) idx = by.get(normName(REPLACE[fresh.name]));
    if (idx === undefined) continue;
    const old = groups[idx];
    groups[idx] = merge(old, { ...fresh, id: old.id, high_precision: true });
    by = new Map(groups.map((g, i) => [normName(g.name), i]));
  }

  groups.forEach(g => { if (HQ44.has(g.name)) g.high_precision = true; });

  groups = groups.map(g => {
    const overlay = ARTIST_IMAGE_OVERLAY[g.name];
    return overlay ? { ...g, ...overlay } : g;
  });

  DATA = {
    groups,
    as_of: raw.as_of || raw.updated || '2026-08-26'
  };

  console.log('IDOLMAP app loaded:', APP_VERSION, 'groups=', DATA.groups.length);
}

function switchTab(tab) {
  state.tab = tab;
  ['discover','map','ranking','database'].forEach(t => {
    const el = document.getElementById(`${t}View`);
    if (el) el.hidden = t !== tab;
  });
  $$('.navBtn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  if (tab === 'map') renderMap();
  if (tab === 'ranking') renderRankings();
  if (tab === 'database') renderDatabase();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderStats() {
  $('#statGroups').textContent = DATA.groups.length;
  $('#statScored').textContent = DATA.groups.filter(g => g.power !== null).length;
  $('#statFactions').textContent = new Set(DATA.groups.map(g => g.faction)).size;
  $('#statHQ').textContent = DATA.groups.filter(g => g.high_precision).length;
  $('#asOf').textContent = DATA.as_of;
}

function renderMV() {
  const grid = $('#mvGrid');
  if (!grid) return;
  grid.innerHTML = MV_PICKS.map((p, i) => `
    <a class="mvCard" href="${p.url}" target="_blank" rel="noopener">
      <div class="mvThumb">${ytThumb(p) ? `<img loading="lazy" src="${ytThumb(p)}" alt="${esc(p.group)} ${esc(p.title)}">` : ''}</div>
      <div class="mvBody">
        <div class="mvNum">PICK ${String(i + 1).padStart(2, '0')}</div>
        <h3>${esc(p.group)}</h3>
        <b>${esc(p.title)}</b>
        <p>${esc(p.note)}</p>
        <span class="mvGo">YouTubeで見る ↗</span>
      </div>
    </a>
  `).join('');
}

function buildControls() {
  const tiers = ['ALL', ...TIER_ORDER];
  $('#tierChips').innerHTML = tiers.map(t => `<button class="chip ${t === 'ALL' ? 'active' : ''}" data-tier="${esc(t)}">${esc(t)}</button>`).join('');
  const factions = ['ALL', ...new Set(DATA.groups.map(g => g.faction).filter(Boolean))];
  $('#factionChips').innerHTML = factions.map(f => `<button class="chip ${f === 'ALL' ? 'active' : ''}" data-faction="${esc(f)}">${f === 'ALL' ? '全勢力' : esc(f)}</button>`).join('');
  $('#mapFaction').innerHTML = factions.map(f => `<option value="${esc(f)}">${f === 'ALL' ? '全勢力' : esc(f)}</option>`).join('');
  const common = [...new Set(FACTION_COLORS.map(x => x[0]))];
  $('#factionLegend').innerHTML = common.map(n => `<span class="legendItem"><i class="legendDot" style="background:${factionColor(n)}"></i>${esc(n)}</span>`).join('');
}

function quickMatches() {
  const q = ($('#quickSearch')?.value || '').trim().toLowerCase();
  if (!q) return [];
  return DATA.groups.filter(g => `${g.name} ${g.faction} ${g.agency || ''} ${g.project || ''} ${g.label || ''}`.toLowerCase().includes(q)).slice(0, 8);
}

function renderQuickSearch() {
  const box = $('#quickResults');
  if (!box) return;
  const q = ($('#quickSearch')?.value || '').trim();
  if (!q) {
    box.innerHTML = '';
    return;
  }
  const gs = quickMatches();
  box.innerHTML = gs.length ? gs.map(g => `
    <button class="quickResult" data-id="${esc(g.id)}">
      <small>${esc(g.faction)}</small>
      <b>${esc(g.name)}</b>
      <span>TIER ${esc(g.tier)} / POWER ${g.power ?? '—'} / GROWTH ${g.growth ?? '—'}</span>
    </button>
  `).join('') : `<div class="quickEmpty">一致するグループがありません。</div>`;
  $$('#quickResults [data-id]').forEach(x => x.onclick = () => openGroup(x.dataset.id));
}

function dbVisible() {
  let a = DATA.groups.filter(g =>
    (state.dbTier === 'ALL' || g.tier === state.dbTier) &&
    (state.dbFaction === 'ALL' || g.faction === state.dbFaction) &&
    (!state.dbQ || `${g.name} ${g.faction} ${g.agency || ''} ${g.project || ''} ${g.label || ''}`.toLowerCase().includes(state.dbQ.toLowerCase()))
  );
  return a.sort((a, b) => {
    if (state.dbSort === 'growth') return (b.growth ?? -1) - (a.growth ?? -1);
    if (state.dbSort === 'name') return a.name.localeCompare(b.name, 'ja');
    if (state.dbSort === 'tier') {
      const ta = TIER_ORDER.indexOf(a.tier) < 0 ? 99 : TIER_ORDER.indexOf(a.tier);
      const tb = TIER_ORDER.indexOf(b.tier) < 0 ? 99 : TIER_ORDER.indexOf(b.tier);
      return ta - tb || (b.power ?? -1) - (a.power ?? -1);
    }
    return (b.power ?? -1) - (a.power ?? -1);
  });
}

function groupCard(g) {
  return `
    <article class="groupCard ${g.high_precision ? 'hq' : ''}" data-id="${esc(g.id)}">
      ${g.high_precision ? '<span class="hqTag">HQ</span>' : ''}
      <div class="groupFaction">${esc(g.faction)}</div>
      <h3>${esc(g.name)}</h3>
      <div class="miniScores">
        <div class="miniScore"><small>POWER</small><b>${g.power ?? '—'}</b></div>
        <div class="miniScore"><small>GROWTH</small><b>${g.growth ?? '—'}</b></div>
      </div>
      <div class="miniLive">${esc(g.live_scale || 'ライブ規模 未確認')}</div>
      <span class="tierPill">${esc(g.tier)}</span>
    </article>
  `;
}

function renderDatabase() {
  const gs = dbVisible();
  $('#dbCount').textContent = `${gs.length} groups`;
  $('#groupGrid').innerHTML = gs.map(groupCard).join('') || '<div class="card" style="padding:25px">該当グループなし</div>';
  $$('#groupGrid [data-id]').forEach(x => x.onclick = () => openGroup(x.dataset.id));
}

function renderMap() {
  const all = DATA.groups.filter(g => typeof g.power === 'number' && typeof g.growth === 'number');
  const q = state.mapQ.toLowerCase();
  const selected = state.mapFaction;
  const eligible = all.filter(g => (selected === 'ALL' || g.faction === selected) && (!q || g.name.toLowerCase().includes(q)));
  const topLabels = new Set([...eligible].sort((a, b) => (b.power ?? 0) - (a.power ?? 0)).slice(0, window.innerWidth < 600 ? 25 : 45).map(g => g.id));

  $('#mapPoints').innerHTML = all.map(g => {
    const x = Math.max(2, Math.min(98, g.growth));
    const y = Math.max(2, Math.min(98, g.power));
    const match = (selected === 'ALL' || g.faction === selected) && (!q || g.name.toLowerCase().includes(q));
    return `
      <button
        class="mapPoint ${g.high_precision ? 'hq' : ''} ${match ? '' : 'dim'} ${q && match ? 'hit' : ''}"
        style="left:${x}%;bottom:${y}%;background:${factionColor(g.faction)}"
        data-id="${esc(g.id)}"
        title="${esc(g.name)}">
        ${topLabels.has(g.id) && match ? `<span class="mapLabel">${esc(g.name)}</span>` : ''}
      </button>
    `;
  }).join('');

  $$('#mapPoints [data-id]').forEach(x => x.onclick = () => openGroup(x.dataset.id));
}

function rankRows(list) {
  return list.map((g, i) => `
    <tr class="rankRow" data-id="${esc(g.id)}">
      <td class="rankNo">${i + 1}</td>
      <td><b>${esc(g.name)}</b></td>
      <td>${esc(g.tier)}</td>
      <td>${g.power ?? '—'}</td>
      <td>${g.growth ?? '—'}</td>
    </tr>
  `).join('');
}

function renderRankings() {
  const scored = DATA.groups.filter(g => g.power !== null || g.growth !== null);
  $('#powerRanking').innerHTML = rankRows([...scored].sort((a, b) => (b.power ?? -1) - (a.power ?? -1)).slice(0, 20));
  $('#growthRanking').innerHTML = rankRows([...scored].sort((a, b) => (b.growth ?? -1) - (a.growth ?? -1)).slice(0, 20));
  $$('.rankRow').forEach(x => x.onclick = () => openGroup(x.dataset.id));
  $('#youtubeTrend').innerHTML = YT_TREND.map((p, i) => `
    <a class="trendItem" href="${p.url}" target="_blank" rel="noopener">
      <div class="trendNo">${i + 1}</div>
      ${ytThumb(p) ? `<img class="trendThumb" loading="lazy" src="${ytThumb(p)}" alt="">` : `<div class="trendThumb"></div>`}
      <div class="trendText">
        <small>${esc(p.group)}</small>
        <b>${esc(p.title)}</b>
        <div class="trendDate">${esc(p.note || '')}</div>
      </div>
      <span class="ytBtn">YouTube ↗</span>
    </a>
  `).join('');
}

function reviewKey(id) { return `idolmap_reviews_${id}`; }
function getReviews(id) {
  try { return JSON.parse(localStorage.getItem(reviewKey(id)) || '[]'); }
  catch { return []; }
}
function saveReview(id, r) {
  const a = getReviews(id);
  a.unshift(r);
  localStorage.setItem(reviewKey(id), JSON.stringify(a.slice(0, 30)));
}
function reviewList(id) {
  const arr = getReviews(id);
  return arr.length ? arr.map(r => `
    <div class="voiceItem">
      <div class="voiceMeta">
        <span><b>${esc(r.name || '匿名')}</b> <span class="voiceStars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</span></span>
        <span>${esc(r.date)}</span>
      </div>
      <p>${esc(r.text)}</p>
    </div>
  `).join('') : `<div class="voiceItem"><p>まだクチコミはありません。最初のFAN VOICEを書いてみてください。</p></div>`;
}

function openGroup(id) {
  const g = DATA.groups.find(x => x.id === id);
  if (!g) return;

  const links = [['公式HP', g.official_hp], ['X', g.x], ['Instagram', g.instagram], ['TikTok', g.tiktok], ['YouTube', g.youtube]];
  const details = [
    ['デビュー日 / 活動開始', g.debut_date],
    ['メジャーデビュー', g.major_debut_date],
    ['芸能事務所 / 運営', g.agency],
    ['アイドルプロジェクト', g.project],
    ['レーベル', g.label],
    ['親会社 / 資本関係', g.parent],
    ['ライブ規模 / 実績', g.live_scale]
  ];

  $('#drawerContent').innerHTML = `
    <div class="artistHero">
      ${g.artist_image
        ? `<img loading="lazy" src="${esc(g.artist_image)}" alt="${esc(g.name)}">`
        : `<div class="artistFallback">HQ100から順次アー写追加予定</div>`
      }
    </div>
    <div class="detailFaction">${esc(g.faction)}</div>
    <h2>${esc(g.name)}</h2>
    <div class="badges">
      ${g.high_precision ? '<span class="badge hq">HQ 高精度</span>' : ''}
      <span class="badge">TIER ${esc(g.tier)}</span>
      <span class="badge">POWER ${g.power ?? '—'}</span>
      <span class="badge growth">GROWTH ${g.growth ?? '—'}</span>
    </div>

    <div class="detailGrid">
      ${details.map(([k,v]) => `
        <div class="detailBox ${k.includes('ライブ') ? 'wide' : ''}">
          <small>${k}</small>
          <b>${esc(v || '未確認')}</b>
        </div>
      `).join('')}
    </div>

    ${g.tier_reason ? `
      <div class="reasonBox">
        <small>評価根拠</small>
        <p>${esc(g.tier_reason)}</p>
      </div>` : ''}

    <h3>OFFICIAL LINKS</h3>
    <div class="socialGrid">
      ${links.map(([k,v]) => v
        ? `<a href="${esc(v)}" target="_blank" rel="noopener">${k}<span>↗</span></a>`
        : `<div class="socialOff">${k}<span>未確認</span></div>`
      ).join('')}
    </div>

    <h3>MEMBERS <small>${g.members.length}</small></h3>
    <div class="memberGrid">
      ${g.members.length
        ? g.members.map(m => `
            <div class="member">
              <b>${esc(m.name)}</b>
              <div class="memberSocials">
                ${[['X',m.x],['IG',m.instagram],['TikTok',m.tiktok],['YT',m.youtube]]
                  .filter(x => x[1])
                  .map(([k,v]) => `<a href="${esc(v)}" target="_blank" rel="noopener">${k} ↗</a>`).join('') || '<span style="font-size:8px;color:#899da6">SNS未確認</span>'}
              </div>
            </div>
          `).join('')
        : '<div class="detailBox wide">メンバー情報を再監査中</div>'}
    </div>

    <div class="voiceBox">
      <h3>FAN VOICE</h3>
      <p>このグループの魅力やライブの感想を書こう。</p>
      <div class="voiceForm">
        <input id="voiceName" placeholder="ニックネーム">
        <select id="voiceStars">
          <option value="5">★★★★★</option>
          <option value="4">★★★★☆</option>
          <option value="3">★★★☆☆</option>
          <option value="2">★★☆☆☆</option>
          <option value="1">★☆☆☆☆</option>
        </select>
        <textarea id="voiceText" placeholder="コメント"></textarea>
        <button id="voiceSubmit">投稿する</button>
      </div>
      <div class="voiceNotice">現在はこの端末内に保存される試験版です。次段階でGiscus / Supabaseへ移行可能。</div>
      <div id="voiceList" class="voiceList">${reviewList(g.id)}</div>
    </div>

    <h3>VERIFICATION</h3>
    <div class="detailBox">
      <small>状態 / 最終確認</small>
      <b>${esc(g.verification_status || 'unreviewed')} / ${esc(g.last_verified || DATA.as_of)}</b>
      <p style="font-size:9px;color:#78909d">${esc(g.verification_note || '')}</p>
      ${g.artist_image_source ? `<p style="font-size:9px;color:#78909d">アー写出典: <a href="${esc(g.artist_image_source)}" target="_blank" rel="noopener">${esc(g.artist_image_source)}</a></p>` : ''}
    </div>

    <h3>SOURCES</h3>
    <div class="sources">${(g.sources || []).map(u => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u)}</a>`).join('') || '未確認'}</div>
  `;

  $('#drawer').classList.add('open');
  $('#voiceSubmit').onclick = () => {
    const text = $('#voiceText').value.trim();
    if (!text) return;
    saveReview(g.id, {
      name: $('#voiceName').value.trim() || '匿名',
      stars: Number($('#voiceStars').value),
      text,
      date: new Date().toLocaleDateString('ja-JP')
    });
    $('#voiceText').value = '';
    $('#voiceList').innerHTML = reviewList(g.id);
  };
}

function closeDrawer() {
  $('#drawer').classList.remove('open');
}

function bind() {
  if ($('#quickSearch')) $('#quickSearch').oninput = renderQuickSearch;
  if ($('#openDatabaseBtn')) $('#openDatabaseBtn').onclick = () => switchTab('database');

  $$('.navBtn').forEach(b => b.onclick = () => switchTab(b.dataset.tab));
  const brandLink = $('[data-tab-link="discover"]');
  if (brandLink) brandLink.onclick = e => { e.preventDefault(); switchTab('discover'); };

  $('#drawerClose').onclick = closeDrawer;
  $('#shade').onclick = closeDrawer;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  $('#dbSearch').oninput = e => { state.dbQ = e.target.value; renderDatabase(); };
  $('#dbSort').onchange = e => { state.dbSort = e.target.value; renderDatabase(); };

  $('#tierChips').onclick = e => {
    const b = e.target.closest('[data-tier]');
    if (!b) return;
    state.dbTier = b.dataset.tier;
    $('#tierChips').querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x === b));
    renderDatabase();
  };

  $('#factionChips').onclick = e => {
    const b = e.target.closest('[data-faction]');
    if (!b) return;
    state.dbFaction = b.dataset.faction;
    $('#factionChips').querySelectorAll('.chip').forEach(x => x.classList.toggle('active', x === b));
    renderDatabase();
  };

  $('#mapSearch').oninput = e => { state.mapQ = e.target.value; renderMap(); };
  $('#mapFaction').onchange = e => { state.mapFaction = e.target.value; renderMap(); };
}

async function boot() {
  await load();
  renderStats();
  renderMV();
  buildControls();
  bind();
  renderQuickSearch();
  renderDatabase();
  renderRankings();
}

boot().catch(e => {
  console.error(e);
  document.body.insertAdjacentHTML(
    'beforeend',
    '<div style="position:fixed;bottom:15px;left:15px;right:15px;padding:15px;background:#173447;color:white;border-radius:12px;z-index:99">データ読み込みエラー。data.json / hq56.json / app.js を確認してください。</div>'
  );
});

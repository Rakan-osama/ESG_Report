/* ═══════════════════════════════════════════════════════════════════════════
   ESG OS v14 — 5 · FRAMEWORK — rendering primitives
   Extracted verbatim from the single-file build. Classic script: LOAD ORDER
   IS SIGNIFICANT — see the <script> tags in the entry HTML.
   ═══════════════════════════════════════════════════════════════════════════ */
/* ════════════ 5 · FRAMEWORK — rendering primitives ════════════ */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function toast(m){const el=$('#toast');el.textContent=m;el.style.display='block';clearTimeout(el._t);el._t=setTimeout(()=>el.style.display='none',2600)}
function audit(a,o,d){D.audit.unshift({w:new Date().toISOString().slice(0,16).replace('T',' '),u:roleName(),a,o,d});}
function roleName(){const r=ROLES.find(r=>r.id===ROLE);return (LANG==='ar'?r.ar:r.en).split('·')[0].trim()}
function st(s,label){const map={COMPLETE:'approved',UNDER_REVIEW:'review',IN_COLLECTION:'progress',REQUESTED:'submitted',PLANNED:'draft',BLOCKED:'blocked',awaiting_verification:'review'};const cls=map[s]||s;return `<span class="st ${cls}">${esc(label||s.replace(/_/g,' '))}</span>`}
function pv(kind,txt,link){const icon={reuse:'🔗',calc:'ƒx',der:'⚙',lock:'🔒',ret:'↩'}[kind]||'';return `<span class="pv ${kind}">${icon} ${esc(txt)}${link?` · <a href="${link}">${kind==='calc'?t('viewCalc'):t('openSrc')}</a>`:''}</span>`}
function tile(v,l,cls,go,tr){
 const trend=tr?` <span class="trend ${tr.d}">${tr.d==='up'?'↗':'↘'} ${esc(tr.v)}</span>`:'';
 return `<div class="tile ${cls||''} ${go?'drill':''}" ${go?`onclick="nav('${go}')"`:''}>`+
  `<span class="kb" data-noar onclick="event.stopPropagation();tileMenu('${esc(l).replace(/'/g,'&#39;')}',${go?`'${go}'`:'null'})">⋮</span>`+
  `<div class="l">${esc(l)}</div><div class="v">${v}${trend}</div></div>`}
function sect(en,ar,sub){return `<div class="full" style="margin:8px 0 -4px;padding-top:8px;border-top:1px solid var(--line);font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mut)">${LANG==='ar'&&ar?ar:en}${sub?` <span style="font-weight:500;letter-spacing:0;text-transform:none">· ${sub}</span>`:''}</div>`}
function field(o){ // o:{label,gri,req,type,value,opts,help,unit,pv,err,ro,ph}
 let ctrl='';
 if(o.pv){ctrl=`<div class="ro">${esc(o.value??'')} &nbsp;${pv(o.pv.k,o.pv.t,o.pv.l)}</div>`}
 else if(o.ro){ctrl=`<div class="ro">${esc(o.value??'—')}</div>`}
 else if(o.type==='select'){ctrl=`<select ${o.id?`id="${o.id}"`:''}>${(o.opts||[]).map(x=>`<option ${x===o.value?'selected':''}>${esc(x)}</option>`).join('')}</select>`}
 else if(o.type==='area'){ctrl=`<textarea rows="3" ${o.id?`id="${o.id}"`:''} placeholder="${esc(o.ph||'')}">${esc(o.value||'')}</textarea>`}
 else if(o.unit){ctrl=`<div class="inline"><input ${o.id?`id="${o.id}"`:''} value="${esc(o.value||'')}" placeholder="${esc(o.ph||'')}"><select class="unit">${o.unit.map(u=>`<option>${u}</option>`).join('')}</select></div>`}
 else{ctrl=`<input type="${o.type||'text'}" ${o.id?`id="${o.id}"`:''} value="${esc(o.value||'')}" placeholder="${esc(o.ph||'')}">`}
 return `<div class="f ${o.full?'full':''}"><label>${esc(o.label)}${o.req?' <span class="req">*</span>':''}${o.gri?`<span class="gri">GRI ${o.gri}</span>`:''}</label>${ctrl}${o.err?`<div class="err">${esc(o.err)}</div>`:''}${o.help?`<div class="help">${esc(o.help)}</div>`:''}</div>`
}
function drawer(title,body,foot){$('#ovl').style.display='block';const d=$('#drawer');d.style.display='flex';
 d.innerHTML=`<div class="dh"><h2>${title}</h2><button class="x" onclick="closeDrawer()">✕</button></div><div class="db">${body}</div><div class="df">${foot||`<button class="btn sec" onclick="closeDrawer()">${t('cancel')}</button><button class="btn" onclick="closeDrawer();toast('Saved (prototype)')">${t('save')}</button>`}</div>`}
function closeDrawer(){$('#ovl').style.display='none';$('#drawer').style.display='none'}
function pageHead(title,purpose,actions,crumb){
 let c='';
 if(crumb){const parts=String(crumb).split('›').map(s=>s.trim()).filter(Boolean);
  c=`<div class="crumb"><a class="hm" href="#/home">🏠</a>`+parts.map((p,i)=>`<span class="sep">›</span><span class="${i===parts.length-1?'curr':''}">${esc(p)}</span>`).join('')+`</div>`;}
 return c+`<div class="pageHead"><div><h1>${esc(title)}</h1><div class="purpose">${purpose||''}</div></div><div class="actions">${actions||''}</div></div>`}
function toolbar(extra){return `<div class="toolbar"><input type="search" placeholder="${t('search')}" oninput="toast('Filtering (prototype)')"><select><option>${LANG==='ar'?'كل الحالات':'All statuses'}</option><option>Draft</option><option>Submitted</option><option>Approved</option><option>Returned</option></select>${extra||''}<span class="spacer"></span><button class="btn sec" onclick="toast('XLSX export recorded: version, user, timestamp')">⬇ ${t('export')}</button></div>`}
function pager(n){return `<div class="pager"><button>‹</button><span>1–${n} / ${n}</span><button>›</button></div>`}


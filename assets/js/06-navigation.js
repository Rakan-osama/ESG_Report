/* ═══════════════════════════════════════════════════════════════════════════
   ESG OS v14 — 6 · NAVIGATION & SHELL
   Extracted verbatim from the single-file build. Classic script: LOAD ORDER
   IS SIGNIFICANT — see the <script> tags in the entry HTML.
   ═══════════════════════════════════════════════════════════════════════════ */
    /* ════════════ 6 · NAVIGATION & SHELL ════════════ */
    function nav(route) { location.hash = '#/' + route }
    let CUR = 'home';
    const VIEWS = {};
    VIEWS['login'] = () => `<div class="authWrap"><div class="halo"></div>
 <div class="authTop"><div class="sbLogo" style="padding:0"><div class="globe"></div><div class="wm"><b>ENERGYUP</b><span>INTERNATIONAL</span></div></div>
 <button class="langPill" onclick="LANG=LANG==='en'?'ar':'en';render()">🌐 ${LANG === 'ar' ? 'العربية' : 'English'} ▾</button></div>
 <div class="authBody">
  <h1>${LANG === 'ar' ? 'مرحبًا بعودتك! 👋' : 'Welcome Back! 👋'}</h1>
  <div class="sub">${LANG === 'ar' ? 'من فضلك أدخل بياناتك.' : 'Welcome back! Please enter your details.'}</div>
  <div class="f"><label>${LANG === 'ar' ? 'اسم المستخدم' : 'Username'}</label><input placeholder="${LANG === 'ar' ? 'أدخل اسمك' : 'Enter your name'}" value=""></div>
  <div class="f"><label>${LANG === 'ar' ? 'الدور' : 'Role'}</label><select id="loginRole">${ROLES.map(r => `<option value="${r.id}">${LANG === 'ar' ? r.ar : r.en}</option>`).join('')}</select></div>
  <div class="f"><label>${LANG === 'ar' ? 'كلمة المرور' : 'Password'}</label><input type="password" value="••••••••"></div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin:6px 0 18px;font-size:13px"><label style="display:flex;gap:7px;align-items:center;color:var(--ink2)"><input type="checkbox" style="width:auto"> ${LANG === 'ar' ? 'تذكرني 30 يومًا' : 'Remember for 30 days'}</label><a>${LANG === 'ar' ? 'نسيت كلمة المرور' : 'Forgot password'}</a></div>
  <button class="authBtn" onclick="ROLE=document.getElementById('loginRole').value;location.hash=ROLE==='ASSUR'?'#/asr/aeng':'#/home';render()">${LANG === 'ar' ? 'تسجيل الدخول' : 'Sign in'}</button>
  <div style="display:flex;align-items:center;gap:12px;margin:18px 0;color:var(--mut);font-size:12.5px"><span style="flex:1;height:1px;background:var(--line)"></span>${LANG === 'ar' ? 'أو تابع عبر' : 'Or continue with'}<span style="flex:1;height:1px;background:var(--line)"></span></div>
  <button class="authBtn" style="background:#fff;color:var(--ink);border:1px solid var(--bd)" onclick="toast('SSO (prototype)')">${LANG === 'ar' ? 'الدخول عبر SSO' : 'Sign In with SSO'}</button>
 </div></div>`;
    function render() {
      CUR = (location.hash || '#/home').slice(2) || 'home';
      if (ROLE === 'ASSUR' && !CUR.startsWith('asr/')) CUR = 'asr/aeng';
      document.documentElement.dir = LANG === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = LANG;
      $('#cyclePill').textContent = `${D.cycle.code} · ${D.cycle.phase} (${D.cycle.phaseNo}/8)`;
      $('#userTag').textContent = roleName(); var __r = ROLES.find(r => r.id === ROLE); $('#avIni').childNodes[0].nodeValue = roleName().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(); $('#userMail').textContent = (ROLE.toLowerCase()) + '@energyup.example';
      document.querySelector('[data-i=demoTag]').textContent = t('demoTag');
      renderSidebar();
      if (CUR === 'login') { $('#main').innerHTML = VIEWS['login'](); return }
      const v = VIEWS[CUR] || VIEWS['home'];
      $('#main').innerHTML = v();
      $('#main').scrollTop = 0;
    }
    window.addEventListener('hashchange', render);


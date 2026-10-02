// ============================================================================
// ÖĞRETİM DÜZENİ (Normal / İkili Öğretim) KATMANI
// ----------------------------------------------------------------------------
// Bu dosya app.js'den ÖNCE yüklenir; app.js içindeki küçük "kanca" (hook)
// çağrılarıyla çalışır.
//
// MANTIK
//   - appConfig.schoolMode : 'single' (Normal / Tekli)  |  'dual' (İkili)
//   - Normal öğretimde HİÇBİR şey değişmez: eski veri alanları aynen kullanılır.
//   - İkili öğretimde "sabaha" ve "öğleye" ait veriler appConfig.shiftData
//     içinde ayrı tutulur:
//         bellHours, weeklyClassSchedules, weeklyDuties, aylikNobet, classes
//   - Pano kodunun geri kalanı bu alanları appConfig.bellHours,
//     appConfig.weeklyClassSchedules ... üzerinden okuduğu için, o an aktif olan
//     öğretimin verisi bu "canlı" alanlara yüklenir (shiftLoadLive) ve kayıttan
//     önce geri yazılır (shiftStashLive). Böylece eski kodun tamamı değişmeden
//     çalışır.
//   - Hangi öğretimin gösterileceği: saate göre otomatik (geçiş saati ayarlı),
//     ya da elle sabit. Ayrıca adrese  ?ogretim=sabah  /  ?ogretim=ogle
//     eklenerek bir ekran belirli bir öğretime sabitlenebilir.
// ============================================================================

const SHIFT_IDS = ['morning', 'afternoon'];
let currentShift = 'morning';

// Sabit öğretim (adres parametresi) — örn. pano49.html?ekran=1&ogretim=ogle
const SHIFT_PIN = (function () {
    const v = (new URLSearchParams(window.location.search).get('ogretim') || '').toLowerCase();
    if (['sabah', 'morning', '1'].includes(v)) return 'morning';
    if (['ogle', 'öğle', 'afternoon', '2'].includes(v)) return 'afternoon';
    return null;
})();

const SHIFT_DEFAULT_SETTINGS = {
    autoSwitch: true,          // true: saate göre otomatik geçiş
    switchTime: '13:00',       // bu saatten itibaren "öğle öğretimi" gösterilir
    manualShift: 'morning',    // autoSwitch=false iken sabit gösterilen öğretim
    labels: { morning: 'SABAH ÖĞRETİMİ', afternoon: 'ÖĞLE ÖĞRETİMİ' },
    filterBirthdays: true,     // doğum günleri sınıfın öğretimine göre süzülsün
    showBadge: true            // pano başlığında öğretim rozeti görünsün
};

const SHIFT_COLORS = { morning: '#ffb703', afternoon: '#a78bfa' };
const SHIFT_ICONS = { morning: '☀️', afternoon: '🌤️' };

// ---------------------------------------------------------------------------
// Yardımcılar
// ---------------------------------------------------------------------------
function shiftIsDual() {
    return typeof appConfig !== 'undefined' && appConfig && appConfig.schoolMode === 'dual';
}

function shiftGetSettings() {
    const s = (appConfig && appConfig.shiftSettings) || {};
    return {
        ...SHIFT_DEFAULT_SETTINGS,
        ...s,
        labels: { ...SHIFT_DEFAULT_SETTINGS.labels, ...(s.labels || {}) }
    };
}

function shiftLabel(id) {
    return shiftGetSettings().labels[id] || (id === 'morning' ? 'SABAH ÖĞRETİMİ' : 'ÖĞLE ÖĞRETİMİ');
}

function shiftShortLabel(id) {
    return (shiftLabel(id).split(' ')[0] || '').trim();
}

function shiftTimeToMinutes(str) {
    const m = /^(\d{1,2}):(\d{2})$/.exec((str || '').trim());
    if (!m) return null;
    return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

function shiftAddMinutes(timeStr, minutes) {
    const t = shiftTimeToMinutes(timeStr);
    const total = ((t === null ? 480 : t) + minutes + 1440) % 1440;
    return String(Math.floor(total / 60)).padStart(2, '0') + ':' + String(total % 60).padStart(2, '0');
}

// startTime'dan başlayan, count adet 40 dk ders + 10 dk teneffüslü zil listesi üretir
function shiftBuildBells(startTime, count) {
    const out = [];
    let cur = startTime;
    for (let i = 1; i <= count; i++) {
        const end = shiftAddMinutes(cur, 40);
        out.push({ id: i, start: cur, end: end });
        cur = shiftAddMinutes(end, 10);
    }
    return out;
}

function shiftDefaultClasses(id) {
    return classList.filter(c => id === 'morning' ? (c.startsWith('1/') || c.startsWith('2/')) : (c.startsWith('3/') || c.startsWith('4/')));
}

function shiftEmptyDuties() {
    const d = {};
    daysOfWeek.forEach(day => { d[day] = {}; });
    return d;
}

// ---------------------------------------------------------------------------
// Hangi öğretim şu an gösterilmeli?
// ---------------------------------------------------------------------------
function shiftComputeDesired(now) {
    if (SHIFT_PIN) return SHIFT_PIN;
    const st = shiftGetSettings();
    if (!st.autoSwitch) return st.manualShift === 'afternoon' ? 'afternoon' : 'morning';
    const sw = shiftTimeToMinutes(st.switchTime);
    const nowMin = now.getHours() * 60 + now.getMinutes();
    return (sw !== null && nowMin >= sw) ? 'afternoon' : 'morning';
}

// ---------------------------------------------------------------------------
// Veri katmanı: canlı alanlar <-> shiftData
// ---------------------------------------------------------------------------
function shiftEnsureData() {
    if (!appConfig.shiftData || typeof appConfig.shiftData !== 'object') appConfig.shiftData = {};
    const sd = appConfig.shiftData;

    if (!sd.morning) {
        // İlk kez ikili öğretime geçiş: mevcut (tekli) program/nöbet verileri SABAH'a taşınır,
        // zil saatleri ders sayısı korunarak ikili öğretime uygun şekilde yeniden üretilir.
        const lessonCount = Math.max(1, (appConfig.bellHours || bellHours || []).length || 6);
        sd.morning = {
            bellHours: shiftBuildBells('08:00', lessonCount),
            weeklyClassSchedules: appConfig.weeklyClassSchedules || {},
            weeklyDuties: appConfig.weeklyDuties || shiftEmptyDuties(),
            aylikNobet: appConfig.aylikNobet || {},
            classes: shiftDefaultClasses('morning')
        };
    }
    if (!sd.afternoon) {
        const lessonCount = Math.max(1, (sd.morning.bellHours || []).length || 6);
        sd.afternoon = {
            bellHours: shiftBuildBells('13:00', lessonCount),
            weeklyClassSchedules: {},
            weeklyDuties: shiftEmptyDuties(),
            aylikNobet: {},
            classes: shiftDefaultClasses('afternoon')
        };
    }
    SHIFT_IDS.forEach(id => {
        const s = sd[id];
        if (!Array.isArray(s.bellHours) || s.bellHours.length === 0) s.bellHours = shiftBuildBells(id === 'morning' ? '08:00' : '13:00', 6);
        if (!s.weeklyClassSchedules) s.weeklyClassSchedules = {};
        if (!s.weeklyDuties) s.weeklyDuties = shiftEmptyDuties();
        if (!s.aylikNobet) s.aylikNobet = {};
        if (!Array.isArray(s.classes)) s.classes = shiftDefaultClasses(id);
    });
}

function shiftLoadLive(id) {
    shiftEnsureData();
    const s = appConfig.shiftData[id];
    appConfig.bellHours = s.bellHours;
    bellHours = appConfig.bellHours;
    appConfig.weeklyClassSchedules = s.weeklyClassSchedules;
    appConfig.weeklyDuties = s.weeklyDuties;
    appConfig.aylikNobet = s.aylikNobet;
    currentShift = id;
}

function shiftStashLive() {
    if (!shiftIsDual() || !appConfig.shiftData || !appConfig.shiftData[currentShift]) return;
    const s = appConfig.shiftData[currentShift];
    s.bellHours = bellHours;                       // global bellHours, yönetim panelinde asıl kaynaktır
    s.weeklyClassSchedules = appConfig.weeklyClassSchedules || {};
    s.weeklyDuties = appConfig.weeklyDuties || {};
    s.aylikNobet = appConfig.aylikNobet || {};
    appConfig.bellHours = bellHours;
}

function shiftSwitchTo(id) {
    if (!shiftIsDual()) return;
    shiftStashLive();
    shiftLoadLive(id);
}

// Sayfa açılışında (app.js, config yüklendikten hemen sonra) çağrılır
function shiftInit() {
    appConfig.shiftSettings = shiftGetSettings();
    if (appConfig.schoolMode !== 'dual') {
        appConfig.schoolMode = 'single';
        return;
    }
    shiftEnsureData();
    shiftLoadLive(shiftComputeDesired(new Date()));
}

// Her saniye çağrılır (app.js zamanlayıcısından)
function shiftTick(now) {
    if (!shiftIsDual()) return;
    const adminPanel = document.getElementById('admin-panel');
    if (adminPanel && !adminPanel.classList.contains('hidden')) return; // düzenleme sırasında otomatik geçiş yapma
    const desired = shiftComputeDesired(now || new Date());
    if (desired !== currentShift) {
        shiftSwitchTo(desired);
        if (typeof renderPanoData === 'function') renderPanoData();
        if (typeof writeCMSLog === 'function') writeCMSLog('Öğretim değişti: ' + shiftLabel(desired));
    }
}

// ---------------------------------------------------------------------------
// Pano tarafı süzgeçleri
// ---------------------------------------------------------------------------
// Hangi sınıflar şu an panoda gösterilecek?
function shiftDisplayClasses() {
    if (!shiftIsDual()) return classList.slice();
    shiftEnsureData();
    const own = appConfig.shiftData[currentShift].classes || [];
    return classList.filter(c => own.includes(c));
}

// Yönetim panelindeki ders programı sınıf seçici için sınıflar
function shiftAdminClassList() {
    if (!shiftIsDual()) return classList;
    const l = shiftDisplayClasses();
    return l.length ? l : classList;
}

// Duyuru / kayan yazı öğeleri: item.shift = 'all' (varsayılan) | 'morning' | 'afternoon'
function shiftFilterItems(list) {
    const arr = Array.isArray(list) ? list : [];
    if (!shiftIsDual()) return arr;
    return arr.filter(it => {
        const t = it && it.shift;
        return !t || t === 'all' || t === currentShift;
    });
}

// Doğum günleri: öğrencinin sınıfı hangi öğretimdeyse yalnızca o öğretimde görünür
function shiftFilterBirthdays(list) {
    const arr = Array.isArray(list) ? list : [];
    if (!shiftIsDual() || !shiftGetSettings().filterBirthdays) return arr;
    shiftEnsureData();
    const mine = appConfig.shiftData[currentShift].classes || [];
    const other = appConfig.shiftData[currentShift === 'morning' ? 'afternoon' : 'morning'].classes || [];
    return arr.filter(b => {
        const c = b && b.class;
        if (!c) return true;
        if (mine.includes(c)) return true;
        return !other.includes(c); // hiçbir öğretime atanmamış sınıf -> her zaman göster
    });
}

// Ders programı kartı için sınıfları 3-4 ve 1-2 gruplarına böler
function shiftScheduleGroups() {
    const base = shiftDisplayClasses();
    return {
        g1: base.filter(c => c.startsWith('3/') || c.startsWith('4/')),
        g2: base.filter(c => c.startsWith('1/') || c.startsWith('2/'))
    };
}

function shiftGradeTitle(classes) {
    const grades = [...new Set(classes.map(c => c.split('/')[0]))].sort();
    if (grades.length === 0) return 'DERS PROGRAMI';
    return 'DERS PROGRAMI (' + grades.map(g => g + '.').join(' VE ') + ' SINIFLAR)';
}

// Pano başlığındaki öğretim rozeti
function shiftRenderBadge() {
    const el = document.getElementById('shift-badge');
    if (!el) return;
    const st = shiftGetSettings();
    if (!shiftIsDual() || !st.showBadge) {
        el.style.display = 'none';
        return;
    }
    const color = SHIFT_COLORS[currentShift];
    el.style.display = '';
    el.style.color = color;
    el.style.background = color + '1f';
    el.textContent = SHIFT_ICONS[currentShift] + ' ' + shiftLabel(currentShift);
}

// ---------------------------------------------------------------------------
// YÖNETİM PANELİ
// ---------------------------------------------------------------------------
function shiftAdminSwitchHtmlRefresh() {
    const box = document.getElementById('shift-edit-switcher');
    if (!box) return;
    if (!shiftIsDual()) {
        box.classList.add('hidden');
        document.querySelectorAll('.shift-edit-label').forEach(e => e.remove());
        return;
    }
    box.classList.remove('hidden');
    SHIFT_IDS.forEach(id => {
        const btn = document.getElementById('shift-edit-btn-' + id);
        if (!btn) return;
        const active = currentShift === id;
        btn.className = 'flex-1 px-2 py-2 rounded-lg text-[11px] font-bold transition border ' +
            (active
                ? 'bg-yellow-500 text-black border-yellow-400 shadow-lg shadow-yellow-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800');
        btn.textContent = SHIFT_ICONS[id] + ' ' + shiftShortLabel(id);
    });
    const info = document.getElementById('shift-edit-info');
    if (info) info.textContent = 'Zil saatleri, ders programı ve nöbet listesi şu an "' + shiftLabel(currentShift) + '" için düzenleniyor.';

    // İlgili sekme başlıklarına düzenlenen öğretimi yaz
    ['tab-schedule', 'tab-hours', 'tab-duties'].forEach(tabId => {
        const tab = document.getElementById(tabId);
        const h2 = tab && tab.querySelector('h2');
        if (!h2) return;
        let tag = h2.querySelector('.shift-edit-label');
        if (!tag) {
            tag = document.createElement('span');
            tag.className = 'shift-edit-label ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold border';
            h2.appendChild(tag);
        }
        const c = SHIFT_COLORS[currentShift];
        tag.style.color = c;
        tag.style.borderColor = c + '66';
        tag.style.background = c + '1f';
        tag.textContent = SHIFT_ICONS[currentShift] + ' ' + shiftLabel(currentShift);
    });
}

function shiftAdminRebuildSections() {
    const cl = shiftAdminClassList();
    if (!cl.includes(activeAdminEditClass)) activeAdminEditClass = cl[0] || activeAdminEditClass;
    buildAdminBellHoursInputs();
    buildAdminClassSelector();
    buildWeeklyScheduleMatrix();
    buildAylikNobetTablosu();
    shiftAdminSwitchHtmlRefresh();
    shiftAdminBuildTab();
}

// Yönetim paneli açılırken çağrılır
function shiftAdminOpen() {
    shiftAdminBuildTab();
    shiftAdminSwitchHtmlRefresh();
    if (shiftIsDual()) {
        const cl = shiftAdminClassList();
        if (!cl.includes(activeAdminEditClass)) {
            activeAdminEditClass = cl[0] || activeAdminEditClass;
            buildAdminClassSelector();
            buildWeeklyScheduleMatrix();
        } else {
            buildAdminClassSelector();
        }
    }
}

// Düzenlenen öğretimi değiştir (sidebar'daki Sabah / Öğle düğmeleri)
function shiftAdminSwitch(id) {
    if (!shiftIsDual() || id === currentShift) return;
    // Mevcut öğretimin ekrandaki değişikliklerini önce belleğe yaz
    saveBellHoursFromInputs();
    appConfig.bellHours = bellHours;
    saveWeeklyScheduleMatrix();
    nobetAyiKaydet();
    shiftSwitchTo(id);
    shiftAdminRebuildSections();
    if (typeof renderPanoData === 'function') renderPanoData();
    writeCMSLog('Düzenlenen öğretim: ' + shiftLabel(id));
}

// --- "Öğretim Düzeni" sekmesi -------------------------------------------------
function shiftAdminBuildTab() {
    const host = document.getElementById('shift-tab-body');
    if (!host) return;
    const dual = shiftIsDual();
    const st = shiftGetSettings();
    if (dual) shiftEnsureData();

    const classRows = classList.map(cls => {
        const inMorning = dual ? appConfig.shiftData.morning.classes.includes(cls) : shiftDefaultClasses('morning').includes(cls);
        const inAfternoon = dual ? appConfig.shiftData.afternoon.classes.includes(cls) : shiftDefaultClasses('afternoon').includes(cls);
        const val = inMorning ? 'morning' : (inAfternoon ? 'afternoon' : 'none');
        const opt = (v, txt) => `
            <label class="flex-1 text-center cursor-pointer">
                <input type="radio" class="hidden peer" name="shiftcls_${cls.replace('/', '_')}" data-cls="${cls}" value="${v}" ${val === v ? 'checked' : ''}>
                <span class="block px-2 py-1 rounded text-[10px] font-bold border border-slate-800 bg-slate-900 text-slate-500 peer-checked:bg-cyan-600 peer-checked:text-white peer-checked:border-cyan-400">${txt}</span>
            </label>`;
        return `
            <div class="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-2">
                <span class="w-10 text-xs font-bold text-yellow-400">${cls}</span>
                <div class="flex gap-1 flex-1">${opt('morning', 'Sabah')}${opt('afternoon', 'Öğle')}${opt('none', 'Yok')}</div>
            </div>`;
    }).join('');

    host.innerHTML = `
        <div class="grid grid-cols-2 gap-4">
            <label class="cursor-pointer">
                <input type="radio" class="hidden peer" name="shift-mode" value="single" ${dual ? '' : 'checked'} onchange="shiftAdminToggleDualBox()">
                <div class="p-4 rounded-xl border border-slate-800 bg-slate-950 peer-checked:border-cyan-400 peer-checked:bg-cyan-500/10 transition h-full">
                    <div class="text-white font-bold text-sm flex items-center gap-2"><i class="fa-solid fa-sun text-yellow-400"></i> Normal (Tekli) Öğretim</div>
                    <p class="text-[11px] text-slate-400 mt-1">Tüm sınıflar aynı saatlerde, tek ders programı ve tek nöbet listesi. Pano eskisi gibi çalışır.</p>
                </div>
            </label>
            <label class="cursor-pointer">
                <input type="radio" class="hidden peer" name="shift-mode" value="dual" ${dual ? 'checked' : ''} onchange="shiftAdminToggleDualBox()">
                <div class="p-4 rounded-xl border border-slate-800 bg-slate-950 peer-checked:border-cyan-400 peer-checked:bg-cyan-500/10 transition h-full">
                    <div class="text-white font-bold text-sm flex items-center gap-2"><i class="fa-solid fa-repeat text-violet-400"></i> İkili Öğretim (Sabah / Öğle)</div>
                    <p class="text-[11px] text-slate-400 mt-1">Sabah ve öğle grubunun zil saatleri, ders programı, nöbetçileri ve sınıfları ayrı tutulur; pano saate göre kendiliğinden geçiş yapar.</p>
                </div>
            </label>
        </div>

        <div id="shift-dual-box" class="${dual ? '' : 'hidden'} space-y-4">
            <div class="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h3 class="text-white font-bold text-sm flex items-center gap-2"><i class="fa-solid fa-clock text-cyan-400"></i> Geçiş Ayarları</h3>
                <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input type="checkbox" id="shift-auto" class="accent-cyan-500" ${st.autoSwitch ? 'checked' : ''} onchange="shiftAdminToggleAutoBox()">
                    Saate göre otomatik geçiş yap
                </label>
                <div id="shift-auto-box" class="${st.autoSwitch ? '' : 'hidden'} flex items-center gap-3">
                    <label class="text-[11px] text-slate-400">Bu saatten itibaren öğle öğretimi gösterilsin:</label>
                    <input type="text" id="shift-switch-time" value="${st.switchTime}" placeholder="13:00" maxlength="5" class="w-20 bg-slate-900 border border-slate-800 rounded p-1.5 text-center text-xs text-white">
                    <span class="text-[10px] text-slate-500">(SS:DD) — bu saatten önce sabah, sonra öğle öğretimi görünür</span>
                </div>
                <div id="shift-manual-box" class="${st.autoSwitch ? 'hidden' : ''} flex items-center gap-3">
                    <label class="text-[11px] text-slate-400">Sabit gösterilecek öğretim:</label>
                    <select id="shift-manual" class="bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white">
                        <option value="morning" ${st.manualShift === 'morning' ? 'selected' : ''}>Sabah öğretimi</option>
                        <option value="afternoon" ${st.manualShift === 'afternoon' ? 'selected' : ''}>Öğle öğretimi</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[10px] text-slate-500 block mb-1">Sabah grubunun adı</label>
                        <input type="text" id="shift-label-morning" value="${escapeHtml(st.labels.morning)}" class="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white">
                    </div>
                    <div>
                        <label class="text-[10px] text-slate-500 block mb-1">Öğle grubunun adı</label>
                        <input type="text" id="shift-label-afternoon" value="${escapeHtml(st.labels.afternoon)}" class="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white">
                    </div>
                </div>
                <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input type="checkbox" id="shift-show-badge" class="accent-cyan-500" ${st.showBadge ? 'checked' : ''}>
                    Pano başlığında aktif öğretim rozeti (☀️ SABAH ÖĞRETİMİ) görünsün
                </label>
                <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input type="checkbox" id="shift-filter-bday" class="accent-cyan-500" ${st.filterBirthdays ? 'checked' : ''}>
                    Doğum günleri öğrencinin öğretimine göre gösterilsin (sınıfı o öğretimde olanlar)
                </label>
            </div>

            <div class="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h3 class="text-white font-bold text-sm flex items-center gap-2"><i class="fa-solid fa-people-group text-yellow-400"></i> Sınıfların Öğretimi</h3>
                <p class="text-[10px] text-slate-500">Her sınıfın sabah mı öğle mi okuduğunu seçin. Ders programı kartında her öğretimde yalnızca o öğretimin sınıfları görünür.</p>
                <div class="grid grid-cols-4 gap-2">${classRows}</div>
            </div>

            <div class="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-4 text-[11px] text-slate-300 space-y-1.5">
                <div class="font-bold text-cyan-400"><i class="fa-solid fa-circle-info"></i> Hangi alanlar ayrı, hangileri ortak?</div>
                <div><b class="text-white">Sabah / Öğle ayrı:</b> Günlük zil saatleri, sınıfların ders programı, haftalık ve aylık nöbet listesi, sınıf listesi, doğum günleri (sınıfa göre). Duyurular ve kayan yazılar için her öğeye "Sabah / Öğle / Her ikisi" hedefi seçilir.</div>
                <div><b class="text-white">Ortak:</b> Okul adı, logo, tema ve yerleşim, medya listesi, günün sözü, belirli günler, başarı panosu, nöbetçi kadrosu (fotoğraflar) ve nöbet yerleri.</div>
                <div>Soldaki <b class="text-yellow-400">Sabah / Öğle</b> düğmeleriyle hangi öğretimi düzenlediğinizi seçersiniz. Bir ekranı belirli bir öğretime sabitlemek için adrese <code class="text-yellow-300">&amp;ogretim=sabah</code> veya <code class="text-yellow-300">&amp;ogretim=ogle</code> ekleyin.</div>
                <div class="text-slate-400">Normal öğretime geri dönerseniz, o an düzenlediğiniz öğretimin verileri tekli veri olarak kullanılır; diğer öğretimin verisi saklanır.</div>
            </div>

            <div class="text-xs text-slate-400">Şu an panoda gösterilen: <b id="shift-now-label" class="text-yellow-400">${shiftIsDual() ? shiftLabel(currentShift) : '-'}</b></div>
        </div>

        <div class="flex items-center gap-3">
            <button type="button" onclick="shiftAdminApplyNow()" class="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-xs flex items-center gap-2">
                <i class="fa-solid fa-check"></i> Düzeni Uygula
            </button>
            <span class="text-[10px] text-slate-500">Uyguladıktan sonra sol menüde Sabah / Öğle düğmeleri belirir. Kalıcı olması için üstteki <b>Kaydet</b> veya <b>Yayınla</b>'ya basın.</span>
        </div>
    `;
}

function shiftAdminToggleDualBox() {
    const dual = (document.querySelector('input[name="shift-mode"]:checked') || {}).value === 'dual';
    const box = document.getElementById('shift-dual-box');
    if (box) box.classList.toggle('hidden', !dual);
}

function shiftAdminToggleAutoBox() {
    const auto = document.getElementById('shift-auto').checked;
    document.getElementById('shift-auto-box').classList.toggle('hidden', !auto);
    document.getElementById('shift-manual-box').classList.toggle('hidden', auto);
}

// Formdaki öğretim ayarlarını okuyup appConfig'e uygular. Kaydet düğmesi de bunu çağırır.
function shiftAdminCollect() {
    const modeEl = document.querySelector('input[name="shift-mode"]:checked');
    if (!modeEl) return; // sekme hiç oluşturulmadıysa dokunma
    const wantDual = modeEl.value === 'dual';
    const wasDual = shiftIsDual();

    if (wantDual) {
        const timeVal = (document.getElementById('shift-switch-time').value || '').trim();
        const st = shiftGetSettings();
        appConfig.shiftSettings = {
            ...st,
            autoSwitch: document.getElementById('shift-auto').checked,
            switchTime: shiftTimeToMinutes(timeVal) !== null ? timeVal.padStart(5, '0') : SHIFT_DEFAULT_SETTINGS.switchTime,
            manualShift: document.getElementById('shift-manual').value === 'afternoon' ? 'afternoon' : 'morning',
            labels: {
                morning: (document.getElementById('shift-label-morning').value || '').trim() || SHIFT_DEFAULT_SETTINGS.labels.morning,
                afternoon: (document.getElementById('shift-label-afternoon').value || '').trim() || SHIFT_DEFAULT_SETTINGS.labels.afternoon
            },
            showBadge: document.getElementById('shift-show-badge').checked,
            filterBirthdays: document.getElementById('shift-filter-bday').checked
        };
    }

    if (wantDual && !wasDual) {
        // Normal -> İkili
        saveBellHoursFromInputs();
        appConfig.bellHours = bellHours;
        appConfig.schoolMode = 'dual';
        shiftEnsureData();
        shiftLoadLive('morning');
    } else if (!wantDual && wasDual) {
        // İkili -> Normal (şu an düzenlenen öğretimin verisi tekli veri olur)
        shiftStashLive();
        appConfig.schoolMode = 'single';
    }

    if (wantDual) {
        const classes = { morning: [], afternoon: [] };
        document.querySelectorAll('#shift-tab-body input[data-cls]:checked').forEach(inp => {
            if (inp.value === 'morning' || inp.value === 'afternoon') classes[inp.value].push(inp.dataset.cls);
        });
        appConfig.shiftData.morning.classes = classes.morning;
        appConfig.shiftData.afternoon.classes = classes.afternoon;
    }
}

// "Düzeni Uygula" düğmesi: kaydetmeden, paneli kapatmadan geçişi uygular
function shiftAdminApplyNow() {
    saveBellHoursFromInputs();
    appConfig.bellHours = bellHours;
    saveWeeklyScheduleMatrix();
    nobetAyiKaydet();
    shiftAdminCollect();
    shiftAdminRebuildSections();
    renderPanoData();
    showCustomNotification('Uygulandı', shiftIsDual()
        ? 'İkili öğretim düzeni uygulandı. Kalıcı olması için Kaydet veya Yayınla düğmesine basın.'
        : 'Normal (tekli) öğretim düzeni uygulandı. Kalıcı olması için Kaydet veya Yayınla düğmesine basın.');
    writeCMSLog('Öğretim düzeni uygulandı: ' + (shiftIsDual() ? 'İkili' : 'Normal'));
}

// Duyuru / kayan yazı satırındaki hedef seçici (Sabah / Öğle / Her ikisi)
function shiftTargetSelectHtml(kind, index, current) {
    if (!shiftIsDual()) return '';
    const cur = current || 'all';
    return `<select class="bg-slate-900 border border-slate-700 rounded text-[10px] text-slate-300 p-0.5" title="Hangi öğretimde gösterilsin?" onchange="shiftSetItemTarget('${kind}', ${index}, this.value)">
        <option value="all" ${cur === 'all' ? 'selected' : ''}>Her ikisi</option>
        <option value="morning" ${cur === 'morning' ? 'selected' : ''}>Sabah</option>
        <option value="afternoon" ${cur === 'afternoon' ? 'selected' : ''}>Öğle</option>
    </select>`;
}

function shiftSetItemTarget(kind, index, value) {
    const list = kind === 'ann' ? tempAnnouncements : tempMarqueeItems;
    if (list && list[index]) list[index].shift = value;
}

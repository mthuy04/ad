/* ULIS · Cấu hình học phí
   Bản mô phỏng giao diện. Dữ liệu nằm trong DB bên dưới, không gọi API.
   Mọi thay đổi chỉ tồn tại trong phiên làm việc. */
(function () {
'use strict';

/* ============================ CẤU HÌNH HIỂN THỊ ============================
   Tab nào có trong mảng thì hiện. Bỏ tab đi chỉ ẩn giao diện —
   phần ghi nhật ký (hàm log) VẪN CHẠY, dữ liệu vẫn được lưu đầy đủ.
   Muốn bật lại: thêm 'calc' và/hoặc 'audit' vào mảng dưới đây. */
const TABS_HIEN = ['versions', 'documents'];
/* Đầy đủ: ['versions', 'documents', 'calc', 'audit'] */

/* ============================ DANH MỤC ============================ */
/* Danh mục đào tạo — mọi lựa chọn phạm vi đều lấy từ đây, không nhập tay. */
const CAT = {
  he:      ['Chính quy', 'Vừa làm vừa học', 'Liên kết quốc tế'],
  bac:     ['Đại học', 'Sau đại học'],
  khoa:    ['K2022', 'K2023', 'K2024', 'K2025', 'K2026'],
  nganh:   ['Tất cả ngành', 'Các ngành ngôn ngữ', 'Ngôn ngữ Anh', 'Ngôn ngữ Nhật',
            'Ngôn ngữ Hàn', 'Ngôn ngữ Trung Quốc', 'Sư phạm tiếng Anh'],
  ct:      ['ĐHCQ tiêu chuẩn', 'Chất lượng cao', 'Chương trình thứ hai', 'Chương trình BRT'],
  quoctich:['Trong nước', 'Nước ngoài'],
  coso:    ['Chương trình thứ nhất', 'Chương trình thứ hai'],
  nd116:   ['Không xét', 'Thuộc diện', 'Không thuộc diện'],
  khoanthu:['Học phí'],
  namhoc:  ['2026–2027', '2027–2028'],
  hocky:   ['Học kỳ 1', 'Học kỳ 2', 'Toàn năm'],
  dangky:  ['Học lần đầu', 'Học lại', 'Học cải thiện', 'Học vượt'],
  cachtinh:['Theo tín chỉ', 'Theo học phần', 'Cố định theo học kỳ'],
  loaivb:  ['Quyết định', 'Thông báo', 'Hướng dẫn', 'Công văn']
};

/* Số sinh viên mô phỏng theo khóa — dùng để ước lượng phạm vi. */
const POP = { K2022: 640, K2023: 705, K2024: 742, K2025: 810, K2026: 688 };

/* ============================ DỮ LIỆU ============================ */
const DB = {
  documents: [
    { id:'D1', loai:'Quyết định', so:'1254/QĐ-ĐHNN', trichyeu:'Ban hành mức thu học phí năm học 2026–2027',
      ngay:'2026-07-18', donvi:'Trường Đại học Ngoại ngữ', tep:'1254-QD-DHNN.pdf' },
    { id:'D2', loai:'Thông báo', so:'6447/TB-ĐHNN', trichyeu:'Hướng dẫn thu học phí học kỳ 1 năm học 2026–2027',
      ngay:'2026-07-25', donvi:'Phòng Kế hoạch Tài chính', tep:'6447-TB-DHNN.pdf' },
    { id:'D3', loai:'Quyết định', so:'1186/QĐ-ĐHNN', trichyeu:'Mức thu chương trình đào tạo thứ hai',
      ngay:'2026-06-30', donvi:'Trường Đại học Ngoại ngữ', tep:'1186-QD-DHNN.pdf' }
  ],

  versions: [
    { id:'V1', ma:'FRAME-2026-HK1-DHCQ-v2', ten:'Học phí chính quy · HK1 2026–2027',
      nam:'2026–2027', ky:'Học kỳ 1', tu:'2026-09-01', den:'2027-01-31',
      loai:'Điều chỉnh', thay:'FRAME-2026-HK1-DHCQ-v1', trangthai:'Nháp',
      nguoilap:'Nguyễn Thị Hương', docs:['D1','D2'], ghichu:'',
      scopes:[
        { id:'S1', he:'Chính quy', bac:'Đại học', khoaTu:'K2024', khoaDen:'K2024',
          nganh:'Ngôn ngữ Anh', ct:'ĐHCQ tiêu chuẩn', quoctich:'Trong nước',
          coso:'Chương trình thứ nhất', nd116:'Không xét' },
        { id:'S2', he:'Chính quy', bac:'Đại học', khoaTu:'K2025', khoaDen:'K2025',
          nganh:'Các ngành ngôn ngữ', ct:'ĐHCQ tiêu chuẩn', quoctich:'Trong nước',
          coso:'Chương trình thứ nhất', nd116:'Không xét' },
        { id:'S3', he:'Chính quy', bac:'Đại học', khoaTu:'K2024', khoaDen:'K2026',
          nganh:'Tất cả ngành', ct:'ĐHCQ tiêu chuẩn', quoctich:'Nước ngoài',
          coso:'Chương trình thứ nhất', nd116:'Không xét' }
      ],
      fees:[
        { id:'F1', scope:'S1', khoan:'Học phí', dangky:'Học lần đầu', cach:'Theo tín chỉ', gia:485000, donvi:'tín chỉ', hocphan:'', tu:'2026-09-01' },
        { id:'F2', scope:'S1', khoan:'Học phí', dangky:'Học lại',     cach:'Theo tín chỉ', gia:582000, donvi:'tín chỉ', hocphan:'', tu:'2026-09-01' },
        { id:'F3', scope:'S2', khoan:'Học phí', dangky:'Học lần đầu', cach:'Theo tín chỉ', gia:485000, donvi:'tín chỉ', hocphan:'', tu:'2026-09-01' },
        { id:'F4', scope:'S3', khoan:'Học phí', dangky:'Học lần đầu', cach:'Theo tín chỉ', gia:1250000, donvi:'tín chỉ', hocphan:'', tu:'2026-09-01' }
      ]},

    { id:'V2', ma:'FRAME-2026-BRT-v1', ten:'Chương trình BRT · Năm học 2026–2027',
      nam:'2026–2027', ky:'Toàn năm', tu:'2026-08-01', den:'2027-07-31',
      loai:'Ban hành mới', thay:'', trangthai:'Chờ duyệt',
      nguoilap:'Nguyễn Thị Hương', docs:['D1'], ghichu:'',
      scopes:[{ id:'S1', he:'Chính quy', bac:'Đại học', khoaTu:'K2024', khoaDen:'K2026',
        nganh:'Tất cả ngành', ct:'Chương trình BRT', quoctich:'Trong nước',
        coso:'Chương trình thứ nhất', nd116:'Không xét' }],
      fees:[{ id:'F1', scope:'S1', khoan:'Học phí', dangky:'Học lần đầu', cach:'Cố định theo học kỳ', gia:25000000, donvi:'học kỳ', hocphan:'', tu:'2026-08-01' }]},

    { id:'V3', ma:'FRAME-2026-CT2-v1', ten:'Chương trình thứ hai · Năm học 2026–2027',
      nam:'2026–2027', ky:'Toàn năm', tu:'2026-09-01', den:'2027-07-31',
      loai:'Ban hành mới', thay:'', trangthai:'Đã duyệt',
      nguoilap:'Nguyễn Thị Hương', docs:['D3'], ghichu:'',
      scopes:[{ id:'S1', he:'Chính quy', bac:'Đại học', khoaTu:'K2023', khoaDen:'K2025',
        nganh:'Tất cả ngành', ct:'Chương trình thứ hai', quoctich:'Trong nước',
        coso:'Chương trình thứ hai', nd116:'Không xét' }],
      fees:[{ id:'F1', scope:'S1', khoan:'Học phí', dangky:'Học lần đầu', cach:'Theo tín chỉ', gia:612000, donvi:'tín chỉ', hocphan:'', tu:'2026-09-01' }]},

    { id:'V4', ma:'FRAME-2026-HK1-DHCQ-v1', ten:'Học phí chính quy · HK1 2026–2027',
      nam:'2026–2027', ky:'Học kỳ 1', tu:'2026-08-01', den:'2027-01-31',
      loai:'Ban hành mới', thay:'', trangthai:'Có hiệu lực',
      nguoilap:'Nguyễn Thị Hương', docs:['D1'], ghichu:'',
      scopes:[{ id:'S1', he:'Chính quy', bac:'Đại học', khoaTu:'K2024', khoaDen:'K2026',
        nganh:'Tất cả ngành', ct:'ĐHCQ tiêu chuẩn', quoctich:'Trong nước',
        coso:'Chương trình thứ nhất', nd116:'Không xét' }],
      fees:[{ id:'F1', scope:'S1', khoan:'Học phí', dangky:'Học lần đầu', cach:'Theo tín chỉ', gia:465000, donvi:'tín chỉ', hocphan:'', tu:'2026-08-01' }]}
  ],

  audit: [
    { t:'2026-08-24 19:10', ai:'Nguyễn Thị Hương', hd:'Sửa mức thu', dt:'FRAME-2026-HK1-DHCQ-v2', kq:'Đơn giá học lại 560.000 → 582.000' },
    { t:'2026-08-24 16:42', ai:'Nguyễn Thị Hương', hd:'Thêm nhóm sinh viên', dt:'FRAME-2026-HK1-DHCQ-v2', kq:'Sinh viên quốc tế · ĐHCQ tiêu chuẩn' },
    { t:'2026-08-23 09:15', ai:'Nguyễn Thị Hương', hd:'Tạo phiên bản', dt:'FRAME-2026-HK1-DHCQ-v2', kq:'Điều chỉnh từ FRAME-2026-HK1-DHCQ-v1' },
    { t:'2026-08-19 11:30', ai:'Trần Quốc Toản',   hd:'Phê duyệt',      dt:'FRAME-2026-CT2-v1',      kq:'Đã duyệt' },
    { t:'2026-08-18 08:20', ai:'Nguyễn Thị Hương', hd:'Gửi duyệt',      dt:'FRAME-2026-BRT-v1',      kq:'Chuyển trạng thái Chờ duyệt' }
  ]
};

/* ============================ TRẠNG THÁI ============================ */
const ST = { tab:'versions', vid:null, step:1, filters:{ q:'', nam:'', tt:'' } };

/* ============================ TIỆN ÍCH ============================ */
const $  = s => document.querySelector(s);
const el = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c =>
  ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const vnd = n => new Intl.NumberFormat('vi-VN').format(n);
const dmy = s => { if (!s) return '—'; const p = String(s).split('-'); return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : s; };
const opts = (arr, sel) => arr.map(o => `<option${o === sel ? ' selected' : ''}>${esc(o)}</option>`).join('');
const uid = p => p + Math.random().toString(36).slice(2, 7);

function toast(msg) {
  const t = el('toast'); const d = document.createElement('div');
  d.textContent = msg; t.appendChild(d);
  setTimeout(() => d.remove(), 2600);
}

const V = id => DB.versions.find(v => v.id === id);
const DOC = id => DB.documents.find(d => d.id === id);
const editable = v => v && v.trangthai === 'Nháp';

const BADGE = { 'Nháp':'b-draft','Chờ duyệt':'b-wait','Đã duyệt':'b-ok','Có hiệu lực':'b-live','Hết hiệu lực':'b-end' };
const badge = s => `<span class="tc-badge ${BADGE[s] || 'b-draft'}">${esc(s)}</span>`;

/* ---- phạm vi: tên tự sinh + ước lượng số sinh viên ---- */
function scopeName(s) {
  const he = s.he === 'Chính quy' && s.bac === 'Đại học' ? 'ĐHCQ' : `${s.he} · ${s.bac}`;
  const khoa = s.khoaTu === s.khoaDen ? s.khoaTu : `${s.khoaTu}–${s.khoaDen}`;
  let t = `${he} ${khoa} · ${s.nganh}`;
  if (s.quoctich === 'Nước ngoài') t += ' · Sinh viên quốc tế';
  if (s.ct && s.ct !== 'ĐHCQ tiêu chuẩn') t += ` · ${s.ct}`;
  return t;
}
function scopeSub(s) {
  return [s.he, s.bac, s.quoctich, s.coso].filter(Boolean).join(' · ');
}
function scopeCount(s) {
  const i = CAT.khoa.indexOf(s.khoaTu), j = CAT.khoa.indexOf(s.khoaDen);
  if (i < 0 || j < 0 || j < i) return 0;
  let n = 0;
  for (let k = i; k <= j; k++) n += POP[CAT.khoa[k]] || 0;
  if (s.nganh === 'Tất cả ngành') n = Math.round(n * 1.00);
  else if (s.nganh === 'Các ngành ngôn ngữ') n = Math.round(n * 0.58);
  else n = Math.round(n * 0.25);
  if (s.quoctich === 'Nước ngoài') n = Math.round(n * 0.04);
  if (s.ct === 'Chương trình thứ hai') n = Math.round(n * 0.12);
  else if (s.ct === 'Chương trình BRT') n = Math.round(n * 0.09);
  else if (s.ct === 'Chất lượng cao') n = Math.round(n * 0.18);
  return Math.max(n, 1);
}
/* hai nhóm chồng lấn khi mọi chiều đều giao nhau */
function overlap(a, b) {
  const ov = (x1, x2, y1, y2) => {
    const i1 = CAT.khoa.indexOf(x1), i2 = CAT.khoa.indexOf(x2);
    const j1 = CAT.khoa.indexOf(y1), j2 = CAT.khoa.indexOf(y2);
    return i1 <= j2 && j1 <= i2;
  };
  const same = (x, y, all) => x === y || x === all || y === all;
  return a.he === b.he && a.bac === b.bac
    && ov(a.khoaTu, a.khoaDen, b.khoaTu, b.khoaDen)
    && same(a.nganh, b.nganh, 'Tất cả ngành')
    && a.ct === b.ct && a.quoctich === b.quoctich && a.coso === b.coso;
}

/* ---- kiểm tra một phiên bản ---- */
function check(v) {
  const issues = [];
  if (!v.scopes.length) issues.push('Chưa có nhóm sinh viên nào.');
  if (!v.fees.length)   issues.push('Chưa khai báo mức thu nào.');
  if (!v.docs.length)   issues.push('Chưa gắn văn bản căn cứ.');
  if (v.tu && v.den && v.tu > v.den) issues.push('Ngày bắt đầu áp dụng sau ngày kết thúc.');
  if (v.loai === 'Điều chỉnh' && !v.thay) issues.push('Phiên bản điều chỉnh chưa chọn phiên bản được thay thế.');

  v.scopes.forEach(s => {
    if (!v.fees.some(f => f.scope === s.id))
      issues.push(`Nhóm “${scopeName(s)}” chưa có mức thu.`);
  });

  const dup = [];
  for (let i = 0; i < v.scopes.length; i++)
    for (let j = i + 1; j < v.scopes.length; j++)
      if (overlap(v.scopes[i], v.scopes[j])) dup.push([v.scopes[i], v.scopes[j]]);
  dup.forEach(p => issues.push(`Hai nhóm cùng phủ một trường hợp: “${scopeName(p[0])}” và “${scopeName(p[1])}”.`));

  const seen = {};
  v.fees.forEach(f => {
    const k = f.scope + '|' + f.khoan + '|' + f.dangky;
    if (seen[k]) {
      const s = v.scopes.find(x => x.id === f.scope);
      issues.push(`Hai mức thu trùng điều kiện cho nhóm “${s ? scopeName(s) : f.scope}” · ${f.khoan} · ${f.dangky}.`);
    }
    seen[k] = 1;
    if (!f.gia || f.gia <= 0) issues.push('Có dòng mức thu chưa nhập đơn giá.');
  });

  const students = v.scopes.reduce((a, s) => a + scopeCount(s), 0);
  return { issues, ready: issues.length === 0, students, overlapCount: dup.length };
}

/* ============================ ĐIỀU HƯỚNG ============================ */
const TC = {};
window.TC = TC;

TC.tab = function (t) {
  ST.tab = t; ST.vid = null;
  TABS_HIEN.forEach(k => {
    const b = el('tab-' + k);
    if (b) b.setAttribute('aria-selected', String(k === t));
  });
  render();
};
TC.open  = function (id) { ST.vid = id; ST.step = 1; render(); };
TC.close = function () { ST.vid = null; render(); };
TC.step  = function (n) { ST.step = n; render(); };

/* ============================ RENDER ============================ */
function render() {
  const sub = el('pageSub'), acts = el('headActions');
  if (ST.vid) { viewVersion(); return; }
  if (ST.tab === 'versions')  { sub.textContent = 'Mỗi khung học phí có thể có nhiều phiên bản theo từng thời kỳ.'; acts.innerHTML = '<button class="tc-btn tc-btn-primary" onclick="TC.newVersion()">+ Thêm phiên bản khung</button>'; viewVersions(); }
  if (ST.tab === 'documents') { sub.textContent = 'Quyết định, thông báo và tệp làm căn cứ ban hành.'; acts.innerHTML = '<button class="tc-btn tc-btn-primary" onclick="TC.newDoc()">+ Thêm văn bản</button>'; viewDocs(); }
  if (ST.tab === 'calc')      { sub.textContent = 'Kiểm tra một trường hợp cụ thể. Thao tác này không tạo khoản phải thu.'; acts.innerHTML = ''; viewCalc(); }
  if (ST.tab === 'audit')     { sub.textContent = 'Ai đã sửa, duyệt hoặc phát hành nội dung gì.'; acts.innerHTML = ''; viewAudit(); }
}

/* ---------- danh sách phiên bản ---------- */
function viewVersions() {
  const f = ST.filters;
  const rows = DB.versions.filter(v =>
    (!f.q  || (v.ten + v.ma).toLowerCase().includes(f.q.toLowerCase())) &&
    (!f.nam || v.nam === f.nam) &&
    (!f.tt  || v.trangthai === f.tt));

  el('view').innerHTML = `
    <div class="card">
      <div class="filters">
        <div class="field"><label for="fq">Tên phiên bản</label>
          <input id="fq" value="${esc(f.q)}" placeholder="Tên hoặc mã phiên bản" oninput="TC.filter('q',this.value)"></div>
        <div class="field"><label for="fn">Năm học</label>
          <select id="fn" onchange="TC.filter('nam',this.value)">
            <option value="">Tất cả</option><option${f.nam === '2026–2027' ? ' selected' : ''}>2026–2027</option></select></div>
        <div class="field"><label for="ft">Trạng thái</label>
          <select id="ft" onchange="TC.filter('tt',this.value)">
            <option value="">Tất cả</option>
            ${['Nháp','Chờ duyệt','Đã duyệt','Có hiệu lực','Hết hiệu lực'].map(s =>
              `<option${f.tt === s ? ' selected' : ''}>${s}</option>`).join('')}</select></div>
        <div class="field" style="display:flex;align-items:flex-end">
          <button class="tc-btn" onclick="TC.reset()">Đặt lại</button></div>
      </div>
      <div class="card-head"><div><h2>Danh sách phiên bản khung</h2>
        <p>${rows.length} phiên bản trong phạm vi đang chọn.</p></div></div>
      <div class="tw">
        <table><thead><tr>
          <th>Phiên bản khung</th><th>Năm học / Học kỳ</th><th>Thời gian áp dụng</th>
          <th class="tc-c">Nhóm</th><th class="tc-c">Mức thu</th><th>Trạng thái</th><th>Thao tác</th>
        </tr></thead><tbody>
        ${rows.length ? rows.map(v => `<tr>
          <td><span class="t-name">${esc(v.ten)}</span>
              <span class="t-sub num">${esc(v.ma)}${v.loai === 'Điều chỉnh' ? ' · Điều chỉnh' : ''}</span></td>
          <td>${esc(v.nam)}<span class="t-sub">${esc(v.ky)}</span></td>
          <td class="num">${dmy(v.tu)} – ${dmy(v.den)}</td>
          <td class="tc-c num">${v.scopes.length}</td>
          <td class="tc-c num">${v.fees.length}</td>
          <td>${badge(v.trangthai)}</td>
          <td><button class="tc-btn-link" onclick="TC.open('${v.id}')">${editable(v) ? 'Xem / Sửa' : 'Xem'}</button></td>
        </tr>`).join('')
        : `<tr><td colspan="7"><div class="empty"><strong>Không có phiên bản phù hợp</strong>Thử bỏ bớt điều kiện lọc.</div></td></tr>`}
        </tbody></table>
      </div>
    </div>`;
}
TC.filter = (k, v) => { ST.filters[k] = v; viewVersions(); };
TC.reset  = () => { ST.filters = { q:'', nam:'', tt:'' }; viewVersions(); };

/* ---------- chi tiết phiên bản ---------- */
function viewVersion() {
  const v = V(ST.vid); if (!v) { TC.close(); return; }
  const ev = check(v);
  el('pageSub').textContent = 'Mỗi khung học phí có thể có nhiều phiên bản theo từng thời kỳ.';
  el('headActions').innerHTML = '';

  const replaced = v.thay ? `<div class="note"><strong>Phiên bản điều chỉnh:</strong>
      thay ${esc(v.thay)} từ ngày ${dmy(v.tu)}. Bản cũ vẫn được giữ để tra cứu lịch sử.</div>` : '';

  el('view').innerHTML = `
    <div class="ws-head">
      <button class="ws-back" onclick="TC.close()">← Quay lại danh sách</button>
      <div class="ws-row">
        <div>
          <div class="ws-title">${esc(v.ten)}</div>
          <div class="ws-meta num">${esc(v.ma)} · ${esc(v.nam)} · ${esc(v.ky)} · ${dmy(v.tu)} – ${dmy(v.den)}</div>
        </div>
        <div class="ws-acts">${badge(v.trangthai)}
          ${editable(v) ? `<button class="tc-btn tc-btn-primary" onclick="TC.step(4)">Kiểm tra và gửi duyệt</button>` : ''}
        </div>
      </div>
      <div class="ctx">
        <div><span>Năm học</span><strong>${esc(v.nam)}</strong></div>
        <div><span>Học kỳ</span><strong>${esc(v.ky)}</strong></div>
        <div><span>Thời gian áp dụng</span><strong class="num">${dmy(v.tu)} – ${dmy(v.den)}</strong></div>
        <div><span>Loại phiên bản</span><strong>${esc(v.loai)}</strong></div>
        <div><span>Văn bản căn cứ</span><strong class="num">${v.docs.length ? esc(DOC(v.docs[0]).so) + (v.docs.length > 1 ? ` +${v.docs.length - 1}` : '') : '—'}</strong></div>
      </div>
    </div>
    ${replaced}
    <div class="steps">
      ${[[1,'Thông tin và căn cứ','Phiên bản này là gì?'],
         [2,'Nhóm phạm vi','Ai được áp dụng?'],
         [3,'Quy tắc tính','Thu khoản gì, bao nhiêu?'],
         [4,'Kiểm tra và phê duyệt','Rà lỗi trước khi áp dụng']]
        .map(([n, t, d]) => `<button class="step${ST.step === n ? '' : (n < ST.step ? ' tc-done' : '')}"
            ${ST.step === n ? 'aria-current="step"' : ''} onclick="TC.step(${n})">
            <span class="step-n">${n < ST.step ? '✓' : n}</span>
            <div><strong>${t}</strong><small>${d}</small></div></button>`).join('')}
    </div>
    <div id="stepBody"></div>`;

  ({ 1: step1, 2: step2, 3: step3, 4: step4 })[ST.step](v, ev);
}

/* ---------- bước 1 ---------- */
function step1(v) {
  const ro = !editable(v) ? 'disabled' : '';
  el('stepBody').innerHTML = `
    <div class="card">
      <div class="card-head"><div><h2>Thông tin phiên bản</h2>
        <p>Mã phiên bản và số lần sửa do hệ thống tự sinh.</p></div></div>
      <div class="card-body">
        <div class="tc-g2">
          <div class="field span2"><label>Tên phiên bản khung</label>
            <input value="${esc(v.ten)}" ${ro} onchange="TC.setV('ten',this.value)"></div>
          <div class="field"><label>Năm học</label>
            <select ${ro} onchange="TC.setV('nam',this.value)">${opts(CAT.namhoc, v.nam)}</select></div>
          <div class="field"><label>Học kỳ</label>
            <select ${ro} onchange="TC.setV('ky',this.value)">${opts(CAT.hocky, v.ky)}</select></div>
          <div class="field"><label>Áp dụng từ</label>
            <input type="date" value="${v.tu}" ${ro} onchange="TC.setV('tu',this.value)"></div>
          <div class="field"><label>Áp dụng đến</label>
            <input type="date" value="${v.den}" ${ro} onchange="TC.setV('den',this.value)"></div>
          <div class="field"><label>Loại phiên bản</label>
            <select ${ro} onchange="TC.setV('loai',this.value)">
              ${opts(['Ban hành mới','Điều chỉnh'], v.loai)}</select></div>
          <div class="field"><label>Phiên bản được thay thế</label>
            <select ${ro || (v.loai !== 'Điều chỉnh' ? 'disabled' : '')} onchange="TC.setV('thay',this.value)">
              <option value="">— Không —</option>
              ${DB.versions.filter(x => x.id !== v.id).map(x =>
                `<option value="${x.ma}"${v.thay === x.ma ? ' selected' : ''}>${esc(x.ma)}</option>`).join('')}
            </select>
            <div class="field-hint">Chỉ dùng khi loại phiên bản là Điều chỉnh.</div></div>
          <div class="field span2"><label>Ghi chú</label>
            <textarea rows="2" ${ro} onchange="TC.setV('ghichu',this.value)">${esc(v.ghichu)}</textarea></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <div><h2>Văn bản căn cứ</h2><p>Có thể gắn nhiều văn bản cho một phiên bản.</p></div>
        ${editable(v) ? `<div style="display:flex;gap:8px">
          <button class="tc-btn tc-btn-sm" onclick="TC.pickDoc()">Chọn từ thư viện</button>
          <button class="tc-btn tc-btn-sm tc-btn-primary" onclick="TC.newDoc(true)">Tải văn bản mới</button></div>` : ''}
      </div>
      <div class="card-body">
        ${v.docs.length ? `<div class="doclist">${v.docs.map(id => { const d = DOC(id); return `
          <div class="doc"><div class="doc-i">
            <strong class="num">${esc(d.so)} · ${esc(d.loai)}</strong>
            <span>${esc(d.trichyeu)} · ${dmy(d.ngay)} · ${esc(d.tep)}</span></div>
            ${editable(v) ? `<button class="tc-btn tc-btn-sm tc-btn-danger" onclick="TC.unlinkDoc('${id}')">Gỡ</button>` : ''}
          </div>`; }).join('')}</div>`
        : `<div class="empty-doc">Chưa gắn văn bản căn cứ. Phải có tối thiểu một văn bản mới gửi duyệt được.</div>`}
      </div>
    </div>

    <div class="step-foot"><span></span>
      <button class="tc-btn tc-btn-primary" onclick="TC.step(2)">Tiếp tục: Nhóm phạm vi →</button></div>`;
}

/* ---------- bước 2 ---------- */
function step2(v, ev) {
  el('stepBody').innerHTML = `
    <div class="card">
      <div class="card-head"><div><h2>Nhóm phạm vi áp dụng</h2>
        <p>Chọn điều kiện từ danh mục đào tạo để hệ thống xác định đúng sinh viên.</p></div>
        ${editable(v) ? `<button class="tc-btn tc-btn-sm tc-btn-primary" onclick="TC.scopeModal(-1)">+ Thêm nhóm phạm vi</button>` : ''}
      </div>
      <div class="tw">
        <table><thead><tr>
          <th>Nhóm sinh viên</th><th class="tc-c">Mức thu</th><th>Thao tác</th>
        </tr></thead><tbody>
        ${v.scopes.length ? v.scopes.map((s, i) => {
          const n = v.fees.filter(f => f.scope === s.id).length;
          return `<tr>
            <td><span class="t-name">${esc(scopeName(s))}</span>
                <span class="t-sub">${esc(scopeSub(s))}</span>
                <span class="count num">${vnd(scopeCount(s))} sinh viên dự kiến</span></td>
            <td class="tc-c">${n ? `<span class="num">${n} mức</span>` : '<span class="tc-bad">Chưa có</span>'}</td>
            <td>${editable(v) ? `<button class="tc-btn-link" onclick="TC.scopeModal(${i})">Sửa</button>` : '—'}</td>
          </tr>`; }).join('')
        : `<tr><td colspan="3"><div class="empty"><strong>Chưa có nhóm phạm vi</strong>Thêm nhóm để xác định sinh viên được áp dụng.</div></td></tr>`}
        </tbody></table>
      </div>
    </div>
    <div class="step-foot">
      <span class="sum"><strong class="num">${vnd(ev.students)}</strong> sinh viên dự kiến trong ${v.scopes.length} nhóm</span>
      <span style="display:flex;gap:9px">
        <button class="tc-btn" onclick="TC.step(1)">← Thông tin</button>
        <button class="tc-btn tc-btn-primary" onclick="TC.step(3)">Tiếp tục: Quy tắc tính →</button></span></div>`;
}

/* ---------- bước 3 ---------- */
function step3(v) {
  el('stepBody').innerHTML = `
    <div class="card">
      <div class="card-head"><div><h2>Quy tắc tính</h2>
        <p>Mỗi dòng trả lời đủ: nhóm nào, thu khoản gì, tính theo cách nào, bao nhiêu tiền.</p></div>
        ${editable(v) ? `<div style="display:flex;gap:8px">
          <button class="tc-btn tc-btn-sm" onclick="TC.importExcel()">Nhập từ Excel</button>
          <button class="tc-btn tc-btn-sm tc-btn-primary" onclick="TC.feeModal(-1)">+ Thêm quy tắc</button></div>` : ''}
      </div>
      <div class="tw">
        <table><thead><tr>
          <th>Nhóm phạm vi</th><th>Khoản thu / loại đăng ký</th><th>Cách tính</th>
          <th class="tc-r">Đơn giá</th><th>Thao tác</th>
        </tr></thead><tbody>
        ${v.fees.length ? v.fees.map((f, i) => {
          const s = v.scopes.find(x => x.id === f.scope);
          return `<tr>
            <td><span class="t-name">${s ? esc(scopeName(s)) : '<span class="tc-bad">Nhóm không tồn tại</span>'}</span></td>
            <td>${esc(f.khoan)}<span class="t-sub">${esc(f.dangky)}${f.hocphan ? ' · ' + esc(f.hocphan) : ''}</span></td>
            <td>${esc(f.cach)}</td>
            <td class="tc-r num"><strong>${vnd(f.gia)}</strong><span class="t-sub">đ / ${esc(f.donvi)}</span></td>
            <td>${editable(v) ? `<button class="tc-btn-link" onclick="TC.feeModal(${i})">Sửa</button>` : '—'}</td>
          </tr>`; }).join('')
        : `<tr><td colspan="5"><div class="empty"><strong>Chưa có quy tắc tính</strong>Thêm mức thu cho từng nhóm phạm vi.</div></td></tr>`}
        </tbody></table>
      </div>
    </div>
    <div class="step-foot">
      <span class="sum"><strong class="num">${v.fees.length}</strong> quy tắc cho ${v.scopes.length} nhóm</span>
      <span style="display:flex;gap:9px">
        <button class="tc-btn" onclick="TC.step(2)">← Nhóm phạm vi</button>
        <button class="tc-btn tc-btn-primary" onclick="TC.step(4)">Tiếp tục: Kiểm tra →</button></span></div>`;
}

/* ---------- bước 4 ---------- */
function step4(v, ev) {
  const canSubmit = ev.ready && editable(v);
  el('stepBody').innerHTML = `
    <div class="ready ${ev.ready ? 'ready-ok' : 'ready-bad'}">
      <div class="ready-icon">${ev.ready ? '✓' : '!'}</div>
      <div><strong>${ev.ready ? 'Đủ điều kiện gửi duyệt' : `Còn ${ev.issues.length} nội dung cần xử lý`}</strong>
        <span>${ev.ready ? 'Không có lỗi chặn. Danh mục đầy đủ, không chồng lấn phạm vi hoặc mức thu.'
                          : 'Phải xử lý hết lỗi chặn trước khi gửi duyệt.'}</span></div>
    </div>
    ${ev.issues.length ? `<div class="card"><div class="card-body">
      <ul class="issues">${ev.issues.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div></div>` : ''}

    <div class="checks">
      <div class="card"><div class="card-head"><div><h2>Kết quả kiểm tra</h2>
        <p>Chỉ hiển thị nội dung quyết định việc gửi duyệt.</p></div></div>
        <div class="card-body">
          ${[['Thời gian áp dụng', v.tu && v.den && v.tu <= v.den, v.tu && v.den && v.tu <= v.den ? 'Hợp lệ' : 'Không hợp lệ'],
             ['Nhóm phạm vi', v.scopes.length > 0, `${v.scopes.length} nhóm · ${vnd(ev.students)} SV`],
             ['Chồng lấn phạm vi', ev.overlapCount === 0, ev.overlapCount === 0 ? 'Không có' : `${ev.overlapCount} cặp`],
             ['Quy tắc tính', v.fees.length > 0, `${v.fees.length} quy tắc`],
             ['Văn bản căn cứ', v.docs.length > 0, v.docs.length ? DOC(v.docs[0]).so + (v.docs.length > 1 ? ` +${v.docs.length - 1}` : '') : 'Chưa có']]
            .map(([k, ok, val]) => `<div class="chk-row"><span>${k}</span>
              <span class="${ok ? 'chk-ok' : 'chk-bad'}">${ok ? '✓' : '!'} <span class="chk-val num">${esc(val)}</span></span></div>`).join('')}
        </div></div>

      <div class="card"><div class="card-head"><div><h2>Tác động khi phát hành</h2>
        <p>Phiên bản mới chỉ áp dụng khi tạo khoản phải thu từ ngày có hiệu lực.</p></div></div>
        <div class="card-body">
          <div class="chk-row"><span>Sinh viên dự kiến</span><span class="chk-val num">${vnd(ev.students)} sinh viên</span></div>
          <div class="chk-row"><span>Quy tắc sẽ có hiệu lực</span><span class="chk-val num">${v.fees.length} quy tắc</span></div>
          <div class="chk-row"><span>Khoản phải thu đã phát hành</span><span class="chk-val">Không tự động thay đổi</span></div>
          <div class="chk-row"><span>Bản được thay thế</span><span class="chk-val num">${v.thay ? esc(v.thay) + ' vẫn tra cứu được' : 'Không áp dụng'}</span></div>
        </div></div>
    </div>

    <div class="card">
      <div class="card-head"><div><h2>Phê duyệt và phát hành</h2>
        <p>Người duyệt phải khác người lập. Phiên bản đã có hiệu lực chỉ được xem.</p></div>${badge(v.trangthai)}</div>
      <div class="card-body">
        <div class="tc-g2">
          <div class="field"><label>Người lập</label><input value="${esc(v.nguoilap)}" disabled></div>
          <div class="field" style="display:flex;align-items:flex-end;gap:8px">
            ${v.trangthai === 'Nháp' ? `<button class="tc-btn tc-btn-primary" ${canSubmit ? '' : 'disabled'} onclick="TC.submit()">Gửi duyệt</button>` : ''}
            ${v.trangthai === 'Chờ duyệt' ? `<button class="tc-btn tc-btn-primary" onclick="TC.approve()">Phê duyệt</button>
              <button class="tc-btn tc-btn-danger" onclick="TC.reject()">Từ chối</button>` : ''}
            ${v.trangthai === 'Đã duyệt' ? `<button class="tc-btn tc-btn-primary" onclick="TC.publish()">Phát hành</button>` : ''}
            ${v.trangthai === 'Có hiệu lực' ? `<button class="tc-btn" onclick="TC.amend()">Tạo phiên bản điều chỉnh</button>` : ''}
          </div>
        </div>
      </div>
    </div>
    <div class="step-foot"><span></span>
      <button class="tc-btn" onclick="TC.step(3)">← Quy tắc tính</button></div>`;
}

/* ============================ THAO TÁC ============================ */
TC.setV = function (k, val) {
  const v = V(ST.vid); if (!v || !editable(v)) return;
  v[k] = val; if (k === 'loai' && val !== 'Điều chỉnh') v.thay = '';
  render();
};
TC.unlinkDoc = function (id) {
  const v = V(ST.vid); v.docs = v.docs.filter(d => d !== id); toast('Đã gỡ văn bản khỏi phiên bản.'); render();
};
TC.submit  = function () { const v = V(ST.vid); if (!check(v).ready) return; v.trangthai = 'Chờ duyệt'; log('Gửi duyệt', v.ma, 'Chuyển trạng thái Chờ duyệt'); toast('Đã gửi duyệt.'); render(); };
TC.approve = function () { const v = V(ST.vid); v.trangthai = 'Đã duyệt';  log('Phê duyệt', v.ma, 'Đã duyệt'); toast('Đã phê duyệt.'); render(); };
TC.reject  = function () { const v = V(ST.vid); v.trangthai = 'Nháp';      log('Từ chối',  v.ma, 'Trả về Nháp'); toast('Đã từ chối, trả về Nháp.'); render(); };
TC.publish = function () { const v = V(ST.vid); v.trangthai = 'Có hiệu lực'; log('Phát hành', v.ma, 'Có hiệu lực từ ' + dmy(v.tu)); toast('Đã phát hành.'); render(); };
TC.amend   = function () {
  const o = V(ST.vid);
  const nv = JSON.parse(JSON.stringify(o));
  nv.id = uid('V'); nv.ma = o.ma.replace(/v(\d+)$/, (m, n) => 'v' + (+n + 1));
  nv.trangthai = 'Nháp'; nv.loai = 'Điều chỉnh'; nv.thay = o.ma;
  DB.versions.unshift(nv); log('Tạo phiên bản', nv.ma, 'Điều chỉnh từ ' + o.ma);
  toast('Đã tạo phiên bản điều chỉnh.'); ST.vid = nv.id; ST.step = 1; render();
};
TC.importExcel = () => toast('Nhập từ Excel — thao tác mô phỏng trong bản demo.');
function log(hd, dt, kq) {
  const d = new Date(), p = n => String(n).padStart(2, '0');
  DB.audit.unshift({ t:`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`,
    ai:'Nguyễn Thị Hương', hd, dt, kq });
}

/* ============================ MODAL ============================ */
function openModal(html) { el('modal').innerHTML = html; el('overlay').hidden = false; document.body.style.overflow = 'hidden'; }
TC.closeModal = function () { el('overlay').hidden = true; el('modal').innerHTML = ''; document.body.style.overflow = ''; };
TC.overlayClick = e => { if (e.target === el('overlay')) TC.closeModal(); };
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !el('overlay').hidden) TC.closeModal(); });

/* ---- tạo phiên bản mới ---- */
TC.newVersion = function () {
  openModal(`
    <div class="tc-modal-head"><div><h2 id="modalTitle">Thêm phiên bản khung</h2>
      <p>Phiên bản mới được lưu ở trạng thái Nháp.</p></div>
      <button class="x" onclick="TC.closeModal()" aria-label="Đóng">×</button></div>
    <div class="tc-modal-body">
      <div class="tc-g2">
        <div class="field span2"><label>Tên phiên bản khung <span class="req">*</span></label>
          <input id="nvTen" placeholder="Ví dụ: Học phí chính quy · HK2 2026–2027"></div>
        <div class="field"><label>Năm học <span class="req">*</span></label>
          <select id="nvNam"><option>2026–2027</option><option>2027–2028</option></select></div>
        <div class="field"><label>Học kỳ <span class="req">*</span></label>
          <select id="nvKy"><option>Học kỳ 1</option><option>Học kỳ 2</option><option>Toàn năm</option></select></div>
        <div class="field"><label>Áp dụng từ <span class="req">*</span></label><input type="date" id="nvTu" value="2027-02-01"></div>
        <div class="field"><label>Áp dụng đến <span class="req">*</span></label><input type="date" id="nvDen" value="2027-07-31"></div>
        <div class="field"><label>Loại phiên bản <span class="req">*</span></label>
          <select id="nvLoai" onchange="TC.toggleThay()">${opts(['Ban hành mới','Điều chỉnh'])}</select></div>
        <div class="field"><label>Phiên bản được thay thế</label>
          <select id="nvThay" disabled><option value="">— Không —</option>
            ${DB.versions.map(x => `<option value="${esc(x.ma)}">${esc(x.ma)}</option>`).join('')}</select>
          <div class="field-hint">Bắt buộc khi loại là Điều chỉnh.</div></div>
        <div class="field span2"><label>Văn bản căn cứ <span class="req">*</span></label>
          <select id="nvDoc">${DB.documents.map(d =>
            `<option value="${d.id}">${esc(d.so)} · ${esc(d.trichyeu)}</option>`).join('')}</select>
          <div class="field-hint">Có thể gắn thêm văn bản hoặc tải tệp mới ở bước Thông tin và căn cứ.</div></div>
      </div>
      <div class="note" style="margin:14px 0 0">Mã phiên bản và số lần sửa do hệ thống tự sinh.</div>
    </div>
    <div class="tc-modal-foot">
      <button class="tc-btn" onclick="TC.closeModal()">Hủy</button>
      <button class="tc-btn tc-btn-primary" onclick="TC.saveVersion()">Lưu nháp và tiếp tục</button></div>`);
};
TC.toggleThay = () => {
  const s = el('nvThay'); s.disabled = el('nvLoai').value !== 'Điều chỉnh';
  if (s.disabled) s.value = '';
};
TC.saveVersion = function () {
  const ten = el('nvTen').value.trim();
  if (!ten) { toast('Nhập tên phiên bản khung.'); el('nvTen').focus(); return; }
  const loai = el('nvLoai').value, thay = el('nvThay').value;
  if (loai === 'Điều chỉnh' && !thay) { toast('Chọn phiên bản được thay thế.'); return; }
  const v = { id:uid('V'), ma:'FRAME-' + new Date().getFullYear() + '-' + uid('').toUpperCase(),
    ten, nam:el('nvNam').value, ky:el('nvKy').value, tu:el('nvTu').value, den:el('nvDen').value,
    loai, thay, trangthai:'Nháp', nguoilap:'Nguyễn Thị Hương',
    docs:[el('nvDoc').value], ghichu:'', scopes:[], fees:[] };
  DB.versions.unshift(v); log('Tạo phiên bản', v.ma, loai === 'Điều chỉnh' ? 'Điều chỉnh từ ' + thay : 'Ban hành mới');
  TC.closeModal(); toast('Đã lưu nháp.'); ST.vid = v.id; ST.step = 1; render();
};

/* ---- chọn văn bản từ thư viện ---- */
TC.pickDoc = function () {
  const v = V(ST.vid);
  const avail = DB.documents.filter(d => !v.docs.includes(d.id));
  openModal(`
    <div class="tc-modal-head"><div><h2 id="modalTitle">Chọn văn bản căn cứ</h2>
      <p>Chọn từ thư viện văn bản đã có.</p></div>
      <button class="x" onclick="TC.closeModal()" aria-label="Đóng">×</button></div>
    <div class="tc-modal-body">
      ${avail.length ? `<div class="doclist">${avail.map(d => `
        <div class="doc"><div class="doc-i"><strong class="num">${esc(d.so)} · ${esc(d.loai)}</strong>
          <span>${esc(d.trichyeu)} · ${dmy(d.ngay)}</span></div>
          <button class="tc-btn tc-btn-sm tc-btn-primary" onclick="TC.linkDoc('${d.id}')">Gắn</button></div>`).join('')}</div>`
      : `<div class="empty-doc">Mọi văn bản trong thư viện đã được gắn.</div>`}
    </div>
    <div class="tc-modal-foot"><button class="tc-btn" onclick="TC.closeModal()">Đóng</button></div>`);
};
TC.linkDoc = function (id) { V(ST.vid).docs.push(id); TC.closeModal(); toast('Đã gắn văn bản.'); render(); };

/* ---- thêm văn bản mới (có tải tệp) ---- */
TC.newDoc = function (attach) {
  openModal(`
    <div class="tc-modal-head"><div><h2 id="modalTitle">Thêm văn bản căn cứ</h2>
      <p>Tải quyết định, thông báo hoặc hướng dẫn làm căn cứ ban hành.</p></div>
      <button class="x" onclick="TC.closeModal()" aria-label="Đóng">×</button></div>
    <div class="tc-modal-body">
      <div class="tc-g2">
        <div class="field"><label>Loại văn bản <span class="req">*</span></label>
          <select id="dLoai">${opts(CAT.loaivb)}</select></div>
        <div class="field"><label>Số hiệu <span class="req">*</span></label>
          <input id="dSo" placeholder="Ví dụ: 1254/QĐ-ĐHNN"></div>
        <div class="field span2"><label>Trích yếu <span class="req">*</span></label>
          <input id="dTrich" placeholder="Nội dung tóm tắt của văn bản"></div>
        <div class="field"><label>Ngày ban hành <span class="req">*</span></label><input type="date" id="dNgay"></div>
        <div class="field"><label>Đơn vị ban hành <span class="req">*</span></label>
          <input id="dDonvi" value="Trường Đại học Ngoại ngữ"></div>
        <div class="field span2"><label>Tệp đính kèm <span class="req">*</span></label>
          <label class="drop"><strong>Chọn tệp từ máy</strong>
            <span id="dTepName">Chấp nhận PDF, DOC hoặc DOCX · tối đa 20 MB</span>
            <input type="file" id="dTep" accept=".pdf,.doc,.docx" onchange="TC.pickedFile(this)"></label></div>
      </div>
    </div>
    <div class="tc-modal-foot">
      <button class="tc-btn" onclick="TC.closeModal()">Hủy</button>
      <button class="tc-btn tc-btn-primary" onclick="TC.saveDoc(${attach ? 'true' : 'false'})">Lưu văn bản</button></div>`);
};
TC.pickedFile = function (inp) {
  const f = inp.files && inp.files[0];
  el('dTepName').textContent = f ? f.name + ' · ' + Math.max(1, Math.round(f.size / 1024)) + ' KB'
                                 : 'Chấp nhận PDF, DOC hoặc DOCX · tối đa 20 MB';
};
TC.saveDoc = function (attach) {
  const so = el('dSo').value.trim(), tr = el('dTrich').value.trim(),
        ng = el('dNgay').value, dv = el('dDonvi').value.trim();
  const f = el('dTep').files && el('dTep').files[0];
  if (!so || !tr || !ng || !dv) { toast('Điền đủ các trường bắt buộc.'); return; }
  if (!f) { toast('Chọn tệp đính kèm PDF, DOC hoặc DOCX.'); return; }
  const d = { id:uid('D'), loai:el('dLoai').value, so, trichyeu:tr, ngay:ng, donvi:dv, tep:f.name };
  DB.documents.push(d);
  if (attach && ST.vid) V(ST.vid).docs.push(d.id);
  log('Thêm văn bản', so, tr);
  TC.closeModal(); toast('Đã lưu văn bản căn cứ.'); render();
};

/* ---- nhóm phạm vi ---- */
TC.scopeModal = function (idx) {
  const v = V(ST.vid);
  const s = idx >= 0 ? v.scopes[idx] : { he:'Chính quy', bac:'Đại học', khoaTu:'K2026', khoaDen:'K2026',
    nganh:'Tất cả ngành', ct:'ĐHCQ tiêu chuẩn', quoctich:'Trong nước', coso:'Chương trình thứ nhất', nd116:'Không xét' };
  openModal(`
    <div class="tc-modal-head"><div><h2 id="modalTitle">${idx >= 0 ? 'Sửa' : 'Thêm'} nhóm phạm vi</h2>
      <p>Chọn điều kiện từ danh mục đào tạo để hệ thống xác định đúng sinh viên.</p></div>
      <button class="x" onclick="TC.closeModal()" aria-label="Đóng">×</button></div>
    <div class="tc-modal-body">
      <div class="tc-g2">
        <div class="field"><label>Hệ đào tạo <span class="req">*</span></label>
          <select id="sHe" onchange="TC.scopePrev()">${opts(CAT.he, s.he)}</select></div>
        <div class="field"><label>Bậc đào tạo <span class="req">*</span></label>
          <select id="sBac" onchange="TC.scopePrev()">${opts(CAT.bac, s.bac)}</select></div>
        <div class="field"><label>Khóa từ <span class="req">*</span></label>
          <select id="sKt" onchange="TC.scopePrev()">${opts(CAT.khoa, s.khoaTu)}</select></div>
        <div class="field"><label>Đến khóa <span class="req">*</span></label>
          <select id="sKd" onchange="TC.scopePrev()">${opts(CAT.khoa, s.khoaDen)}</select></div>
        <div class="field"><label>Ngành / nhóm ngành <span class="req">*</span></label>
          <select id="sNg" onchange="TC.scopePrev()">${opts(CAT.nganh, s.nganh)}</select></div>
        <div class="field"><label>Chương trình đào tạo <span class="req">*</span></label>
          <select id="sCt" onchange="TC.scopePrev()">${opts(CAT.ct, s.ct)}</select></div>
        <div class="field"><label>Quốc tịch <span class="req">*</span></label>
          <select id="sQt" onchange="TC.scopePrev()">${opts(CAT.quoctich, s.quoctich)}</select></div>
        <div class="field"><label>Cơ sở ghi danh <span class="req">*</span></label>
          <select id="sCs" onchange="TC.scopePrev()">${opts(CAT.coso, s.coso)}</select></div>
      </div>
      <details class="adv"><summary>Điều kiện bổ sung</summary>
        <div class="tc-g2" style="padding-top:4px">
          <div class="field"><label>Thuộc diện NĐ116</label>
            <select id="sNd" onchange="TC.scopePrev()">${opts(CAT.nd116, s.nd116)}</select></div>
        </div></details>
      <div class="prev"><span>Tên nhóm hệ thống sẽ sinh</span>
        <strong id="sPrevName">—</strong>
        <div class="prev-foot"><span class="num" id="sPrevCount">—</span>
          <span id="sPrevOverlap" class="tc-ok">—</span></div></div>
    </div>
    <div class="tc-modal-foot">
      ${idx >= 0 ? `<button class="tc-btn tc-btn-danger" onclick="TC.delScope(${idx})">Xóa nhóm</button>` : ''}
      <button class="tc-btn" onclick="TC.closeModal()">Hủy</button>
      <button class="tc-btn tc-btn-primary" onclick="TC.saveScope(${idx})">Lưu nhóm phạm vi</button></div>`);
  TC.scopePrev();
};
function readScope() {
  return { he:el('sHe').value, bac:el('sBac').value, khoaTu:el('sKt').value, khoaDen:el('sKd').value,
    nganh:el('sNg').value, ct:el('sCt').value, quoctich:el('sQt').value,
    coso:el('sCs').value, nd116:el('sNd') ? el('sNd').value : 'Không xét' };
}
TC.scopePrev = function () {
  const s = readScope(), v = V(ST.vid);
  const ok = CAT.khoa.indexOf(s.khoaTu) <= CAT.khoa.indexOf(s.khoaDen);
  el('sPrevName').textContent = ok ? scopeName(s) : 'Khóa bắt đầu phải trước hoặc bằng khóa kết thúc';
  el('sPrevCount').textContent = ok ? vnd(scopeCount(s)) + ' sinh viên dự kiến' : '—';
  const dup = ok && v.scopes.some((x, i) => x.id !== s.id && overlap(x, s) && i !== TC._editIdx);
  const o = el('sPrevOverlap');
  o.textContent = !ok ? '' : (dup ? 'Bị trùng với một nhóm đã có' : 'Không chồng lấn với nhóm khác');
  o.className = dup ? 'tc-bad' : 'tc-ok';
};
TC.saveScope = function (idx) {
  const v = V(ST.vid), s = readScope();
  if (CAT.khoa.indexOf(s.khoaTu) > CAT.khoa.indexOf(s.khoaDen)) { toast('Khóa bắt đầu phải trước hoặc bằng khóa kết thúc.'); return; }
  if (idx >= 0) { s.id = v.scopes[idx].id; v.scopes[idx] = s; log('Sửa nhóm phạm vi', v.ma, scopeName(s)); }
  else { s.id = uid('S'); v.scopes.push(s); log('Thêm nhóm phạm vi', v.ma, scopeName(s)); }
  TC.closeModal(); toast('Đã lưu nhóm phạm vi.'); render();
};
TC.delScope = function (idx) {
  const v = V(ST.vid), s = v.scopes[idx];
  v.fees = v.fees.filter(f => f.scope !== s.id);
  v.scopes.splice(idx, 1); log('Xóa nhóm phạm vi', v.ma, scopeName(s));
  TC.closeModal(); toast('Đã xóa nhóm và các mức thu liên quan.'); render();
};

/* ---- quy tắc tính ---- */
TC.feeModal = function (idx) {
  const v = V(ST.vid);
  if (!v.scopes.length) { toast('Thêm nhóm phạm vi trước khi khai báo mức thu.'); return; }
  const f = idx >= 0 ? v.fees[idx] : { scope:v.scopes[0].id, khoan:'Học phí', dangky:'Học lần đầu',
    cach:'Theo tín chỉ', gia:0, donvi:'tín chỉ', hocphan:'', tu:v.tu };
  openModal(`
    <div class="tc-modal-head"><div><h2 id="modalTitle">${idx >= 0 ? 'Sửa' : 'Thêm'} quy tắc tính</h2>
      <p>Áp dụng cho nhóm nào, thu khoản gì, tính theo cách nào, bao nhiêu tiền.</p></div>
      <button class="x" onclick="TC.closeModal()" aria-label="Đóng">×</button></div>
    <div class="tc-modal-body">
      <div class="tc-g2">
        <div class="field span2"><label>Nhóm phạm vi <span class="req">*</span></label>
          <select id="fScope">${v.scopes.map(s =>
            `<option value="${s.id}"${f.scope === s.id ? ' selected' : ''}>${esc(scopeName(s))}</option>`).join('')}</select></div>
        <div class="field"><label>Khoản thu <span class="req">*</span></label>
          <select id="fKhoan">${opts(CAT.khoanthu, f.khoan)}</select></div>
        <div class="field"><label>Loại đăng ký <span class="req">*</span></label>
          <select id="fDk">${opts(CAT.dangky, f.dangky)}</select></div>
        <div class="field"><label>Cách tính <span class="req">*</span></label>
          <select id="fCach" onchange="TC.feeUnit()">${opts(CAT.cachtinh, f.cach)}</select></div>
        <div class="field"><label>Đơn giá <span class="req">*</span></label>
          <input type="number" id="fGia" min="0" step="1000" value="${f.gia}">
          <div class="field-hint">đồng / <span id="fDonviTxt">${esc(f.donvi)}</span>. Hiệu lực theo thời gian áp dụng của phiên bản.</div></div>
        <input type="hidden" id="fDonvi" value="${esc(f.donvi)}">
        <input type="hidden" id="fTu" value="${esc(v.tu)}">
      </div>
      <details class="adv"><summary>Quy tắc riêng theo học phần</summary>
        <div class="field" style="padding-top:4px"><label>Mã hoặc tên học phần</label>
          <input id="fHp" value="${esc(f.hocphan)}" placeholder="Bỏ trống nếu áp dụng cho mọi học phần"></div>
      </details>
    </div>
    <div class="tc-modal-foot">
      ${idx >= 0 ? `<button class="tc-btn tc-btn-danger" onclick="TC.delFee(${idx})">Xóa quy tắc</button>` : ''}
      <button class="tc-btn" onclick="TC.closeModal()">Hủy</button>
      <button class="tc-btn tc-btn-primary" onclick="TC.saveFee(${idx})">Lưu quy tắc</button></div>`);
};
TC.feeUnit = function () {
  const m = { 'Theo tín chỉ':'tín chỉ', 'Theo học phần':'học phần', 'Cố định theo học kỳ':'học kỳ' };
  const u = m[el('fCach').value] || '';
  el('fDonvi').value = u;
  const t = el('fDonviTxt'); if (t) t.textContent = u;
};
TC.saveFee = function (idx) {
  const v = V(ST.vid);
  const gia = parseInt(el('fGia').value, 10);
  if (!gia || gia <= 0) { toast('Nhập đơn giá lớn hơn 0.'); el('fGia').focus(); return; }
  const f = { scope:el('fScope').value, khoan:el('fKhoan').value, dangky:el('fDk').value,
    cach:el('fCach').value, gia, donvi:el('fDonvi').value, hocphan:el('fHp').value.trim(), tu:el('fTu').value };
  if (idx >= 0) { f.id = v.fees[idx].id; v.fees[idx] = f; log('Sửa mức thu', v.ma, f.khoan + ' · ' + vnd(gia) + ' đ'); }
  else { f.id = uid('F'); v.fees.push(f); log('Thêm mức thu', v.ma, f.khoan + ' · ' + vnd(gia) + ' đ'); }
  TC.closeModal(); toast('Đã lưu quy tắc tính.'); render();
};
TC.delFee = function (idx) {
  const v = V(ST.vid); const f = v.fees[idx];
  v.fees.splice(idx, 1); log('Xóa mức thu', v.ma, f.khoan);
  TC.closeModal(); toast('Đã xóa quy tắc.'); render();
};

/* ============================ TAB KHÁC ============================ */
function viewDocs() {
  el('view').innerHTML = `
    <div class="card">
      <div class="card-head"><div><h2>Thư viện văn bản căn cứ</h2>
        <p>${DB.documents.length} văn bản. Không xóa được văn bản đang gắn với phiên bản có hiệu lực.</p></div></div>
      <div class="tw"><table><thead><tr>
        <th>Số hiệu</th><th>Loại</th><th>Trích yếu</th><th>Ngày ban hành</th><th>Đang dùng bởi</th>
      </tr></thead><tbody>
      ${DB.documents.map(d => {
        const used = DB.versions.filter(v => v.docs.includes(d.id));
        const live = used.some(v => v.trangthai === 'Có hiệu lực');
        return `<tr>
          <td><span class="t-name num">${esc(d.so)}</span></td>
          <td>${esc(d.loai)}</td>
          <td>${esc(d.trichyeu)}</td>
          <td class="num">${dmy(d.ngay)}</td>
          <td>${used.length ? `<span class="num">${used.length} phiên bản</span>
                ${live ? '<span class="t-sub">Có bản đang hiệu lực</span>' : ''}`
               : '<span class="t-sub">Chưa dùng</span>'}</td>
        </tr>`; }).join('')}
      </tbody></table></div>
    </div>`;
}

function viewCalc() {
  el('view').innerHTML = `
    <div class="tc-g2">
      <div class="card"><div class="card-head"><div><h2>Trường hợp cần kiểm tra</h2>
        <p>Nhập mã sinh viên để hệ thống tự lấy khóa, ngành và chương trình.</p></div></div>
        <div class="card-body"><div class="tc-g2">
          <div class="field"><label>Năm học</label><select id="cNam"><option>2026–2027</option></select></div>
          <div class="field"><label>Học kỳ</label><select id="cKy"><option>Học kỳ 1</option><option>Học kỳ 2</option></select></div>
          <div class="field span2"><label>Mã sinh viên</label>
            <input id="cMsv" value="99040019" placeholder="Ví dụ: 99040019"></div>
          <div class="field"><label>Loại đăng ký</label><select id="cDk">${opts(CAT.dangky)}</select></div>
          <div class="field"><label>Số tín chỉ</label><input type="number" id="cTc" value="24" min="1"></div>
        </div>
        <div style="display:flex;justify-content:flex-end;margin-top:14px">
          <button class="tc-btn tc-btn-primary" onclick="TC.calc()">Tính số tiền</button></div></div></div>

      <div class="card"><div class="card-head"><div><h2>Kết quả</h2>
        <p>Hiển thị quy tắc được chọn và phiên bản áp dụng.</p></div></div>
        <div class="card-body" id="calcOut">
          <div class="empty"><strong>Chưa có kết quả</strong>Nhập thông tin rồi bấm “Tính số tiền”.</div>
        </div></div>
    </div>`;
}
TC.calc = function () {
  const tc = parseInt(el('cTc').value, 10) || 0, dk = el('cDk').value, msv = el('cMsv').value.trim();
  const live = DB.versions.filter(v => v.trangthai === 'Có hiệu lực');
  let hit = null, hv = null;
  live.forEach(v => v.fees.forEach(f => { if (!hit && f.khoan === 'Học phí' && f.dangky === dk) { hit = f; hv = v; } }));
  if (!hit) { el('calcOut').innerHTML = `<div class="empty"><strong>Không tìm thấy quy tắc phù hợp</strong>Chưa có phiên bản có hiệu lực khớp loại đăng ký này.</div>`; return; }
  const s = hv.scopes.find(x => x.id === hit.scope);
  const total = hit.cach === 'Theo tín chỉ' ? hit.gia * tc : hit.gia;
  el('calcOut').innerHTML = `
    <div class="chk-row"><span>Sinh viên</span><span class="chk-val num">${esc(msv)}</span></div>
    <div class="chk-row"><span>Nhóm phạm vi khớp</span><span class="chk-val">${esc(s ? scopeName(s) : '—')}</span></div>
    <div class="chk-row"><span>Phiên bản áp dụng</span><span class="chk-val num">${esc(hv.ma)}</span></div>
    <div class="chk-row"><span>Cách tính</span><span class="chk-val">${esc(hit.cach)}</span></div>
    <div class="chk-row"><span>Công thức</span><span class="chk-val num">${vnd(hit.gia)} × ${vnd(tc)} ${esc(hit.donvi)}</span></div>
    <div class="chk-row"><span><strong>Số tiền dự kiến</strong></span>
      <span class="chk-val num" style="font-size:16px;color:var(--navy)"><strong>${vnd(total)} đ</strong></span></div>
    <div class="note" style="margin-top:12px">Kết quả chỉ để kiểm tra, không tạo khoản phải thu.</div>`;
};

function viewAudit() {
  el('view').innerHTML = `
    <div class="card">
      <div class="card-head"><div><h2>Nhật ký thay đổi</h2>
        <p>${DB.audit.length} bản ghi gần nhất.</p></div></div>
      <div class="tw"><table><thead><tr>
        <th>Thời gian</th><th>Người thực hiện</th><th>Hành động</th><th>Đối tượng</th><th>Kết quả</th>
      </tr></thead><tbody>
      ${DB.audit.map(a => `<tr>
        <td class="num">${esc(a.t)}</td><td>${esc(a.ai)}</td>
        <td><span class="t-name">${esc(a.hd)}</span></td>
        <td class="num">${esc(a.dt)}</td><td>${esc(a.kq)}</td>
      </tr>`).join('')}
      </tbody></table></div>
    </div>`;
}

/* ============================ KHỞI ĐỘNG ============================ */
['versions','documents','calc','audit'].forEach(k => {
  const b = el('tab-' + k);
  if (b && !TABS_HIEN.includes(k)) b.remove();
});
if (!TABS_HIEN.includes(ST.tab)) ST.tab = TABS_HIEN[0];
render();
})();

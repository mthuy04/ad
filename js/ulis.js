/* =========================================================
   ULIS - Hệ thống quản lý thu học phí
   Mã dùng chung: dựng khung trang, ngăn chi tiết, hộp thoại,
   thông báo, tab và bộ lọc nhanh.
   Bản mô phỏng giao diện, dữ liệu là dữ liệu mẫu.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------- Danh mục màn hình ---------------- */
  var NAV = [
    { g: 'Nghiệp vụ' },
    { id: 'overview',         t: 'Tổng quan',           h: 'overview.html',         i: 'M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z' },
    { id: 'tuition-config',   t: 'Cấu hình học phí',    h: 'tuition-config.html',   i: 'M2 4h12M2 8h8M2 12h10' },
    { id: 'student-tuition',  t: 'Dữ liệu học phí',     h: 'student-tuition.html',  i: 'M2 4c0-1.1 2.7-2 6-2s6 .9 6 2-2.7 2-6 2-6-.9-6-2zM2 4v8c0 1.1 2.7 2 6 2s6-.9 6-2V4M2 8c0 1.1 2.7 2 6 2s6-.9 6-2' },
    { id: 'receivables',      t: 'Khoản phải thu',      h: 'receivables.html',      i: 'M13 5H3a1 1 0 00-1 1v7a1 1 0 001 1h10a1 1 0 001-1V6a1 1 0 00-1-1zM11 5V3.5a3 3 0 00-6 0V5' },
    { id: 'payment-requests', t: 'Yêu cầu thanh toán',  h: 'payment-requests.html', i: 'M2 3.5h12v9H2zM2 6.5h12M4.5 9.5h3' },
    { id: 'transactions',     t: 'Giao dịch',           h: 'transactions.html',     i: 'M2 6h12M11 3l3 3-3 3M14 10H2M5 13l-3-3 3-3' },
    { id: 'reconciliation',   t: 'Đối soát BIDV',       h: 'reconciliation.html',   i: 'M2.5 3h4v10h-4zM9.5 3h4v10h-4M5 8h6' },
    { id: 'exceptions',       t: 'Ngoại lệ cần xử lý',  h: 'exceptions.html',       i: 'M8 2L1.5 13.5h13zM8 6.5v3.5M8 11.5v.6' },
    { g: 'Quản lý' },
    { id: 'reports',          t: 'Báo cáo',             h: 'reports.html',          i: 'M3 2h10v12H3zM6 6h4M6 9h4M6 12h2' },
    { id: 'reminders',        t: 'Nhắc hạn',            h: 'reminders.html',        i: 'M8 1.5a4.5 4.5 0 014.5 4.5c0 4 2 5 2 5h-13s2-1 2-5A4.5 4.5 0 018 1.5zM6.5 13.5a1.5 1.5 0 003 0' },
    { g: 'Cấu hình' },
    { id: 'system-config',    t: 'Cấu hình hệ thống',   h: 'system-config.html',    i: 'M8 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4' }
  ];

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------------- Khung trang ---------------- */
  function shell() {
    var page = document.body.getAttribute('data-page') || '';
    var crumb = document.body.getAttribute('data-crumb') || 'Nghiệp vụ';
    var title = document.body.getAttribute('data-title') || '';

    var nav = NAV.map(function (n) {
      if (n.g) return '<div class="sb-label">' + esc(n.g) + '</div>';
      return '<a class="sb-item' + (n.id === page ? ' active' : '') + '" href="' + n.h + '">' +
        '<svg class="sb-ico" viewBox="0 0 16 16"><path d="' + n.i + '"/></svg>' + esc(n.t) + '</a>';
    }).join('');

    var sb = document.getElementById('sidebar');
    if (sb) {
      sb.innerHTML =
        '<div class="sb-brand"><div class="sb-brand-row">' +
          '<img src="../assets/ulis-logo.png" alt="ULIS" onerror="this.style.display=\'none\'"/>' +
          '<div><div class="sb-inst">Trường Đại học Ngoại ngữ</div>' +
          '<div class="sb-vnu">Đại học Quốc gia Hà Nội</div></div>' +
        '</div></div>' +
        '<div class="sb-nav">' + nav + '</div>';
    }

    var tb = document.getElementById('topbar');
    if (tb) {
      tb.innerHTML =
        '<div class="crumb"><span>' + esc(crumb) + '</span><span>›</span><b>' + esc(title) + '</b></div>' +
        '<div class="tb-user"><div class="tb-user-txt">' +
          '<div class="tb-dept">Phòng Kế hoạch Tài chính</div>' +
          '<div class="tb-role">Cán bộ thu học phí · Nguyễn Thị Hương</div>' +
        '</div><div class="tb-avatar">NH</div></div>';
    }
  }

  /* ---------------- Thông báo ---------------- */
  window.toast = function (msg, type) {
    var box = document.getElementById('toasts');
    if (!box) {
      box = document.createElement('div');
      box.id = 'toasts';
      document.body.appendChild(box);
    }
    var t = document.createElement('div');
    t.className = 'toast ' + (['ok', 'warn', 'err', 'info'].indexOf(type) >= 0 ? type : 'ok');
    t.innerHTML = '<span class="msg">' + esc(msg) + '</span><span class="cl">✕</span>';
    t.querySelector('.cl').onclick = function () { t.remove(); };
    box.appendChild(t);
    setTimeout(function () { if (t.parentElement) t.remove(); }, 4200);
  };

  /* ---------------- Ngăn chi tiết ---------------- */
  window.openDrawer = function (id) {
    var d = document.getElementById(id), o = document.getElementById('ov-' + id);
    if (d) d.classList.add('on');
    if (o) o.classList.add('on');
  };
  window.closeDrawer = function (id) {
    var d = document.getElementById(id), o = document.getElementById('ov-' + id);
    if (d) d.classList.remove('on');
    if (o) o.classList.remove('on');
  };

  /* ---------------- Hộp thoại ---------------- */
  window.openModal = function (id) {
    var m = document.getElementById(id);
    if (m) m.classList.add('on');
  };
  window.closeModal = function (id) {
    var m = document.getElementById(id);
    if (m) m.classList.remove('on');
  };

  /* ---------------- Tab ---------------- */
  window.showTab = function (group, name) {
    document.querySelectorAll('[data-tab-group="' + group + '"]').forEach(function (el) {
      el.classList.toggle('on', el.getAttribute('data-tab') === name);
    });
    document.querySelectorAll('[data-pane-group="' + group + '"]').forEach(function (el) {
      el.classList.toggle('on', el.getAttribute('data-pane') === name);
    });
  };

  /* ---------------- Bộ lọc nhanh dạng chip ---------------- */
  window.pickChip = function (el) {
    var row = el.parentElement;
    row.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('on'); });
    el.classList.add('on');
    var key = el.getAttribute('data-filter');
    var table = row.getAttribute('data-target');
    if (!table) return;
    var tb = document.getElementById(table);
    if (!tb) return;
    var shown = 0;
    tb.querySelectorAll('tbody tr').forEach(function (tr) {
      var tags = (tr.getAttribute('data-tags') || '').split(' ');
      var hit = key === 'all' || tags.indexOf(key) >= 0;
      tr.style.display = hit ? '' : 'none';
      if (hit) shown++;
    });
    var cnt = document.querySelector('[data-count-for="' + table + '"]');
    if (cnt) cnt.textContent = shown;
  };

  /* ---------------- Tìm kiếm tại chỗ ---------------- */
  window.filterTable = function (input, tableId) {
    var q = input.value.trim().toLowerCase();
    var tb = document.getElementById(tableId);
    if (!tb) return;
    var shown = 0;
    tb.querySelectorAll('tbody tr').forEach(function (tr) {
      var hit = !q || tr.textContent.toLowerCase().indexOf(q) >= 0;
      tr.style.display = hit ? '' : 'none';
      if (hit) shown++;
    });
    var cnt = document.querySelector('[data-count-for="' + tableId + '"]');
    if (cnt) cnt.textContent = shown;
  };

  /* ---------------- Tiện ích ---------------- */
  window.vnd = function (n) {
    return Number(n || 0).toLocaleString('vi-VN');
  };
  window.notReady = function (what) {
    window.toast((what || 'Chức năng này') + ' sẽ có ở bản chạy thật.', 'info');
  };

  /* ---------------- Sự kiện chung ---------------- */
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('dov')) {
      e.target.classList.remove('on');
      var id = e.target.id.replace(/^ov-/, '');
      var d = document.getElementById(id);
      if (d) d.classList.remove('on');
    }
    if (e.target.classList.contains('mov')) e.target.classList.remove('on');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.drw.on,.dov.on,.mov.on').forEach(function (el) {
      el.classList.remove('on');
    });
  });

  document.addEventListener('DOMContentLoaded', shell);
})();

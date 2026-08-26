/* ULIS Admin — Shared JavaScript
   Multi-page static version
   No auth state, no SPA routing
*/

/* ===================== SAFE DOM HELPER ===================== */
function $(id) {
  return document.getElementById(id);
}

function safeText(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ===================== MODAL ===================== */
function openModal(id) {
  var modal = $(id);
  if (!modal) return;
  modal.classList.add('open');
}

function closeModal(id) {
  var modal = $(id);
  if (!modal) return;
  modal.classList.remove('open');
}

function closeAllModals() {
  document.querySelectorAll('.overlay.open').forEach(function(modal) {
    modal.classList.remove('open');
  });
}

/* ===================== DRAWER ===================== */
function openDrawer(id) {
  var overlay = $('ov-' + id);
  var drawer = $(id);

  if (overlay) overlay.classList.add('open');
  if (drawer) drawer.classList.add('open');
}

function closeDrawer(id) {
  var overlay = $('ov-' + id);
  var drawer = $(id);

  if (overlay) overlay.classList.remove('open');
  if (drawer) drawer.classList.remove('open');
}

function closeAllDrawers() {
  document.querySelectorAll('.drawer-overlay.open').forEach(function(overlay) {
    overlay.classList.remove('open');
  });

  document.querySelectorAll('.drawer.open').forEach(function(drawer) {
    drawer.classList.remove('open');
  });
}

/* ===================== TOAST ===================== */
function showToast(msg, type) {
  type = type || 'success';

  var allowedTypes = ['success', 'error', 'warning', 'info'];
  if (allowedTypes.indexOf(type) === -1) type = 'info';

  var container = $('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;

  toast.innerHTML =
    '<span class="toast-msg">' + safeText(msg) + '</span>' +
    '<span class="toast-close" onclick="this.parentElement.remove()">&#x2715;</span>';

  container.appendChild(toast);

  setTimeout(function() {
    if (toast.parentElement) toast.remove();
  }, 4000);
}

/* ===================== USER MENU ===================== */
function toggleUserMenu() {
  var dropdown = $('userDropdown');
  if (dropdown) dropdown.classList.toggle('open');
}

function closeUserMenu() {
  var dropdown = $('userDropdown');
  if (dropdown) dropdown.classList.remove('open');
}

/* ===================== IMPORT TABS ===================== */
function switchImportTab(tab) {
  var normalized = tab;

  if (tab === 'new') normalized = 'import-new';
  if (tab === 'history') normalized = 'import-history';
  if (tab === 'upload') normalized = 'import-new';
  if (tab === 'preview') normalized = 'import-new';
  if (tab === 'result') normalized = 'import-new';

  var newTabs = ['import-new', 'import-history'];

  newTabs.forEach(function(t) {
    var tabEl = $('tab-' + t);
    var paneEl = $('pane-' + t);

    if (tabEl) tabEl.classList.toggle('active', t === normalized);
    if (paneEl) paneEl.classList.toggle('active', t === normalized);
  });

  var oldTabs = ['upload', 'preview', 'result'];

  oldTabs.forEach(function(t) {
    var tabEl = $('tab-imp-' + t);
    var paneEl = $('pane-imp-' + t);
    var isActive = t === tab;

    if (tabEl) tabEl.classList.toggle('active', isActive);
    if (paneEl) paneEl.classList.toggle('active', isActive);
  });
}

/* ===================== IMPORT ACTIONS ===================== */
function simulateImport() {
  switchImportTab('import-new');

  var uploadArea = $('import-upload-area');
  var resultArea = $('import-result');

  if (uploadArea) uploadArea.classList.add('hidden');
  if (resultArea) resultArea.classList.remove('hidden');

  showToast('Đã kiểm tra file nhập dữ liệu.', 'success');
}

function cancelImport() {
  var uploadArea = $('import-upload-area');
  var resultArea = $('import-result');

  if (resultArea) resultArea.classList.add('hidden');
  if (uploadArea) uploadArea.classList.remove('hidden');

  showToast('Đã hủy thao tác nhập dữ liệu.', 'info');
}

function confirmImport() {
  var modal = $('modal-confirm-import');

  if (modal) {
    openModal('modal-confirm-import');
    return;
  }

  showToast('Đã nhập dữ liệu và sinh khoản phải thu.', 'success');
}

/* ===================== REMINDER TABS ===================== */
function switchReminderTab(tab) {
  ['config', 'history'].forEach(function(t) {
    var tabEl = $('tab-rem-' + t);
    var paneEl = $('pane-rem-' + t);

    if (tabEl) tabEl.classList.toggle('active', t === tab);
    if (paneEl) paneEl.classList.toggle('active', t === tab);
  });
}

/* ===================== ACCORDION ===================== */
function toggleAcc(id) {
  var card = $(id);
  var body = $('body-' + id);

  if (!card || !body) return;

  var isOpen = card.classList.contains('open');

  card.classList.toggle('open', !isOpen);
  body.classList.toggle('open', !isOpen);
}

/* ===================== RECONCILIATION ===================== */
function runRecon() {
  var btn = $('btn-run-recon');
  if (!btn) return;

  var originalText = btn.textContent;

  btn.textContent = 'Đang xử lý...';
  btn.disabled = true;
  btn.style.opacity = '.55';

  setTimeout(function() {
    btn.textContent = originalText || 'Chạy lại';
    btn.disabled = false;
    btn.style.opacity = '1';

    var wf3 = $('wf3');
    var wf4 = $('wf4');

    if (wf3) wf3.className = 'wf-step done';
    if (wf4) wf4.className = 'wf-step active';

    showToast('Đã chạy lại đối soát thành công.', 'success');
  }, 900);
}

/* ===================== RECEIVABLES ADJUSTMENT ===================== */
function submitAdjustRcv() {
  var amountInput = $('adjust-rcv-amount');
  var reasonInput = $('adjust-rcv-reason');
  var amount = amountInput ? amountInput.value.trim() : '';
  var reason = reasonInput ? reasonInput.value.trim() : '';

  if (!amount || !reason) {
    showToast('Vui lòng nhập đầy đủ số tiền mới và lý do điều chỉnh.', 'error');
    return;
  }

  var formattedAmount = Number(amount).toLocaleString('vi-VN');
  var timeline = $('rcv-timeline');

  if (timeline) {
    var row = document.createElement('div');
    row.className = 'tl-row';
    row.innerHTML =
      '<div class="tl-dot done"></div>' +
      '<div class="tl-content">' +
      '<div class="tl-label">Điều chỉnh khoản phải thu</div>' +
      '<div class="tl-time">30/10/2025 09:15 — Số tiền mới ' + safeText(formattedAmount) + ' đ · Lý do: ' + safeText(reason) + '</div>' +
      '</div>';
    timeline.appendChild(row);
  }

  if (amountInput) amountInput.value = '';
  if (reasonInput) reasonInput.value = '';

  closeModal('modal-adjust-rcv');
  showToast('Đã lưu điều chỉnh khoản phải thu.', 'success');
}

/* ===================== REPORT SELECTION ===================== */
function selectReport(el, title, sub) {
  document.querySelectorAll('.report-item').forEach(function(item) {
    item.classList.remove('active');
  });

  if (el) el.classList.add('active');

  var titleEl = $('rpt-title');
  var subEl = $('rpt-sub');

  if (titleEl) titleEl.textContent = title || '';
  if (subEl) subEl.textContent = sub || '';
}

/* ===================== UI EVENTS ===================== */
document.addEventListener('click', function(e) {
  var trigger = $('userMenuTrigger');
  var dropdown = $('userDropdown');

  if (trigger && dropdown && !trigger.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove('open');
  }

  if (e.target.classList && e.target.classList.contains('overlay')) {
    e.target.classList.remove('open');
  }

  if (e.target.classList && e.target.classList.contains('drawer-overlay')) {
    e.target.classList.remove('open');

    var drawerId = e.target.id ? e.target.id.replace(/^ov-/, '') : '';
    var drawer = drawerId ? $(drawerId) : null;

    if (drawer) drawer.classList.remove('open');
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeUserMenu();
    closeAllModals();
    closeAllDrawers();
  }
});

/* ===================== SORT COLUMN TOGGLE ===================== */
document.addEventListener('DOMContentLoaded', function() {
  /* Đồng nhất thanh điều hướng: breadcrumb một dòng, ngắn gọn như bản thiết kế đã duyệt. */
  var breadcrumb = document.querySelector('#topbar .topbar-crumb');

  if (breadcrumb) {
    var root = breadcrumb.querySelector('.crumb-root');
    var page = breadcrumb.querySelector('.crumb-page');
    var rootLabel = root ? root.textContent.trim() : '';
    var pageLabel = page ? page.textContent.trim() : '';

    breadcrumb.removeAttribute('style');
    breadcrumb.innerHTML = '';

    if (rootLabel) {
      var rootSpan = document.createElement('span');
      rootSpan.className = 'crumb-root';
      rootSpan.textContent = rootLabel;
      breadcrumb.appendChild(rootSpan);
    }

    if (pageLabel && pageLabel !== rootLabel) {
      var separator = document.createElement('span');
      separator.className = 'crumb-sep';
      separator.setAttribute('aria-hidden', 'true');
      separator.textContent = '›';
      breadcrumb.appendChild(separator);

      var pageSpan = document.createElement('span');
      pageSpan.className = 'crumb-page';
      pageSpan.textContent = pageLabel;
      breadcrumb.appendChild(pageSpan);
    }
  }

  document.querySelectorAll('thead th.sortable').forEach(function(th) {
    th.addEventListener('click', function() {
      var thead = this.closest('thead');
      var isAsc = this.classList.contains('sort-asc');

      if (thead) {
        thead.querySelectorAll('th').forEach(function(item) {
          item.classList.remove('sort-asc', 'sort-desc');
        });
      }

      this.classList.add(isAsc ? 'sort-desc' : 'sort-asc');
    });
  });

  document.querySelectorAll('.acc-card.open').forEach(function(card) {
    var body = $('body-' + card.id);
    if (body) body.classList.add('open');
  });
});

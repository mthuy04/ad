(function () {
  'use strict';

  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var page = file.replace('.html', '').replace(/[^a-z0-9-]/g, '');
  document.body.classList.add('demo-lean', 'demo-' + page);

  function all(selector, root) { return Array.from((root || document).querySelectorAll(selector)); }
  function hide(el) { if (el) el.classList.add('demo-hidden'); }
  function hideAll(selector, root) { all(selector, root).forEach(hide); }
  function hideAfter(selector, keep, root) { all(selector, root).forEach(function (el, i) { if (i >= keep) hide(el); }); }
  function hideExcept(selector, indexes, root) {
    all(selector, root).forEach(function (el, i) { if (indexes.indexOf(i) === -1) hide(el); });
  }
  function cleanSticky(root) {
    all('[class*="sticky"]', root).forEach(function (el) {
      Array.from(el.classList).forEach(function (name) {
        if (name.indexOf('sticky') !== -1) el.classList.remove(name);
      });
      el.style.left = '';
      el.style.right = '';
      el.style.position = '';
    });
  }
  function compactStaticTable(tableSelector, columns, labels, maxRows) {
    var table = document.querySelector(tableSelector);
    if (!table || table.dataset.demoCompacted === '1') return;
    var sourceHead = table.querySelector('thead tr');
    var sourceRows = all('tbody tr', table).slice(0, maxRows || 6);
    if (!sourceHead || !sourceRows.length) return;

    var head = document.createElement('thead');
    var headRow = document.createElement('tr');
    columns.forEach(function (column, index) {
      var sourceCell = sourceHead.children[column];
      var cell = sourceCell ? sourceCell.cloneNode(true) : document.createElement('th');
      cell.textContent = labels[index] || cell.textContent;
      cell.removeAttribute('style');
      cleanSticky(cell);
      headRow.appendChild(cell);
    });
    head.appendChild(headRow);

    var body = document.createElement('tbody');
    sourceRows.forEach(function (sourceRow) {
      var row = sourceRow.cloneNode(false);
      columns.forEach(function (column) {
        var sourceCell = sourceRow.children[column];
        if (!sourceCell) return;
        var cell = sourceCell.cloneNode(true);
        cell.classList.remove('demo-col-hidden');
        cell.removeAttribute('style');
        cleanSticky(cell);
        row.appendChild(cell);
      });
      body.appendChild(row);
    });

    table.innerHTML = '';
    table.appendChild(head);
    table.appendChild(body);
    table.dataset.demoCompacted = '1';
    table.classList.add('demo-compact-table');
  }
  function hideTabByText(selector, words) {
    all(selector).forEach(function (el) {
      var label = (el.textContent || '').trim().toLowerCase();
      if (words.some(function (word) { return label.indexOf(word.toLowerCase()) !== -1; })) hide(el);
    });
  }
  function hideSecondaryNav() {
    var hiddenPages = ['reconciliation.html', 'exceptions.html', 'reports.html', 'reminders.html', 'system-config.html'];
    hiddenPages.forEach(function (href) { hideAll('.nav-item[href="' + href + '"]'); });
    all('.nav-section-title,.sidebar-group-label').forEach(function (title) {
      var next = title.nextElementSibling;
      var hasVisibleItem = false;
      while (next && !next.classList.contains('nav-section-title') && !next.classList.contains('sidebar-group-label')) {
        if (next.classList && next.classList.contains('nav-item') && !next.classList.contains('demo-hidden')) hasVisibleItem = true;
        next = next.nextElementSibling;
      }
      if (!hasVisibleItem) hide(title);
    });
  }

  hideSecondaryNav();

  if (page === 'overview') {
    hide(document.getElementById('filterSnapshot'));
    hide(document.getElementById('btnAdvanced'));
    hide(document.getElementById('btnExport'));
    hide(document.getElementById('advancedPanel'));
    hide(document.querySelector('.money-flow'));

    var rows = all('.overview-page > .two-col');
    if (rows.length > 1 && rows[0].children[1] && rows[1].children[0]) {
      hide(rows[0].children[1]);
      rows[0].appendChild(rows[1].children[0]);
      hide(rows[1]);
    }
    all('.overview-page > .section-card').forEach(function (card) {
      var title = card.querySelector('.section-title');
      var text = title ? title.textContent.trim() : '';
      if (text === 'Tình hình đối soát ngân hàng' || text === 'Cảnh báo cần xử lý') hide(card);
    });
    hide(document.querySelector('.overview-page > .table-wrap-ov'));
    hideExcept('#donutMetric button', [0]);

    function buildOverviewFollowup() {
      var sourceCases = all('#caseTableBody tr[data-case-index]').slice(0, 5);
      if (!sourceCases.length || document.querySelector('.demo-overview-table')) return false;
      var followup = document.createElement('section');
      followup.className = 'demo-overview-table';
      followup.innerHTML = '<div class="demo-overview-table__head"><div><strong>Khoản cần theo dõi</strong><span>5 trường hợp ưu tiên trong phạm vi đang chọn</span></div><button type="button" class="btn-ov" onclick="location.href=\'receivables.html\'">Xem tất cả khoản phải thu</button></div><div class="table-scroll"><table><thead><tr><th>Sinh viên</th><th>Khoản mục</th><th>Số tiền</th><th>Trạng thái</th><th>Việc cần theo dõi</th><th>Mức độ</th><th>Thao tác</th></tr></thead><tbody></tbody></table></div>';
      var targetBody = followup.querySelector('tbody');
      sourceCases.forEach(function (sourceRow) {
        var cells = sourceRow.children;
        var row = document.createElement('tr');
        row.innerHTML = '<td class="demo-student"><strong>' + (cells[2] ? cells[2].textContent.trim() : '') + '</strong><span>' + (cells[3] ? cells[3].textContent.trim() : '') + '</span></td><td>' + (cells[4] ? cells[4].innerHTML : '') + '</td><td class="demo-amount">' + (cells[5] ? cells[5].innerHTML : '') + '</td><td>' + (cells[6] ? cells[6].innerHTML : '') + '</td><td class="demo-issue">' + (cells[9] ? cells[9].textContent.trim() : '') + '</td><td>' + (cells[10] ? cells[10].innerHTML : '') + '</td><td><button type="button" class="btn-ov sm">Xem</button></td>';
        row.querySelector('button').addEventListener('click', function () { sourceRow.click(); });
        targetBody.appendChild(row);
      });
      var chartRow = document.querySelector('.overview-page > .two-col:not(.demo-hidden)');
      if (chartRow) chartRow.insertAdjacentElement('afterend', followup);
      return true;
    }
    if (!buildOverviewFollowup()) {
      var caseBody = document.getElementById('caseTableBody');
      if (caseBody) {
        var caseObserver = new MutationObserver(function () {
          if (buildOverviewFollowup()) caseObserver.disconnect();
        });
        caseObserver.observe(caseBody, { childList: true });
      }
    }
  }

  // Trang tuition-config đã được thay bằng mô-đun riêng (.tc-scope) có markup mới.
  // Khối tuỳ biến cũ nhắm vào .cf-* / #versionTable đã bỏ vì không còn phần tử tương ứng.





})();

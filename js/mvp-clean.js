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

  if (page === 'tuition-config') {
    var title = document.querySelector('.cf-title,h1');
    var subtitle = document.querySelector('.cf-subtitle,.cf-head-sub');
    if (title) title.textContent = 'Khung học phí';
    if (subtitle) subtitle.textContent = 'Thiết lập phạm vi áp dụng và mức thu trước khi tạo khoản phải thu.';
    hideTabByText('.main-tab,.cf-tab', ['văn bản căn cứ', 'nhật ký thay đổi', 'kiểm toán', 'tham chiếu']);
    all('#mainTabs .cf-tab').forEach(function (tab) {
      var target = tab.getAttribute('data-tab');
      if (target === 'versions') tab.textContent = 'Khung học phí';
      if (target === 'rules') tab.textContent = 'Quy tắc tính';
      if (target === 'calculator') tab.textContent = 'Thử tính nhanh';
    });
    hide(document.querySelector('#panel-versions .cf-summary'));
    hideExcept('#panel-versions .cf-filters > *', [0, 1, 3]);
    hideExcept('.cf-head-actions > *', [1]);
    hideAfter('.cf-toolbar-left > *', 1);
    all('#versionTable tbody .cf-actions').forEach(function (group) { hideAfter(':scope > *', 1, group); });
    hideAll('#panel-versions .cf-card-head > button');

    var toolbar = document.querySelector('#panel-versions .cf-toolbar');
    if (toolbar && !document.querySelector('.demo-config-status')) {
      var status = document.createElement('div');
      status.className = 'demo-config-status';
      status.innerHTML = '<span><b>3</b> đang soạn</span><span><b>2</b> chờ duyệt</span><span class="active"><b>2</b> có hiệu lực</span>';
      toolbar.insertAdjacentElement('beforebegin', status);
    }
    compactStaticTable('#versionTable', [0, 1, 2, 3, 6, 8, 11], ['Khung học phí', 'Năm học', 'Học kỳ', 'Hiệu lực', 'Số quy tắc', 'Trạng thái', 'Thao tác'], 5);

    hideExcept('#panel-rules .cf-filters > *', [0, 3, 15]);
    hideAll('#panel-rules .cf-card-head .cf-head-actions,#panel-rules .cf-card-head .cf-actions,#panel-rules .cf-card-head > button');
    compactStaticTable('#panel-rules table.cf-table', [0, 1, 2, 5, 6, 8, 10], ['Quy tắc', 'Phiên bản', 'Phạm vi', 'Cách tính', 'Đơn giá', 'Trạng thái', 'Thao tác'], 5);

    var calculatorFields = all('#panel-calculator .cf-card:first-child .cf-card-body > .cf-grid2 > *');
    calculatorFields.forEach(function (field, index) {
      if ([1, 2, 7, 11, 12].indexOf(index) === -1) hide(field);
    });
  }

  if (page === 'student-tuition') {
    hideTabByText('.td-tab,.main-tab', ['lịch sử nhập']);
    hideAll('.advanced-toggle,.advanced-panel,.saved-filter,.technical-note,.tech-only');
    hideAll('.stepper-wrap');

    var stepOneCard = document.querySelector('#step-1 .td-card');
    if (stepOneCard) {
      stepOneCard.classList.add('lean-import-card');
      stepOneCard.innerHTML = '<div class="td-card-head"><div><div class="td-card-title">Thông tin lô nhập</div><div class="td-card-sub">Chọn đúng phạm vi trước khi tải tệp học phí.</div></div><span class="status-badge neutral" id="leanUploadStatus">Chưa tải tệp</span></div>' +
        '<div class="td-card-body">' +
          '<div class="lean-year-row"><div class="lean-year-filter"><label for="academicYear">Năm học</label><select id="academicYear" class="td-select"><option>2025–2026</option><option selected>2026–2027</option></select></div><button type="button" class="td-btn sm" onclick="openCollectionRoundModal()">+ Tạo đợt thu</button></div>' +
          '<div class="lean-import-rule"></div>' +
          '<div class="lean-required-title">Bắt buộc trước khi tải tệp</div>' +
          '<div class="lean-import-grid">' +
            '<div class="td-field"><label class="required" for="collectionRound">Đợt thu</label><select class="td-select prereq" id="collectionRound"><option value="">Chọn đợt thu</option><option selected>Đợt thu học phí chính</option><option>Đợt thu bổ sung 1</option></select></div>' +
            '<div class="td-field"><label class="required" for="semester">Học kỳ</label><select class="td-select" id="semester"><option selected>Học kỳ 1 năm học 2026–2027</option><option>Học kỳ 2 năm học 2026–2027</option><option>Học kỳ phụ năm học 2026–2027</option></select></div>' +
          '</div>' +
          '<div class="lean-policy-note">Số tiền lấy từ tệp. Hệ thống kiểm tra trước khi ghi; dòng cảnh báo, lỗi, trùng hoặc xung đột không được tạo khoản phải thu.</div>' +
          '<div class="lean-import-rule"></div>' +
          '<div class="td-actions-row"><div class="td-actions-left"><span class="lean-template-note">Tệp mẫu được sinh theo đợt thu và học kỳ đang chọn.</span></div><div class="td-actions-right"><button class="td-btn" id="btnTemplate" onclick="downloadTemplate()">⇩ Tải tệp mẫu</button><button class="td-btn primary" id="btnChooseStep1" onclick="chooseFile()">📎 Chọn tệp và kiểm tra</button></div></div>' +
          '<div class="lean-fixed-meta" aria-hidden="true"><input id="batchName" value="Nhập học phí HK1 2026–2027 – 25/08/2026"><select id="source"><option selected>Phòng Kế hoạch Tài chính</option></select><select id="importMode"><option selected>Nhập số tiền từ file</option></select><select id="filePolicy"><option selected>Chỉ các dòng hợp lệ</option></select></div>' +
        '</div>';
    }

    if (!document.getElementById('collectionRoundModal')) {
      document.body.insertAdjacentHTML('beforeend', '<div class="td-overlay" id="collectionRoundModal" aria-hidden="true"><div class="td-modal lean-round-modal"><div class="td-modal-head"><div><div class="td-modal-title">Tạo đợt thu</div><div class="td-card-sub">Đợt thu được dùng làm phạm vi cho lô dữ liệu học phí.</div></div><button class="td-btn ghost" type="button" onclick="closeCollectionRoundModal()">✕</button></div><div class="td-modal-body"><div class="td-field"><label class="required" for="leanRoundName">Tên đợt thu</label><input class="td-input" id="leanRoundName" value="Học phí học kỳ 1"></div><div class="td-grid-2 lean-round-grid"><div class="td-field"><label class="required" for="leanRoundYear">Năm học</label><select class="td-select" id="leanRoundYear"><option selected>2026–2027</option></select></div><div class="td-field"><label class="required" for="leanRoundSemester">Học kỳ</label><select class="td-select" id="leanRoundSemester"><option selected>Học kỳ 1</option><option>Học kỳ 2</option><option>Học kỳ phụ</option></select></div><div class="td-field lean-code-field"><label for="leanRoundCode">Mã đợt thu</label><input class="td-input" id="leanRoundCode" value="HP-HK1-2026" readonly><span>Mã được hệ thống sinh tự động.</span></div><div></div><div class="td-field"><label class="required" for="leanRoundOpen">Ngày mở</label><input class="td-input" id="leanRoundOpen" type="date" value="2026-08-25"></div><div class="td-field"><label class="required" for="leanRoundDue">Hạn nộp mặc định</label><input class="td-input" id="leanRoundDue" type="date" value="2026-09-30"></div></div></div><div class="td-modal-foot"><button class="td-btn" type="button" onclick="closeCollectionRoundModal()">Hủy</button><button class="td-btn primary" type="button" onclick="createCollectionRound()">Tạo đợt thu</button></div></div></div>');
    }

    window.openCollectionRoundModal = function () {
      var modal = document.getElementById('collectionRoundModal');
      if (modal) { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); }
    };
    window.closeCollectionRoundModal = function () {
      var modal = document.getElementById('collectionRoundModal');
      if (modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
    };
    window.createCollectionRound = function () {
      var name = document.getElementById('leanRoundName');
      var openDate = document.getElementById('leanRoundOpen');
      var dueDate = document.getElementById('leanRoundDue');
      if (!name || !name.value.trim() || !openDate.value || !dueDate.value) {
        if (typeof mockToast === 'function') mockToast('Vui lòng nhập đủ thông tin bắt buộc.', 'warning');
        return;
      }
      if (openDate.value > dueDate.value) {
        if (typeof mockToast === 'function') mockToast('Hạn nộp phải sau ngày mở.', 'warning');
        return;
      }
      var round = document.getElementById('collectionRound');
      if (round) {
        var option = document.createElement('option');
        option.textContent = name.value.trim();
        option.value = name.value.trim();
        option.selected = true;
        round.appendChild(option);
      }
      closeCollectionRoundModal();
      if (typeof mockToast === 'function') mockToast('Đã tạo và chọn đợt thu ' + name.value.trim() + '.', 'success');
    };

    hideAll('.summary-table-wrap,.preview-toolbar .second,.column-menu,.preview-table-head > span:last-child');
    hideExcept('.file-card .file-cell', [0, 3, 4, 5, 6]);
    hideExcept('.preview-toolbar .toolbar-grid:first-child > *', [0, 4]);
    hideAll('.preview-table-shell .table-footer .page-controls');
    hide(document.querySelector('#step-3 .td-card[style*="margin-top:20px"]'));
    hideExcept('#importSuccess .success-metric', [0, 1, 4, 7]);
    hideExcept('#importSuccess .td-actions-right > *', [0, 3]);

    window.onRealFileSelected = function (event) {
      var fileInput = event && event.target;
      if (!fileInput || !fileInput.files || !fileInput.files[0]) return;
      var selectedName = document.getElementById('selectedFileName');
      var resultName = document.getElementById('resultFileName');
      if (selectedName) selectedName.textContent = fileInput.files[0].name;
      if (resultName) resultName.textContent = fileInput.files[0].name;
      var status = document.getElementById('leanUploadStatus');
      if (status) status.textContent = 'Đã tải tệp';
      if (typeof goStep === 'function') goStep(2);
      if (typeof mockToast === 'function') mockToast('Đã nhận tệp. Hệ thống đang kiểm tra dữ liệu.', 'info');
      setTimeout(function () { if (typeof runValidation === 'function') runValidation(); }, 180);
    };
  }

  if (page === 'receivables') {
    hide(document.querySelector('.rv-desc'));
    hideAfter('.finance-grid > *', 3);
    hide(document.querySelector('.ops-strip'));
    hideExcept('.quick-bar .quick-chip', [0, 4, 5]);
    hideExcept('.filter-main > *', [0, 1, 4, 6]);
    hideAll('.advanced-toggle,.advanced-panel');
    hideAfter('.rv-actions > *', 3);
    hideExcept('.bulk-actions button,.bulk-bar button', [0, 1, 3]);
    hideAll('.table-tools .density-toggle,.table-tools > button');
    hideAll('.table-footer');
    hideTabByText('.detail-tab', ['điều chỉnh', 'kiểm toán']);

    var detailMeta = document.querySelector('#view-detail .detail-meta');
    var detailState = document.querySelector('#view-detail .state-row');
    if (detailMeta) detailMeta.innerHTML = '<span class="student-link" onclick="showStudentProfile()">23040218 · Nguyễn Minh Anh</span> · Đợt thu học phí chính · Học kỳ 1/2026–2027';
    if (detailState) detailState.innerHTML = '<span class="status-pill life-published">Đã phát hành</span><span class="status-pill pay-paid">Đã thu đủ</span><span class="status-pill due-future">Hoàn thành đúng hạn</span>';

    var detailOverview = document.getElementById('detail-overview');
    if (detailOverview) detailOverview.innerHTML = `<div class="grid-2"><div class="detail-card"><div class="detail-card-head">Thông tin khoản phải thu</div><div class="detail-card-body"><dl class="dl-grid"><dt>Mã khoản</dt><dd>RCV-2026-00124</dd><dt>Sinh viên</dt><dd class="student-link" onclick="showStudentProfile()">23040218 · Nguyễn Minh Anh</dd><dt>Đợt thu</dt><dd>Đợt thu học phí chính</dd><dt>Khoản mục</dt><dd>Học phí chính quy</dd><dt>Nguồn hình thành</dt><dd>Tính từ khung học phí</dd><dt>Hạn nộp</dt><dd>30/09/2026</dd><dt>Ngày tạo</dt><dd>20/08/2026 09:18</dd><dt>Ngày phát hành</dt><dd>21/08/2026 14:05</dd><dt>Người phát hành</dt><dd>Nguyễn Thị Hương</dd></dl></div></div><div class="detail-card"><div class="detail-card-head">Tài chính</div><div class="detail-card-body"><div class="money-formula"><div class="formula-row"><span>Số tiền cơ sở</span><strong>48.000.000 ₫</strong></div><div class="formula-row"><span>Điều chỉnh đã áp dụng</span><strong>0 ₫</strong></div><div class="formula-row total"><span>Số tiền cuối cùng</span><strong>48.000.000 ₫</strong></div><div class="formula-row"><span>Đã ghi nhận</span><strong style="color:#047857">48.000.000 ₫</strong></div><div class="formula-row"><span>Còn phải thu</span><strong>0 ₫</strong></div><div class="formula-row"><span>Nộp thừa</span><strong>0 ₫</strong></div></div></div></div></div>`;

    var detailBasis = document.getElementById('detail-basis');
    if (detailBasis) detailBasis.innerHTML = `<div class="detail-card"><div class="detail-card-head">Chi tiết và căn cứ tính</div><div class="detail-card-body"><div class="scroll-x"><table class="mini-table"><thead><tr><th>Nhóm học phần</th><th>Số tín chỉ</th><th>Cách tính</th><th>Đơn giá</th><th>Hệ số</th><th>Thành tiền</th></tr></thead><tbody><tr><td>Học phần đăng ký HK1</td><td>24</td><td>Theo tín chỉ</td><td class="amount">2.000.000 ₫</td><td>1,0</td><td class="amount">48.000.000 ₫</td></tr></tbody></table></div><div style="margin-top:14px"><dl class="dl-grid"><dt>Phiên bản khung học phí</dt><dd>FRAME-2026-HK1-DHCQ-v1</dd><dt>Quy tắc áp dụng</dt><dd>RULE-DHCQ-CREDIT-001</dd><dt>Khoảng hiệu lực</dt><dd>01/08/2026 – 31/01/2027</dd><dt>Văn bản căn cứ</dt><dd>1186/QĐ-ĐHNN</dd><dt>Kết quả kiểm tra</dt><dd><span class="status-pill pay-paid">Hợp lệ</span></dd></dl></div></div></div>`;

    var detailPayments = document.getElementById('detail-payments');
    if (detailPayments) detailPayments.innerHTML = `<div class="grid-2"><div class="detail-card"><div class="detail-card-head">Yêu cầu thanh toán và giao dịch</div><div class="detail-card-body"><div class="scroll-x"><table class="mini-table"><thead><tr><th>Yêu cầu thanh toán</th><th>Giao dịch</th><th>Số tiền</th><th>Thời điểm</th><th>Trạng thái</th></tr></thead><tbody><tr><td>PR-260825-0041</td><td>TXN-260825-0016</td><td class="amount">48.000.000 ₫</td><td>25/08/2026 09:07</td><td><span class="status-pill pay-paid">Đã ghi nhận</span></td></tr></tbody></table></div></div></div><div class="detail-card"><div class="detail-card-head">Khóa thanh toán</div><div class="detail-card-body"><dl class="dl-grid"><dt>Trạng thái</dt><dd><span class="status-pill pay-paid">Đã giải phóng</span></dd><dt>Số tiền khóa</dt><dd>48.000.000 ₫</dd><dt>Yêu cầu thanh toán</dt><dd>PR-260825-0041</dd><dt>Thời điểm giải phóng</dt><dd>25/08/2026 09:07</dd><dt>Cần can thiệp</dt><dd>Không</dd></dl></div></div></div>`;

    var studentName = document.querySelector('#view-student .student-name');
    var studentMeta = document.querySelector('#view-student .student-meta');
    var profileMeta = document.querySelector('#view-student .detail-meta');
    if (studentName) studentName.textContent = 'Nguyễn Minh Anh';
    if (studentMeta) studentMeta.textContent = '23040218 · QH.2023 · NNA23A · Ngôn ngữ Anh';
    if (profileMeta) profileMeta.textContent = 'Tổng hợp công nợ theo năm học và đợt thu';
    var profileValues = ['64.763.600 ₫', '63.500.000 ₫', '1.263.600 ₫', '0 ₫'];
    all('#view-student .profile-kpi .pk-value').forEach(function (el, index) { if (profileValues[index]) el.textContent = profileValues[index]; });
    var profileTable = document.querySelector('#view-student .mini-table tbody');
    if (profileTable) profileTable.innerHTML = '<tr><td>RCV-2026-00124</td><td>HK1/2026–2027</td><td class="amount">48.000.000 ₫</td><td class="amount green">48.000.000 ₫</td><td class="amount">0 ₫</td><td><span class="status-pill pay-paid">Đã thu</span></td></tr><tr><td>RCV-2025-07114</td><td>HK2/2025–2026</td><td class="amount">15.500.000 ₫</td><td class="amount green">15.500.000 ₫</td><td class="amount">0 ₫</td><td><span class="status-pill pay-paid">Đã thu</span></td></tr><tr><td>RCV-2026-BHYT-024</td><td>BHYT 2026–2027</td><td class="amount">1.263.600 ₫</td><td class="amount">0 ₫</td><td class="amount amber">1.263.600 ₫</td><td><span class="status-pill due-future">Chưa đến hạn</span></td></tr>';
    var profileAttention = document.querySelector('#view-student .grid-2 .detail-card:nth-child(2) .detail-card-body');
    if (profileAttention) profileAttention.innerHTML = '<dl class="dl-grid"><dt>Khoản quá hạn</dt><dd>0 khoản</dd><dt>Khoản đang có khóa</dt><dd>0 khoản</dd><dt>Khoản chưa đến hạn</dt><dd>1 khoản · 1.263.600 ₫</dd><dt>Tạm dừng nhắc</dt><dd>Không</dd></dl>';
    var manualStudent = document.querySelector('#manualModal input');
    if (manualStudent) manualStudent.value = '23040218';
  }

  if (page === 'payment-requests') {
    hide(document.querySelector('.pr-desc'));
    hideTabByText('.main-tab', ['cần xử lý', 'nhật ký bidv', 'định danh thanh toán']);
    hideExcept('.kpi-grid > *', [0, 1, 3]);
    hide(document.querySelector('.ops-strip'));
    hideExcept('.quick-bar .quick-chip', [0, 1, 3, 4]);
    hideExcept('.filter-main > *', [0, 1, 3, 6]);
    hideAll('.advanced-toggle,.advanced-panel,.active-filters');
    hideExcept('.pr-head .pr-actions > *', [0]);
    hideAll('.table-tools .density-toggle,.table-tools > button');
    hideAll('.table-card > .pagination,.table-footer');
    hideTabByText('.detail-tab', ['quá trình tạo', 'khóa khoản', 'nhật ký bidv', 'xử lý sự cố']);

    all('.filter-main input[type="date"]').forEach(function (input) { input.value = '2026-08-25'; });

    var primaryRequest = document.querySelector('#requestBody tr');
    if (primaryRequest) {
      primaryRequest.dataset.status = 'PAID';
      primaryRequest.dataset.ops = 'Bình thường';
    }

    var requestTitle = document.getElementById('detailTitle');
    var requestMeta = document.getElementById('detailMeta');
    var requestState = document.querySelector('#view-detail .state-row');
    if (requestTitle) requestTitle.textContent = 'PR-260825-0041';
    if (requestMeta) requestMeta.textContent = 'BILL-26V001-000041 · 23040218 · Nguyễn Minh Anh · 48.000.000 ₫';
    if (requestState) requestState.innerHTML = '<span class="status-pill st-paid" id="detailStatus">Đã thanh toán</span><span class="ops-pill op-normal" id="detailOps">Bình thường</span><span class="ops-pill st-paid">Khóa đã giải phóng</span>';

    var requestOverview = document.getElementById('dp-overview');
    if (requestOverview) requestOverview.innerHTML = `<div class="grid-2"><div class="detail-card"><div class="detail-card-head">Thông tin yêu cầu</div><div class="detail-card-body"><dl class="dl-grid"><dt>Mã yêu cầu thanh toán</dt><dd>PR-260825-0041</dd><dt>Mã hóa đơn BIDV</dt><dd>BILL-26V001-000041</dd><dt>Sinh viên tại thời điểm tạo</dt><dd>23040218 · Nguyễn Minh Anh</dd><dt>Khoản phải thu</dt><dd><span class="code-link" onclick="openReceivable('RCV-2026-00124')">RCV-2026-00124</span></dd><dt>Khoản mục / nội dung</dt><dd>Học phí chính quy · Học phí HK1/2026–2027</dd><dt>Số tiền còn phải thu lúc tạo</dt><dd>48.000.000 ₫</dd><dt>Tổng tiền yêu cầu</dt><dd>48.000.000 ₫ · VND</dd></dl></div></div><div class="detail-card"><div class="detail-card-head">Mốc thời gian và trạng thái</div><div class="detail-card-body"><dl class="dl-grid"><dt>Thời gian tạo</dt><dd>25/08/2026 09:02</dd><dt>Thời gian công bố</dt><dd>25/08/2026 09:03</dd><dt>Hết hạn</dt><dd>25/08/2026 10:02</dd><dt>Thanh toán</dt><dd>25/08/2026 09:07</dd><dt>Trạng thái hiệu lực</dt><dd><span class="status-pill st-paid">Đã thanh toán</span></dd><dt>Tình trạng vận hành</dt><dd><span class="ops-pill op-normal">Bình thường</span></dd></dl></div></div></div><div class="info-note"><strong>Yêu cầu đã hoàn tất.</strong> Giao dịch đã được ghi nhận vào khoản phải thu và khóa thanh toán đã được giải phóng.</div>`;

    var requestQr = document.getElementById('dp-qr');
    if (requestQr) requestQr.innerHTML = `<div class="grid-2"><div class="detail-card"><div class="detail-card-head">QR và định danh</div><div class="detail-card-body"><div class="qr-preview">Mã QR thanh toán BIDV<br><span style="font-size:10.5px">hiển thị theo quyền người dùng</span></div><dl class="dl-grid"><dt>Mã hóa đơn BIDV</dt><dd>BILL-26V001-000041</dd><dt>Mã khách hàng BIDV</dt><dd class="masked">2304••••18</dd><dt>Số tài khoản định danh</dt><dd class="masked">26V0•••••••41</dd><dt>Mã VietQR</dt><dd>VQR-260825-0041</dd><dt>Nhà cung cấp</dt><dd>BIDV</dd></dl></div></div><div class="detail-card"><div class="detail-card-head">Tình trạng thanh toán tại BIDV</div><div class="detail-card-body"><dl class="dl-grid"><dt>Thời gian sinh QR</dt><dd>25/08/2026 09:03</dd><dt>Hiệu lực đến</dt><dd>25/08/2026 10:02</dd><dt>Thanh toán lúc</dt><dd>25/08/2026 09:07</dd><dt>Tình trạng</dt><dd><span class="ops-pill st-paid">Đã hoàn tất</span></dd><dt>Định danh</dt><dd><span class="ops-pill st-paid">Đã đóng sau thanh toán</span></dd></dl></div></div></div>`;

    var requestTransaction = document.getElementById('dp-tx');
    if (requestTransaction) requestTransaction.innerHTML = `<div class="detail-card"><div class="detail-card-head">Giao dịch và kết quả ghi nhận</div><div class="detail-card-body"><div class="scroll-x"><table class="mini-table"><thead><tr><th>Mã giao dịch</th><th>Mã BIDV</th><th>Thời điểm</th><th>Số tiền</th><th>Kết quả ghi nhận khoản phải thu</th><th>Giải phóng khóa</th></tr></thead><tbody><tr><td>TXN-260825-0016</td><td>FT26082500116</td><td>25/08/2026 09:07</td><td>48.000.000 ₫</td><td><span class="ops-pill st-paid">Đã ghi nhận</span></td><td><span class="ops-pill st-paid">Đã giải phóng</span></td></tr></tbody></table></div></div></div>`;
  }

  if (page === 'transactions') {
    hideExcept('.kpi-grid > *', [0, 1, 4]);
    hideExcept('.filter-grid > *', [0, 1, 4, 6]);
    hideAll('.advanced-toggle,.advanced-grid,.filter-chips,.scope-card,.pipeline-card,.queue-card');
    hideExcept('.tx-header .tx-actions > *', [0]);
    hideTabByText('.tab-btn', ['cần can thiệp', 'tiếp nhận', 'hồ sơ xử lý']);
    hideAll('#tab-ledger .pagination');
    hideTabByText('.detail-tab', ['xác thực', 'khớp', 'tiến trình', 'xác nhận ngân hàng']);

    var txAsOf = document.querySelector('.tx-asof');
    if (txAsOf) txAsOf.textContent = 'Số liệu tính đến 25/08/2026 10:30 · Theo thời gian giao dịch';
    all('.scope-card input[type="date"]').forEach(function (input) { input.value = '2026-08-25'; });

    var txMetrics = [
      ['18', 'Tổng giá trị 89.400.000 ₫'],
      ['16', '81.900.000 ₫ · đã cập nhật công nợ'],
      ['1', 'Đang xử lý trong thời gian cho phép'],
      ['1', '7.500.000 ₫ cần kiểm tra'],
      ['15', '78.400.000 ₫ · đã có xác nhận'],
      ['1', 'Đang chờ dữ liệu xác nhận cuối ngày']
    ];
    all('.tx-page .kpi-grid .kpi').forEach(function (card, index) {
      var value = card.querySelector('.kpi-value');
      var sub = card.querySelector('.kpi-sub');
      if (txMetrics[index] && value) value.textContent = txMetrics[index][0];
      if (txMetrics[index] && sub) sub.textContent = txMetrics[index][1];
    });

    if (typeof ledgerRows !== 'undefined') {
      ledgerRows.splice(0, ledgerRows.length,
        {id:'TXN-260825-0016',provider:'FT26082500116',source:'BIDV Paybill',student:'23040218',name:'Nguyễn Minh Anh',pr:'PR-260825-0041',bill:'BILL-26V001-000041',rcv:'RCV-2026-00124',item:'Học phí HK1/2026–2027',amount:48000000,time:'25/08/2026 09:07',received:'09:07:02',process:'Đã ghi sổ',match:'Khớp đúng một yêu cầu',cls:'Khớp chính xác',posting:'Hoàn tất 09:07:05',bank:'Ngân hàng đã xác nhận',case:'—'},
        {id:'TXN-260825-0015',provider:'FT26082500115',source:'BIDV Paybill',student:'22041542',name:'Nguyễn Thị Ánh Tuyết',pr:'PR-260825-0040',bill:'BILL-26V001-000040',rcv:'RCV-2026-00125',item:'Học phí HK1/2026–2027',amount:7500000,time:'25/08/2026 08:51',received:'08:51:04',process:'Ngoại lệ',match:'Khớp đúng một yêu cầu',cls:'Thiếu tiền',posting:'Chưa ghi sổ',bank:'Chưa được ngân hàng xác nhận',case:'EX-2026-0041'},
        {id:'TXN-260825-0014',provider:'FT26082500114',source:'Thông báo TKĐD',student:'23011208',name:'Phạm Gia Bảo',pr:'PR-260825-0039',bill:'BILL-26V001-000039',rcv:'RCV-2026-00126',item:'Học phí chính quy',amount:6400000,time:'25/08/2026 08:42',received:'08:42:02',process:'Đã ghi sổ',match:'Khớp đúng một yêu cầu',cls:'Khớp chính xác',posting:'Hoàn tất 08:42:05',bank:'Ngân hàng đã xác nhận',case:'—'},
        {id:'TXN-260825-0013',provider:'FT26082500113',source:'BIDV Paybill',student:'25010782',name:'Đỗ Khánh Linh',pr:'PR-260825-0038',bill:'BILL-26V001-000038',rcv:'RCV-2026-00127',item:'Học phí chương trình BRT',amount:5500000,time:'25/08/2026 08:30',received:'08:30:03',process:'Đã ghi sổ',match:'Khớp đúng một yêu cầu',cls:'Khớp chính xác',posting:'Hoàn tất 08:30:06',bank:'Ngân hàng đã xác nhận',case:'—'},
        {id:'TXN-260825-0012',provider:'FT26082500112',source:'BIDV Paybill',student:'24031876',name:'Lê Đức Huy',pr:'PR-260825-0037',bill:'BILL-26V001-000037',rcv:'RCV-2026-00128',item:'Học phí chính quy',amount:4800000,time:'25/08/2026 08:18',received:'08:18:02',process:'Đã ghi sổ',match:'Khớp đúng một yêu cầu',cls:'Khớp chính xác',posting:'Hoàn tất 08:18:05',bank:'Ngân hàng đã xác nhận',case:'—'},
        {id:'TXN-260825-0011',provider:'FT26082500111',source:'Thông báo TKĐD',student:'24040961',name:'Hoàng Minh Tuấn',pr:'PR-260825-0036',bill:'BILL-26V001-000036',rcv:'RCV-2026-00129',item:'Học phí chính quy',amount:4600000,time:'25/08/2026 08:05',received:'08:05:01',process:'Đã ghi sổ',match:'Khớp đúng một yêu cầu',cls:'Khớp chính xác',posting:'Hoàn tất 08:05:04',bank:'Ngân hàng đã xác nhận',case:'—'},
        {id:'TXN-260825-0010',provider:'FT26082500110',source:'BIDV Paybill',student:'23070261',name:'Phạm Ngọc Mai',pr:'PR-260825-0035',bill:'BILL-26V001-000035',rcv:'RCV-2026-00130',item:'Học lại / cải thiện',amount:4200000,time:'25/08/2026 07:54',received:'07:54:03',process:'Đã ghi sổ',match:'Khớp đúng một yêu cầu',cls:'Khớp chính xác',posting:'Hoàn tất 07:54:06',bank:'Ngân hàng đã xác nhận',case:'—'},
        {id:'TXN-260825-0009',provider:'FT26082500109',source:'BIDV Paybill',student:'22060318',name:'Vũ Hoàng Nam',pr:'PR-260825-0034',bill:'BILL-26V001-000034',rcv:'RCV-2026-00131',item:'Học phí chính quy',amount:3900000,time:'25/08/2026 07:41',received:'07:41:02',process:'Đã ghi sổ',match:'Khớp đúng một yêu cầu',cls:'Khớp chính xác',posting:'Hoàn tất 07:41:05',bank:'Ngân hàng đã xác nhận',case:'—'}
      );
      if (typeof renderLedger === 'function') renderLedger();
    }

    var txDetailMeta = document.querySelector('#txDetail .detail-meta');
    var txDetailBadges = document.querySelector('#txDetail .detail-badges');
    var txOverview = document.getElementById('detail-overview');
    if (txDetailMeta) txDetailMeta.textContent = 'BIDV: FT26082500116 · 48.000.000 ₫ · 25/08/2026 09:07';
    if (txDetailBadges) txDetailBadges.innerHTML = '<span class="badge b-green">Đã ghi sổ</span><span class="badge b-green">Bình thường</span><span class="badge b-blue">Ngân hàng đã xác nhận</span>';
    if (txOverview) txOverview.innerHTML = `<div class="detail-grid"><div class="detail-card"><h3>Định danh giao dịch</h3><dl class="dl"><dt>Mã giao dịch</dt><dd class="code">TXN-260825-0016</dd><dt>Mã giao dịch BIDV</dt><dd class="code">FT26082500116</dd><dt>Kênh tiếp nhận</dt><dd>BIDV Paybill</dd><dt>Thời gian giao dịch</dt><dd>25/08/2026 09:07</dd></dl></div><div class="detail-card"><h3>Sinh viên và yêu cầu</h3><dl class="dl"><dt>Sinh viên</dt><dd><span class="student-link">23040218 · Nguyễn Minh Anh</span></dd><dt>Yêu cầu thanh toán</dt><dd><span class="link">PR-260825-0041</span></dd><dt>Mã hóa đơn BIDV</dt><dd class="code">BILL-26V001-000041</dd><dt>Khoản phải thu</dt><dd><span class="link">RCV-2026-00124</span></dd></dl></div><div class="detail-card"><h3>Số tiền</h3><dl class="dl"><dt>Số tiền</dt><dd><strong>48.000.000 ₫</strong></dd><dt>Tiền tệ</dt><dd>VND</dd><dt>Khoản mục</dt><dd>Học phí chính quy</dd><dt>Nội dung thu</dt><dd>Học phí HK1/2026–2027</dd></dl></div></div>`;
  }

})();

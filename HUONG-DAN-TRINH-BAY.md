# Hướng dẫn trình bày Hệ thống quản lý thu học phí ULIS

## Phạm vi giao diện

Bản này tập trung vào sáu màn cốt lõi của quy trình:

1. Tổng quan
2. Cấu hình học phí
3. Dữ liệu học phí
4. Khoản phải thu
5. Yêu cầu thanh toán
6. Giao dịch

Các màn Đối soát BIDV, Ngoại lệ, Báo cáo, Nhắc hạn và Cấu hình hệ thống vẫn có trong mã nguồn nhưng được ẩn khỏi điều hướng chính. Cách tổ chức này giúp người xem bám theo một luồng nghiệp vụ liền mạch và tập trung vào sáu màn cốt lõi.

## Luồng trình bày đề xuất (12–15 phút)

### 1. Tổng quan — 2 phút

- Chọn Năm học, Học kỳ và Đợt thu.
- Giải thích bốn chỉ số: Tổng phải thu, Đã ghi nhận vào nghĩa vụ, Quá hạn và Ngoại lệ cần xử lý.
- Dùng hai biểu đồ để trả lời: cơ cấu trạng thái thu và tuổi nợ.
- Chốt phần Tổng quan bằng bảng 5 khoản cần theo dõi; mở một khoản để chuyển sang luồng xử lý chi tiết.

### 2. Cấu hình học phí — 3 phút

- Mở một khung học phí.
- Chỉ ra năm học, học kỳ, thời gian hiệu lực, số quy tắc và trạng thái.
- Mở lần lượt ba lớp: Khung học phí, Quy tắc tính và Thử tính nhanh.
- Các thông tin quản trị sâu như văn bản căn cứ và nhật ký thay đổi chỉ mở khi cần trao đổi thêm.

### 3. Dữ liệu học phí — 3 phút

- Chọn năm học, đợt thu và học kỳ. Nguồn dữ liệu, chế độ nhập và chính sách xử lý được hệ thống áp dụng theo cấu hình của nghiệp vụ.
- Có thể tạo nhanh đợt thu với tên, năm học, học kỳ, ngày mở và hạn nộp mặc định; mã đợt thu được sinh tự động.
- Tải tệp mẫu hoặc chọn tệp `.xlsx`; hệ thống tự chuyển sang bước kiểm tra.
- Trình bày bốn bước nghiệp vụ: thông tin lô, tải và kiểm tra, xem trước kết quả, xác nhận nhập.
- Kết quả kiểm tra vẫn phân loại đủ Hợp lệ, Cảnh báo, Lỗi, Trùng và Xung đột. Chỉ dòng hợp lệ được đưa vào bước xác nhận; dữ liệu không được ghi khi người dùng chưa xác nhận.

### 4. Khoản phải thu — 3 phút

- Tìm một sinh viên và lọc theo đợt thu/trạng thái.
- Đọc số tiền cuối cùng, đã thu, còn phải thu, hạn nộp và trạng thái thanh toán.
- Mở chi tiết để xem căn cứ tính và lịch sử thanh toán.
- Minh họa thao tác Trình duyệt, Phê duyệt hoặc Phát hành sau khi chọn khoản phù hợp.

### 5. Yêu cầu thanh toán — 2 phút

- Lọc theo sinh viên và trạng thái.
- Mở một yêu cầu để xem số tiền, thời hạn, QR và tình trạng thanh toán.
- Truy vết sang giao dịch liên quan.

### 6. Giao dịch — 2 phút

- Lọc theo sinh viên, trạng thái xử lý hoặc xác nhận ngân hàng.
- Đọc số tiền, thời gian, kết quả xử lý và trạng thái xác nhận.
- Mở chi tiết và truy ngược về yêu cầu thanh toán/khoản phải thu.

## Bộ dữ liệu sử dụng trong luồng chính

- Sinh viên: 23040218 · Nguyễn Minh Anh.
- Khoản phải thu: RCV-2026-00124 · 48.000.000 đồng · đã thu đủ.
- Yêu cầu thanh toán: PR-260825-0041 · đã thanh toán lúc 09:07 ngày 25/08/2026.
- Giao dịch: TXN-260825-0016 · BIDV Paybill · đã ghi sổ và đã được ngân hàng xác nhận.
- Các mã sinh viên và số định danh khác được thể hiện ở dạng dữ liệu minh họa, không dùng thông tin cá nhân thật.

## Nguyên tắc trình bày

- Đi theo một hồ sơ xuyên suốt từ khoản phải thu đến yêu cầu thanh toán và giao dịch.
- Khi giải thích số liệu tổng hợp, nêu rõ phạm vi năm học 2026–2027, học kỳ 1 và thời điểm cập nhật 25/08/2026 10:30.
- Các màn ngoài sáu màn cốt lõi chỉ mở khi có yêu cầu trao đổi riêng.

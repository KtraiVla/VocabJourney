# VocabJourney
# 📚 XÂY DỰNG WEBSITE HỌC TỪ VỰNG TIẾNG ANH TRỰC TUYẾN

## 1. Giới thiệu

Đề tài **Xây dựng Website học từ vựng tiếng Anh trực tuyến** nhằm xây dựng một hệ thống hỗ trợ người học cải thiện vốn từ vựng tiếng Anh thông qua các bài học, bài kiểm tra và cơ chế trò chơi hóa (Gamification).

Hệ thống giúp người học:

- Học từ vựng theo chủ đề và bài học
- Làm bài kiểm tra (quiz) để đánh giá kiến thức
- Theo dõi tiến độ học tập
- Nhận điểm thưởng, level, huy hiệu
- Duy trì chuỗi ngày học (streak)
- Ôn tập từ vựng thông minh bằng thuật toán **Spaced Repetition**

Việc kết hợp giữa học tập và gamification giúp tăng **động lực học tập**, giúp người học duy trì việc học lâu dài và hiệu quả hơn.


# 2. Mục tiêu của hệ thống

Hệ thống được xây dựng với các mục tiêu sau:

- Cung cấp nền tảng học từ vựng tiếng Anh trực tuyến
- Tổ chức từ vựng theo chủ đề và bài học
- Hỗ trợ người dùng kiểm tra kiến thức bằng quiz
- Theo dõi tiến độ học tập của người dùng
- Tăng động lực học tập thông qua Gamification
- Áp dụng phương pháp **Spaced Repetition** để ghi nhớ từ vựng hiệu quả hơn


# 3. Đối tượng sử dụng hệ thống

## 3.1 Người học (User)

Người học sử dụng hệ thống để:

- Đăng ký tài khoản
- Đăng nhập hệ thống
- Học từ vựng theo chủ đề
- Làm bài quiz
- Theo dõi tiến độ học tập
- Nhận điểm thưởng và tăng level
- Nhận huy hiệu và thành tích
- Duy trì chuỗi ngày học (streak)
- Xem thống kê học tập
- Ôn tập từ vựng theo Spaced Repetition



## 3.2 Quản trị viên (Admin)

Quản trị viên có nhiệm vụ:

- Quản lý người dùng
- Thêm / sửa / xóa từ vựng
- Quản lý chủ đề từ vựng
- Quản lý bài học
- Tạo và quản lý bài quiz
- Quản lý badge, level và challenge
- Quản lý hệ thống gamification



# 4. Chức năng của hệ thống

## 4.1 Quản lý người dùng

Hệ thống cần hỗ trợ các chức năng:

- Đăng ký tài khoản
- Đăng nhập
- Cập nhật thông tin cá nhân
- Theo dõi tiến độ học tập

Thông tin người dùng được lưu trữ để cá nhân hóa trải nghiệm học tập.


# 4.2 Quản lý từ vựng và bài học

Cơ sở dữ liệu từ vựng bao gồm:

- Từ vựng
- Nghĩa
- Phiên âm
- Ví dụ minh họa
- Hình ảnh (nếu có)
- Chủ đề từ vựng

Các từ vựng được tổ chức thành:

- Chủ đề (Topic)
- Bài học (Lesson)

Điều này giúp người học tiếp cận từ vựng theo từng bước và dễ dàng ghi nhớ hơn.


# 4.3 Hệ thống Quiz

Hệ thống cung cấp các bài kiểm tra để đánh giá kiến thức từ vựng của người học.

Các dạng câu hỏi gồm:

- Trắc nghiệm chọn đáp án đúng
- Chọn nghĩa đúng của từ
- Điền từ còn thiếu
- Chọn từ phù hợp với hình ảnh

Kết quả bài quiz sẽ được lưu để phân tích tiến độ học tập.


# 4.4 Theo dõi tiến độ học tập

Hệ thống ghi nhận các dữ liệu học tập của người dùng:

- Từ vựng đã học
- Bài học đã hoàn thành
- Điểm số đạt được
- Kết quả bài quiz

Điều này giúp người học theo dõi sự tiến bộ của mình và ôn tập lại các nội dung chưa nắm vững.


# 5. Hệ thống Gamification

Gamification giúp tăng động lực học tập thông qua các yếu tố trò chơi.

## 5.1 Hệ thống điểm (Points)

Người dùng nhận điểm khi:

- Học từ vựng
- Hoàn thành bài quiz
- Hoàn thành thử thách

Công thức tính điểm:

$$
Points = P_{lesson} + P_{quiz} + P_{challenge}
$$

Trong đó:

- $P_{lesson}$: điểm khi hoàn thành bài học
- $P_{quiz}$: điểm khi hoàn thành quiz
- $P_{challenge}$: điểm khi hoàn thành thử thách

# 5.2 Hệ thống Level

Người dùng sẽ tăng level khi đạt đủ số điểm kinh nghiệm.

Công thức tính level:

$$
Level = \left\lfloor \sqrt{\frac{XP}{100}} \right\rfloor
$$

Trong đó:

- $XP$ là tổng điểm kinh nghiệm của người dùng

Ví dụ:

| XP | Level |
|----|------|
| 100 | 1 |
| 400 | 2 |
| 900 | 3 |

Một số bài học hoặc chủ đề sẽ được **mở khóa khi đạt level yêu cầu**.

---

# 5.3 Hệ thống Badge (Huy hiệu)

Huy hiệu được trao khi người dùng đạt thành tích nhất định.

Ví dụ:

| Badge | Điều kiện |
|------|-----------|
| Beginner | Học 20 từ |
| Quiz Master | Hoàn thành 10 quiz |
| Dedicated Learner | Học liên tục 7 ngày |

# 5.4 Hệ thống Streak

Hệ thống theo dõi số ngày học liên tiếp của người dùng.

Nếu người dùng học mỗi ngày:

$$
Streak = Streak + 1
$$

Nếu bỏ lỡ một ngày:

$$
Streak = 0
$$

Ví dụ phần thưởng:

| Streak | Phần thưởng |
|------|-------------|
| 3 ngày | +50 XP |
| 7 ngày | Badge |
| 30 ngày | Achievement |

---

# 5.5 Hệ thống Challenge

Các thử thách giúp tăng động lực học tập.

Ví dụ thử thách:

- Học **10 từ vựng mới**
- Hoàn thành **3 bài quiz**
- Ôn tập **20 từ đã học**

Công thức phần thưởng:

$$
Reward = BaseXP \times Difficulty
$$


# 5.6 Hệ thống Achievement (Thành tích)

Achievement ghi nhận các cột mốc học tập quan trọng.

Ví dụ:

- Học 100 từ vựng
- Hoàn thành 50 bài quiz
- Duy trì streak 30 ngày

Các thành tích được lưu trong hồ sơ người dùng.


# 6. Hệ thống ôn tập từ vựng thông minh (Spaced Repetition)

Hệ thống áp dụng phương pháp **Spaced Repetition** để giúp người học ghi nhớ từ vựng lâu dài.

Khoảng thời gian ôn tập sẽ tăng dần theo số lần ôn.

Ví dụ:

| Lần ôn | Khoảng cách |
|------|-------------|
| 1 | 1 ngày |
| 2 | 3 ngày |
| 3 | 7 ngày |
| 4 | 14 ngày |
| 5 | 30 ngày |

Công thức tính thời gian ôn tiếp theo:

$$
NextReview = LastReview + Interval
$$

Phương pháp này giúp người học ôn tập từ vựng **trước khi quên hoàn toàn**.


# 7. Kiến trúc hệ thống

Hệ thống bao gồm các thành phần:

- Frontend (Giao diện người dùng)
- Backend (API xử lý logic)
- Database (Cơ sở dữ liệu)
- Authentication System
- Gamification Engine

Công nghệ có thể sử dụng:

- Frontend: HTML, CSS, JavaScript
- Backend: NodeJS / PHP / ASP.net
- Database: MySQL / PostgreSQL


# 8. Thiết kế cơ sở dữ liệu (Concept)

Các bảng chính trong hệ thống:

- NguoiDung
- ThongKeNguoiDung
- HuyHieuNguoiDung
- ChuDe
- BaiHoc
- TuVung
- TienDoBaiHoc
- TienDoTuVung
- BaiKiemTra
- CauHoi
- DapAn
- KetQuaKiemTra

Các bảng này giúp quản lý:

- Nội dung học tập
- Tiến độ học tập
- Hệ thống gamification


# 9. Yêu cầu chức năng

Hệ thống cần hỗ trợ các chức năng chính:

- Quản lý người dùng
- Quản lý từ vựng
- Quản lý bài học
- Làm bài quiz
- Theo dõi tiến độ học tập
- Tích hợp gamification


# 10. Yêu cầu phi chức năng

Hệ thống cần đảm bảo:

- Giao diện thân thiện với người dùng
- Tốc độ truy cập nhanh
- Dữ liệu được lưu trữ an toàn
- Có khả năng mở rộng khi số lượng người dùng tăng


# 11. Thống kê học tập

Hệ thống cung cấp thống kê học tập cho người dùng.

Ví dụ: tỉ lệ trả lời đúng.

Công thức:

$$
Accuracy = \frac{CorrectAnswers}{TotalAnswers} \times 100\%
$$

# 12. Hướng phát triển trong tương lai

Một số hướng phát triển có thể mở rộng:

- Tích hợp AI gợi ý từ vựng
- Luyện phát âm
- Bảng xếp hạng người học
- Hệ thống bạn bè
- Ứng dụng di động

# 13. Kết luận

Website học từ vựng tiếng Anh trực tuyến kết hợp gamification giúp tạo ra môi trường học tập hiệu quả và thú vị.

Việc kết hợp:

- bài học từ vựng
- quiz
- theo dõi tiến độ
- gamification
- spaced repetition

giúp người học **ghi nhớ từ vựng tốt hơn và duy trì động lực học tập lâu dài**.



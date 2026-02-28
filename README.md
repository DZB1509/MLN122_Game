# MLN122_Game - Game Giải Mã Cụm Từ

Đây là dự án game web đơn giản được phát triển cho môn học **MLN122** (có thể là Môn học Nhập môn Lập trình hoặc tương tự).  
Game tập trung vào việc **giải mã (Hangman)** các cụm từ liên quan đến chủ đề yêu nước, kinh tế và bản sắc dân tộc.

## Mô tả game

- **Tên game**: Giải Mã Cụm Từ  
- **Cách chơi**:  
  - Chọn một trong 10 cụm từ từ danh sách.  
  - Đoán từng chữ cái (không phân biệt dấu) để hoàn thành cụm từ.  
  - Có hỗ trợ giải mã đặc biệt cho cụm từ "Đồng tiền liền khúc ruột".  
  - Khi hoàn thành 10 cụm từ thường → bắn pháo hoa.  
  - Có nút "Nổ hũ" để xem thông điệp ý nghĩa.  

- **Công nghệ sử dụng**:  
  - HTML5, CSS3, JavaScript (Vanilla JS)  
  - Canvas cho hiệu ứng pháo hoa  
  - Audio/Video HTML5 cho âm thanh và intro  

## Cấu trúc thư mục
MLN122_Game/
├── index.html          # Trang chính của game
├── script.js           # Logic game (Hangman, pháo hoa, modal,...)
├── style.css           # Giao diện và responsive
├── background.jpg      # Hình nền trang
├── intro.mp4           # Video intro
├── fail.mp3
├── nohu.mp3
├── correct.mp3
└── fireworks.mp3
## Tính năng chính

- Intro video chào mừng  
- Hangman với hỗ trợ tiếng Việt (bỏ dấu khi đoán)  
- Tự động reveal khoảng trắng trong cụm từ  
- Pháo hoa + âm thanh khi hoàn thành 10 cụm  
- Modal giải thích ý nghĩa từng cụm từ  
- Nút "Giải mã đặc biệt" cho cụm từ kinh tế  
- Responsive cơ bản (chơi được trên mobile)

## Tác giả

- **Tên**: DntZB  
## License

MIT License – Tự do sử dụng, chỉnh sửa cho mục đích học tập.

Cảm ơn bạn đã ghé thăm! 🎉  
Nếu có góp ý hoặc bug, hãy mở Issue nhé!

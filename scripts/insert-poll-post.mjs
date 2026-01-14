import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sscbcvcmqubmxjqpodlt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzY2JjdmNtcXVibXhqcXBvZGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNzYxMDcsImV4cCI6MjA4Mjc1MjEwN30.A9207QFdEtGgzjKnGVmiPpcgwXgYCwhYCyCcsk4eE4o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertPollPost() {
  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        title: 'Khảo Sát: Quan Điểm Của Bạn Về Tình Yêu Tuổi Học Trò?',
        excerpt: 'Cùng bình chọn và xem những quan điểm thú vị về tình yêu tuổi học trò từ các bạn học sinh 11A7!',
        content: `<div style="text-align: center; margin-bottom: 24px;">
  <p style="font-size: 18px; color: #cbd5e1; line-height: 1.8; margin-bottom: 20px;">
    <strong style="color: #a855f7;">Tình yêu tuổi học trò</strong> - đề tài không bao giờ cũ và luôn là một phần đẹp đẽ trong kỷ niệm thanh xuân. 
    Mỗi người có một quan điểm riêng, một trải nghiệm khác nhau. 
    Còn bạn, bạn nghĩ sao về chủ đề này?
  </p>
  <p style="font-size: 16px; color: #9ca3af; line-height: 1.8; margin-bottom: 24px;">
    Hãy chia sẻ quan điểm của bạn qua khảo sát dưới đây. Kết quả sẽ được cập nhật theo thời gian thực!
  </p>
</div>

<div data-poll-id="poll-teen-romance-2026" data-poll-question="Quan điểm của bạn về tình yêu tuổi học trò?" data-poll-options='["Rồi, thích rất lâu","Có thích, nhưng nhanh quên","Thích thầm thôi, không dám nói","Chưa từng"]'></div>

<div style="margin-top: 40px; padding: 24px; background: rgba(147, 51, 234, 0.05); border-radius: 16px; border: 1px solid rgba(147, 51, 234, 0.2);">
  <h3 style="color: #a855f7; font-size: 18px; margin-bottom: 12px;">💭 Tại sao chúng tôi làm khảo sát này?</h3>
  <p style="color: #cbd5e1; line-height: 1.7; font-size: 15px;">
    Chúng tôi muốn hiểu rõ hơn về suy nghĩ và cảm xúc của các bạn trẻ về tình yêu tuổi học trò. 
    Đây không chỉ là một cuộc khảo sát đơn thuần, mà còn là cách để chúng ta kết nối và chia sẻ với nhau 
    những trải nghiệm, cảm xúc mà ai cũng từng hoặc đang trải qua.
  </p>
  <p style="color: #9ca3af; font-size: 14px; margin-top: 16px; font-style: italic;">
    ✨ Mọi ý kiến đều được tôn trọng và giữ kín. Cảm ơn bạn đã tham gia!
  </p>
</div>

<div style="margin-top: 32px; padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; border-left: 4px solid #a855f7;">
  <p style="color: #e5e7eb; font-size: 14px; margin: 0;">
    <strong>📊 Tác giả:</strong> Eight Ducks Team<br>
    <strong>🎯 Chủ đề:</strong> Tình cảm tuổi học trò<br>
    <strong>💬 Loại nội dung:</strong> Khảo sát tương tác
  </p>
</div>`,
        category: 'Chia sẻ cảm hứng',
        image: 'https://i.ibb.co/YcS7yLJ/teen-romance-poll.jpg',
        author: 'Eight Ducks Team',
        views: 0
      }
    ])
    .select();

  if (error) {
    console.error('Error inserting poll post:', error);
  } else {
    console.log('✅ Poll post inserted successfully!', data);
  }
}

insertPollPost();

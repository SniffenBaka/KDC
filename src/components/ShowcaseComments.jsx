import React from 'react';
import { motion } from 'motion/react';

const ShowcaseComments = () => {
  const comments = [
    {
      id: 1,
      username: '@minhduc',
      avatar: '👨‍🎓',
      comment: 'Website này xịn quá! Nhìn vào là thấy tâm huyết của team luôn.',
      role: 'Học sinh 11A7'
    },
    {
      id: 2,
      username: '@thuytrang',
      avatar: '👩‍🎓',
      comment: 'Mỗi lần vào đọc lại những bài viết là lại nhớ đến những kỉ niệm đẹp.',
      role: 'Học sinh 11A7'
    },
    {
      id: 3,
      username: '@quanganh',
      avatar: '🎓',
      comment: 'Design đẹp mắt, nội dung chất lượng. Eight Ducks xứng đáng 10 điểm!',
      role: 'Học sinh 11A7'
    },
    {
      id: 4,
      username: '@phuonganh',
      avatar: '📚',
      comment: 'Cảm ơn team đã tạo ra một nơi lưu giữ những khoảnh khắc tuổi học trò.',
      role: 'Học sinh 11A7'
    },
    {
      id: 5,
      username: '@hoanglong',
      avatar: '✨',
      comment: 'Chưa thấy web nào của học sinh mà chất lượng như thế này.',
      role: 'Học sinh khối 11'
    },
    {
      id: 6,
      username: '@kimchi',
      avatar: '🌟',
      comment: 'Animations mượt mà, UI/UX đỉnh cao. Impressed!',
      role: 'Học sinh khối 11'
    }
  ];

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Grid of comment cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        margin: '0 auto',
        maxWidth: '100%'
      }}>
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.2 }
            }}
            style={{
              background: 'rgba(10, 10, 10, 0.6)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
              e.currentTarget.style.background = 'rgba(15, 15, 15, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';
              e.currentTarget.style.background = 'rgba(10, 10, 10, 0.6)';
            }}
          >
            {/* Subtle gradient backdrop */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08), transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0
            }} />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Header: Avatar + Username */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  border: '1px solid rgba(139, 92, 246, 0.3)'
                }}>
                  {comment.avatar}
                </div>
                <div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#e5e7eb',
                    marginBottom: '2px'
                  }}>
                    {comment.username}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    fontWeight: '500'
                  }}>
                    {comment.role}
                  </div>
                </div>
              </div>

              {/* Comment text */}
              <p style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#cbd5e1',
                margin: 0,
                fontStyle: 'italic'
              }}>
                "{comment.comment}"
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .showcase-comments-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ShowcaseComments;

import React from 'react';
import { motion } from 'motion/react';
import { User, UserCircle, Smile, Star, Zap, Sparkles } from 'lucide-react';

const ShowcaseComments = () => {
  const comments = [
    {
      id: 1,
      username: '@minhduc',
      icon: User,
      gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', // Dark indigo
      comment: 'Website này xịn quá! Nhìn vào là thấy tâm huyết của team luôn.',
      role: 'Học sinh 11A7'
    },
    {
      id: 2,
      username: '@thuytrang',
      icon: Smile,
      gradient: 'linear-gradient(135deg, #831843 0%, #be185d 100%)', // Dark pink
      comment: 'Mỗi lần vào đọc lại những bài viết là lại nhớ đến những kỉ niệm đẹp.',
      role: 'Học sinh 11A7'
    },
    {
      id: 3,
      username: '@quanganh',
      icon: Star,
      gradient: 'linear-gradient(135deg, #164e63 0%, #0e7490 100%)', // Dark cyan
      comment: 'Design đẹp mắt, nội dung chất lượng. Eight Ducks xứng đáng 10 điểm!',
      role: 'Học sinh 11A7'
    },
    {
      id: 4,
      username: '@phuonganh',
      icon: Sparkles,
      gradient: 'linear-gradient(135deg, #065f46 0%, #059669 100%)', // Dark emerald
      comment: 'Cảm ơn team đã tạo ra một nơi lưu giữ những khoảnh khắc tuổi học trò.',
      role: 'Học sinh 11A7'
    },
    {
      id: 5,
      username: '@hoanglong',
      icon: Zap,
      gradient: 'linear-gradient(135deg, #92400e 0%, #b45309 100%)', // Dark amber
      comment: 'Chưa thấy web nào của học sinh mà chất lượng như thế này.',
      role: 'Học sinh khối 11'
    },
    {
      id: 6,
      username: '@kimchi',
      icon: UserCircle,
      gradient: 'linear-gradient(135deg, #4c1d95 0%, #6b21a8 100%)', // Dark purple
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
                  background: comment.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}>
                  <comment.icon size={24} color="#ffffff" strokeWidth={2.5} />
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

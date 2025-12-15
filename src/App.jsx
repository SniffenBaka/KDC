import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Bell, Menu, X, Plus, TrendingUp, Bookmark, Share2, 
  Upload, Calendar, Volume2, VolumeX, School, BookOpen, Film, 
  Lightbulb, ArrowLeft, Clock, User, Link as LinkIcon, Check, 
  MessageSquare, Image as ImageIcon, Send, MessageCircle, FileText, 
  ThumbsUp, ThumbsDown 
} from 'lucide-react';

// --- 1. GLOBAL CONSTANTS & STYLES ---
const GLOBAL_STYLES = `
  :root, body, #root {
    width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background-color: #050505;
    scroll-behavior: smooth;
  }
  * { box-sizing: border-box; }
  *:focus { outline: none !important; }
  
  /* Custom Scrollbar */
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #09090b; }
  ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
  
  /* Animations */
  @keyframes ambientCycle { 
    0% { transform: scale(1); opacity: 0.5; } 
    50% { transform: scale(1.2); opacity: 0.7; } 
    100% { transform: scale(1); opacity: 0.5; } 
  }
  @keyframes pulseGlow {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(1.1); opacity: 0.8; }
  }
  /* NEW: Micro-animation to prevent browser clipping optimization */
  @keyframes antiClip {
    0% { transform: scale(1.08) translate3d(0, 0, 0); }
    100% { transform: scale(1.08) translate3d(0.1px, 0.1px, 0); }
  }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  
  /* Fix Input Autofill Background */
  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active{
      -webkit-box-shadow: 0 0 0 30px #18181b inset !important;
      -webkit-text-fill-color: white !important;
  }

  /* Utility Classes */
  .reveal-section {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: opacity, transform;
  }
  .reveal-section.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
  .page-transition-enter {
    animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

// --- 2. INITIAL DATA ---
const INITIAL_ARTICLES = [
  { 
    id: 1, 
    title: 'Kỹ Thuật Pomodoro: Bí Quyết Học Tập Hiệu Quả', 
    category: 'Học Tập', 
    excerpt: 'Khám phá phương pháp quản lý thời gian được nhiều học sinh ưa chuộng.', 
    author: 'Minh Anh', 
    date: '13/12/2025', 
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop', 
    views: 1247, likes: 156, dislikes: 2, isNew: true,
    comments: [
        { id: 101, user: "Hoàng Nam", avatar: "H", text: "Phương pháp này cực kỳ hiệu quả luôn!", time: "10 phút trước" },
        { id: 102, user: "Linh Chi", avatar: "L", text: "Mình hay bị mất tập trung, sẽ thử ngay.", time: "1 giờ trước" }
    ],
    content: `<p>Phương pháp Pomodoro là một kỹ thuật quản lý thời gian...</p>`
  },
  { 
    id: 2, title: 'Hội Thi Văn Nghệ Chào Mừng 20/11', category: 'Tin Trường', excerpt: 'Chương trình văn nghệ đặc sắc với sự tham gia của các lớp 10, 11, 12.', author: 'Thu Hà', date: '12/12/2025', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', views: 2341, likes: 230, dislikes: 5, isNew: true, 
    comments: [{ id: 201, user: "Gia Bảo", avatar: "G", text: "Lớp 11A2 diễn đỉnh quá!", time: "30 phút trước" }]
  },
  { id: 3, title: '5 Bộ Phim Truyền Cảm Hứng Cho Học Sinh', category: 'Giải Trí', excerpt: 'Danh sách những bộ phim hay về tuổi trẻ, ước mơ và hành trình trưởng thành.', author: 'Đức Anh', date: '11/12/2025', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop', views: 3128, likes: 543, dislikes: 12, isNew: false, comments: [] },
  { id: 4, title: 'Làm Thế Nào Để Tự Tin Nói Trước Đám Đông', category: 'Kỹ Năng Sống', excerpt: 'Những mẹo nhỏ giúp bạn vượt qua nỗi sợ hãi và trở nên tự tin hơn.', author: 'Lan Phương', date: '10/12/2025', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop', views: 1856, likes: 120, dislikes: 1, isNew: false, comments: [] },
  { id: 5, title: 'Khám Phá Câu Lạc Bộ Robotics Của Trường', category: 'Tin Trường', excerpt: 'Tìm hiểu về hoạt động của CLB Robotics và những thành tích đáng tự hào.', author: 'Quang Huy', date: '09/12/2025', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop', views: 1542, likes: 98, dislikes: 0, isNew: false, comments: [] },
  { id: 6, title: 'Ôn Thi Đại Học: Lập Kế Hoạch Thông Minh', category: 'Học Tập', excerpt: 'Hướng dẫn chi tiết cách lập kế hoạch ôn thi hiệu quả cho học sinh lớp 12.', author: 'Mai Linh', date: '08/12/2025', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop', views: 2764, likes: 342, dislikes: 8, isNew: false, comments: [] },
  { id: 7, title: 'Top 10 Cuốn Sách Hay Nên Đọc Tuổi 17', category: 'Giải Trí', excerpt: 'Những cuốn sách thay đổi tư duy và giúp bạn trưởng thành hơn trong suy nghĩ.', author: 'Hải Đăng', date: '07/12/2025', image: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=800&h=600&fit=crop', views: 1890, likes: 167, dislikes: 3, isNew: true, comments: [] },
  { 
    id: 8, 
    title: 'Bí Quyết Cân Bằng Giữa Học Tập & Hoạt Động Ngoại Khóa', 
    category: 'Kỹ Năng Sống', 
    excerpt: 'Làm sao để vừa đạt điểm cao trên lớp, vừa năng nổ trong các CLB? Lời khuyên dành riêng cho các bạn học sinh cấp 3.', 
    author: 'Thanh Hương', 
    date: '05/12/2025', 
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop', 
    views: 1560, likes: 211, dislikes: 4, isNew: false,
    comments: [{ id: 801, user: "Minh Tuấn", avatar: "M", text: "Bài viết đúng tim đen luôn.", time: "2 giờ trước" }]
  }
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, text: "Minh Anh đã đăng một bài viết mới về Kỹ năng sống.", time: "2 phút trước", isRead: false },
  { id: 2, text: "CLB Robotics đang tuyển thành viên đợt 2!", time: "1 giờ trước", isRead: false },
  { id: 3, text: "Lịch thi học kỳ I đã được cập nhật.", time: "5 giờ trước", isRead: true },
];

// --- 3. ICONS ---
const FacebookIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.6c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>);
const TikTokIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>);
const XIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>);

// --- 4. HELPERS ---
const getCategoryIcon = (cat) => {
  switch (cat) {
    case 'Tin Trường': return <School size={14} />;
    case 'Học Tập': return <BookOpen size={14} />;
    case 'Giải Trí': return <Film size={14} />;
    case 'Kỹ Năng Sống': return <Lightbulb size={14} />;
    default: return null;
  }
};

// --- 5. SUB-COMPONENTS ---

const FadeInSection = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setIsVisible(true); });
    }, { threshold: 0.1 }); 
    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);
  return (
    <div ref={domRef} className={`reveal-section ${isVisible ? 'is-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const NotificationDropdown = ({ notifications, onClose, onMarkAllRead }) => {
  return (
    <div style={{ position: 'absolute', top: 'calc(100% + 15px)', right: '0', width: '340px', background: 'rgba(15, 15, 20, 0.98)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', zIndex: 9999, padding: '8px', animation: 'fadeIn 0.2s ease-out', transformOrigin: 'top right' }}>
       <div style={{ position: 'absolute', top: '-6px', right: '20px', width: '12px', height: '12px', background: 'rgba(15, 15, 20, 0.98)', borderLeft: '1px solid rgba(255, 255, 255, 0.1)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', transform: 'rotate(45deg)', zIndex: 1 }} />
      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#f9fafb' }}>Thông báo</h3>
        <button onClick={onMarkAllRead} style={{ fontSize: '12px', color: '#a78bfa', cursor: 'pointer', background: 'transparent', border: 'none', padding: '4px 8px', borderRadius: '4px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(167, 139, 250, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>Đánh dấu đã đọc</button>
      </div>
      <div style={{ maxHeight: '350px', overflowY: 'auto', position: 'relative', zIndex: 2 }}>
        {notifications.length > 0 ? notifications.map(notif => (
          <div key={notif.id} style={{ padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.03)', background: notif.isRead ? 'transparent' : 'rgba(167, 139, 250, 0.05)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = notif.isRead ? 'transparent' : 'rgba(167, 139, 250, 0.05)'}>
            <p style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#e5e7eb', lineHeight: '1.5' }}>{notif.text}</p>
            <span style={{ fontSize: '12px', color: '#8b5cf6' }}>{notif.time}</span>
          </div>
        )) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>Không có thông báo mới</div>
        )}
      </div>
    </div>
  );
};

const ShareButton = ({ icon, color, onClick }) => (
  <button onClick={onClick} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.03)', color: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseEnter={(e) => { e.currentTarget.style.background = color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = color; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.color = '#e5e7eb'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}>{icon}</button>
);

const CommentSection = ({ comments = [], onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const handleSubmit = () => { if (newComment.trim()) { onAddComment(newComment); setNewComment(''); } };
  return (
    <div style={{ marginTop: '40px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#f9fafb', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><MessageSquare size={20} color="#a78bfa" /> Bình luận ({comments.length})</h3>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', padding: '20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '20px', border: `1px solid ${isFocused ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.05)'}`, transition: 'all 0.3s ease', boxShadow: isFocused ? '0 0 20px rgba(139, 92, 246, 0.1)' : 'none' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', flexShrink: 0 }}>B</div>
        <div style={{ flex: 1, position: 'relative' }}>
          <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder="Chia sẻ suy nghĩ của bạn..." rows={2} style={{ width: '100%', padding: '10px 0', background: 'transparent', border: 'none', color: '#e4e4e7', fontSize: '15px', resize: 'none', outline: 'none', minHeight: '24px' }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}><button onClick={handleSubmit} disabled={!newComment.trim()} style={{ background: newComment.trim() ? '#8b5cf6' : 'rgba(255,255,255,0.1)', color: newComment.trim() ? '#fff' : '#71717a', border: 'none', padding: '8px 20px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: newComment.trim() ? 'pointer' : 'default', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>Gửi <Send size={14} /></button></div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {comments.length > 0 ? comments.map(comment => (<div key={comment.id} style={{ display: 'flex', gap: '16px' }}><div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 'bold', flexShrink: 0 }}>{comment.avatar}</div><div><div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}><span style={{ fontSize: '15px', fontWeight: '600', color: '#f4f4f5' }}>{comment.user}</span><span style={{ fontSize: '12px', color: '#71717a' }}>{comment.time}</span></div><p style={{ fontSize: '15px', color: '#d4d4d8', lineHeight: '1.6', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '0 16px 16px 16px', display: 'inline-block', border: '1px solid rgba(255,255,255,0.05)' }}>{comment.text}</p></div></div>)) : (<p style={{ color: '#71717a', fontStyle: 'italic' }}>Chưa có bình luận nào. Hãy là người đầu tiên!</p>)}
      </div>
    </div>
  );
};

const SurveySection = () => {
    const handleClick = (type) => { alert(`Cảm ơn bạn đã quan tâm đến mục "${type}". Form khảo sát sẽ được mở trong tab mới!`); }
  return (
    <div style={{ marginTop: '60px', padding: '40px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(6, 182, 212, 0.05))', borderRadius: '24px', border: '1px solid rgba(139, 92, 246, 0.2)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#f9fafb', marginBottom: '12px' }}>Ý kiến của bạn rất quan trọng!</h3>
        <p style={{ color: '#a1a1aa', fontSize: '15px', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 32px', lineHeight: '1.6' }}>Hãy giúp KDC Education cải thiện chất lượng nội dung bằng cách dành 1 phút để làm khảo sát nhỏ này hoặc gửi góp ý trực tiếp cho chúng tôi.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button onClick={() => handleClick('Khảo sát')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: '#8b5cf6', borderRadius: '100px', border: 'none', color: '#fff', fontWeight: '600', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)' }}><FileText size={18} /> Làm khảo sát</button>
          <button onClick={() => handleClick('Góp ý')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '100px', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#e4e4e7', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}><MessageCircle size={18} /> Gửi góp ý</button>
        </div>
      </div>
      <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 70%)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '-50%', right: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1), transparent 70%)', filter: 'blur(60px)' }} />
    </div>
  );
};

// --- DEFINING NewsArticle BEFORE ArticleDetail ---
const NewsArticle = ({ title, category, excerpt, author, date, image, views, isNew, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [displayViews, setDisplayViews] = useState(views);

  useEffect(() => {
    if (isHovered) {
      let start = 0;
      const end = views;
      const duration = 800;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setDisplayViews(Math.floor(ease(progress) * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    } else {
        setDisplayViews(views);
    }
  }, [isHovered, views]);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered ? 'rgba(30, 41, 59, 0.6)' : 'rgba(17, 24, 39, 0.3)',
        backdropFilter: 'blur(12px)',
        border: isHovered 
          ? '1px solid rgba(168, 85, 247, 0.3)'
          : '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        padding: '24px',
        transition: 'all 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isHovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: isHovered
           ? '0 15px 30px -10px rgba(0, 0, 0, 0.4), 0 0 15px rgba(139, 92, 246, 0.1)'
           : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        zIndex: isHovered ? 10 : 1
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.03) 45%, rgba(255, 255, 255, 0.02) 50%, transparent 54%)', transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)', transition: 'transform 0.6s', pointerEvents: 'none', zIndex: 2 }} />

      {!image && isNew && (
        <span style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', border: '1px solid rgba(59, 130, 246, 0.2)', zIndex: 10 }}>Mới</span>
      )}

      {image && (
        <div style={{ width: '100%', height: '200px', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', background: 'rgba(255, 255, 255, 0.02)', flexShrink: 0, position: 'relative' }}>
          <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)', transform: isHovered ? 'scale(1.05)' : 'scale(1)' }} />
          {isNew && <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(17, 24, 39, 0.75)', backdropFilter: 'blur(4px)', color: '#60a5fa', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', border: '1px solid rgba(59, 130, 246, 0.3)', zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Mới</span>}
        </div>
      )}
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: isHovered ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.1)', color: '#c084fc', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', marginBottom: '12px', border: '1px solid rgba(168, 85, 247, 0.15)', transition: 'all 300ms' }}>
          {getCategoryIcon(category)} {category}
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: isHovered ? '#fff' : '#f9fafb', marginBottom: '12px', lineHeight: '1.4', transition: 'color 300ms' }}>{title}</h3>
        <p style={{ color: isHovered ? '#e2e8f0' : '#9ca3af', fontSize: '14px', lineHeight: '1.4', marginBottom: '16px', transition: 'color 300ms' }}>{excerpt}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: isHovered ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.05)', marginTop: 'auto', transition: 'border-color 300ms' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#fff', boxShadow: isHovered ? '0 0 10px rgba(118, 75, 162, 0.5)' : 'none', transition: 'box-shadow 300ms' }}>{author[0]}</div>
          <div><div style={{ fontSize: '13px', color: isHovered ? '#fff' : '#e5e7eb', fontWeight: '500', transition: 'color 300ms' }}>{author}</div><div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}><Calendar size={12} /><span>{date}</span></div></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isHovered ? '#a78bfa' : '#6b7280', fontSize: '13px', transition: 'color 300ms' }}><TrendingUp size={14} /><span>{displayViews.toLocaleString()}</span></div>
      </div>
    </div>
  );
};

// 7. Article Detail Component (DEPENDS ON NewsArticle)
const ArticleDetail = ({ article, onBack, allArticles, onArticleClick, onUpdateArticle }) => {
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(article.likes || 0);
  const [dislikes, setDislikes] = useState(article.dislikes || 0);
  const [userAction, setUserAction] = useState(null); 

  // Fix: Change dependency to article.id to prevent scroll on like/comment
  useEffect(() => { 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
    setLikes(article.likes || 0); 
    setDislikes(article.dislikes || 0); 
    setUserAction(null); 
  }, [article.id]);

  const handleCopyLink = () => {
    try {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) { setCopied(true); setTimeout(() => setCopied(false), 2000); return; }
    } catch (err) { console.error(err); }
    if (navigator.clipboard) { navigator.clipboard.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(err => { console.error(err); alert("Không thể sao chép liên kết."); }); }
  };

  const handleLike = () => {
    let newLikes = likes;
    let newDislikes = dislikes;
    let newAction = userAction;

    if (userAction === 'like') { 
        newLikes -= 1; 
        newAction = null; 
    } else { 
        newLikes += 1; 
        if (userAction === 'dislike') newDislikes -= 1; 
        newAction = 'like'; 
    }
    setLikes(newLikes);
    setDislikes(newDislikes);
    setUserAction(newAction);
    
    // Update parent state
    onUpdateArticle({ ...article, likes: newLikes, dislikes: newDislikes });
  };

  const handleDislike = () => {
    let newLikes = likes;
    let newDislikes = dislikes;
    let newAction = userAction;

      if (userAction === 'dislike') { 
          newDislikes -= 1; 
          newAction = null; 
      } else { 
          newDislikes += 1; 
          if (userAction === 'like') newLikes -= 1; 
          newAction = 'dislike'; 
      }
      setLikes(newLikes);
      setDislikes(newDislikes);
      setUserAction(newAction);

      // Update parent state
      onUpdateArticle({ ...article, likes: newLikes, dislikes: newDislikes });
  };

  const handleAddComment = (text) => {
      const newComment = { id: Date.now(), user: "Bạn", avatar: "B", text: text, time: "Vừa xong" };
      const updatedArticle = { ...article, comments: [newComment, ...(article.comments || [])] };
      onUpdateArticle(updatedArticle);
  };

  const relatedArticles = allArticles.filter(a => a.id !== article.id).slice(0, 2);

  return (
    <div className="page-transition-enter" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px', position: 'relative', zIndex: 10 }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px 20px', borderRadius: '30px', color: '#e5e7eb', cursor: 'pointer', marginBottom: '32px', transition: 'all 0.3s ease', fontSize: '14px', fontWeight: '500', backdropFilter: 'blur(10px)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.transform = 'translateX(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
        <ArrowLeft size={18} /> Quay lại trang chủ
      </button>

      <FadeInSection>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(168, 85, 247, 0.15)', color: '#d8b4fe', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', marginBottom: '16px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>{getCategoryIcon(article.category)} {article.category}</div>
          <h1 style={{ fontSize: '40px', fontWeight: '700', color: '#ffffff', lineHeight: '1.4', marginBottom: '24px' }}>{article.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: '#9ca3af', fontSize: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} color="#a78bfa" /><span style={{ color: '#e5e7eb', fontWeight: '500' }}>{article.author}</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} color="#a78bfa" /><span>{article.date}</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} color="#a78bfa" /><span>5 phút đọc</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={16} color="#a78bfa" /><span>{article.views.toLocaleString()} lượt xem</span></div>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          {article.image && (
            <div style={{ width: '100%', height: '500px', borderRadius: '24px', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#9ca3af', marginRight: '8px', fontWeight: '500' }}>Chia sẻ:</span>
              <ShareButton icon={<FacebookIcon />} color="#1877F2" onClick={() => {}} />
              <ShareButton icon={<TikTokIcon />} color="#000000" onClick={() => {}} />
              <ShareButton icon={<XIcon />} color="#1DA1F2" onClick={() => {}} />
              <button onClick={handleCopyLink} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', height: '40px', background: copied ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)', border: copied ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', color: copied ? '#4ade80' : '#e5e7eb', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                {copied ? <Check size={16} /> : <LinkIcon size={16} />} {copied ? 'Đã sao chép' : 'Sao chép link'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button onClick={handleLike} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: userAction === 'like' ? 'rgba(139, 92, 246, 0.2)' : 'transparent', border: `1px solid ${userAction === 'like' ? '#8b5cf6' : 'rgba(255,255,255,0.1)'}`, borderRadius: '20px', color: userAction === 'like' ? '#a78bfa' : '#9ca3af', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <ThumbsUp size={18} fill={userAction === 'like' ? "currentColor" : "none"} /> <span>{likes}</span>
                </button>
                <button onClick={handleDislike} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: userAction === 'dislike' ? 'rgba(239, 68, 68, 0.15)' : 'transparent', border: `1px solid ${userAction === 'dislike' ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, borderRadius: '20px', color: userAction === 'dislike' ? '#f87171' : '#9ca3af', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <ThumbsDown size={18} fill={userAction === 'dislike' ? "currentColor" : "none"} />
                </button>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '18px', lineHeight: '1.6', color: '#e2e8f0', background: 'rgba(17, 24, 39, 0.4)', backdropFilter: 'blur(12px)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', marginBottom: '60px' }}>
          <p style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '500', color: '#fff' }}>{article.excerpt}</p>
          {article.content ? (<div dangerouslySetInnerHTML={{ __html: article.content }} />) : (<><p style={{ marginBottom: '20px' }}>Nội dung chi tiết của bài viết...</p></>)}
          {article.sources && article.sources.length > 0 && (
            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
               <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#9ca3af', marginBottom: '12px' }}>Nguồn tham khảo:</h4>
               <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#6b7280', fontSize: '14px' }}>
                  {article.sources.map((src, i) => (<li key={i} style={{ marginBottom: '4px' }}>{src}</li>))}
               </ul>
            </div>
          )}
        </div>
      </FadeInSection>
      
      <FadeInSection delay={100}><SurveySection /></FadeInSection>
      <FadeInSection delay={200}><CommentSection comments={article.comments || []} onAddComment={handleAddComment} /></FadeInSection>

      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '40px', marginTop: '60px' }}>
        <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#f9fafb', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          Tin liên quan <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
          {relatedArticles.map((relArticle, idx) => (
             <FadeInSection key={relArticle.id} delay={idx * 100}>
                <NewsArticle {...relArticle} onClick={() => onArticleClick(relArticle)} />
             </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
};

// 5. Video Showcase - FIX GLOW WITH MICRO-ANIMATION TO PREVENT CLIPPING
const VideoShowcase = () => {
  const videoRef = useRef(null);
  const glowRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const videoUrl = "https://ia801704.us.archive.org/6/items/thpt-tam-phu-20-nam-mot-chang-duong/THPT%20Tam%20Ph%C3%BA%20-%2020%20n%C4%83m%20m%E1%BB%99t%20ch%E1%BA%B7ng%20%C4%91%C6%B0%E1%BB%9Dng.mp4";

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  // Safe Play Logic
  useEffect(() => {
    const mainVid = videoRef.current;
    const glowVid = glowRef.current;
    if (!mainVid || !glowVid) return;

    const safePlay = async (video) => {
        try { await video.play(); } 
        catch (err) { if (err.name !== 'AbortError') console.error("Playback failed", err); }
    };

    const syncPlay = () => safePlay(glowVid);
    const syncPause = () => glowVid.pause();

    mainVid.addEventListener('play', syncPlay);
    mainVid.addEventListener('pause', syncPause);
    mainVid.addEventListener('waiting', syncPause);
    mainVid.addEventListener('playing', syncPlay);

    if (!mainVid.paused) safePlay(glowVid);

    return () => {
        mainVid.removeEventListener('play', syncPlay);
        mainVid.removeEventListener('pause', syncPause);
        mainVid.removeEventListener('waiting', syncPause);
        mainVid.removeEventListener('playing', syncPlay);
    };
  }, []);

  useEffect(() => { if (videoRef.current) videoRef.current.muted = isMuted; }, [isMuted]);
  
  // Time Sync
  useEffect(() => {
      let rafId;
      const syncTime = () => {
          if (videoRef.current && glowRef.current && !videoRef.current.paused) {
              const diff = Math.abs(videoRef.current.currentTime - glowRef.current.currentTime);
              if (diff > 0.15) { 
                  glowRef.current.currentTime = videoRef.current.currentTime;
              }
          }
          rafId = requestAnimationFrame(syncTime);
      };
      syncTime();
      return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div 
      id="video-section" 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)} 
      style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '900px', 
        margin: '0 auto', 
        zIndex: 1 
      }}
    >
      {/* GLOW LAYER - FIX: Larger size, no overflow hidden, forced GPU, and micro-animation */}
      <div style={{
        position: 'absolute',
        top: '-3%', // Extended top
        left: '-2%', // Extended left
        width: '102%', // Larger than container
        height: '112%', // Larger than container
        zIndex: -1,
        opacity: 0.9,
        // The magic sauce: translate3d forces GPU, scale makes it big, blur makes it glow
        transform: 'translate3d(0,0,0) scale(1.08)', 
        filter: 'blur(40px) saturate(1.5)',
        transition: 'all 0.5s ease',
        // Anti-clipping animation to force continuous repaint
        animation: 'antiClip 0.1s infinite alternate',
        pointerEvents: 'none' // Click-through
      }}>
         <video 
            ref={glowRef} 
            src={videoUrl} 
            muted 
            loop 
            playsInline 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
         />
      </div>

      {/* MAIN VIDEO CONTAINER */}
      <div style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#000',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isHovered ? '0 10px 30px rgba(0,0,0,0.5)' : '0 5px 15px rgba(0,0,0,0.3)',
        transition: 'transform 0.5s ease',
        transform: isHovered ? 'scale(1.01)' : 'scale(1)',
        aspectRatio: '16/9'
      }}>
        <video ref={videoRef} src={videoUrl} onTimeUpdate={handleTimeUpdate} autoPlay loop muted={isMuted} playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 600'%3E%3Crect width='900' height='600' fill='%230e1116'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='48' fill='%239ca3af'%3EVideo Demo%3C/text%3E%3C/svg%3E" />
        <button onClick={toggleMute} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', backdropFilter: 'blur(4px)', transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)', padding: 0, opacity: isHovered ? 1 : 0, transform: isHovered ? 'scale(1)' : 'scale(0.8)', pointerEvents: isHovered ? 'auto' : 'none', zIndex: 10 }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)'}>
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)', width: `${progress}%`, transition: 'width 100ms linear' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// 8. Create Post Modal
const CreatePostModal = ({ isOpen, onClose, onPost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Tin Trường');
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null); // Reference for hidden file input

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
        setTitle('');
        setContent('');
        setCategory('Tin Trường');
        setFile(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) { setFile(e.dataTransfer.files[0]); } };
  
  // Handle file selection from explorer
  const handleFileSelect = (e) => {
      if (e.target.files && e.target.files[0]) {
          setFile(e.target.files[0]);
      }
  };

  // Handle Post Submission
  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
        alert("Vui lòng nhập tiêu đề và nội dung bài viết!");
        return;
    }

    const newPost = {
        id: Date.now(),
        title: title,
        category: category,
        excerpt: content.length > 100 ? content.substring(0, 100) + '...' : content,
        author: 'Bạn', // User is the author
        date: new Date().toLocaleDateString('vi-VN'),
        image: file ? URL.createObjectURL(file) : 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop', // Use selected image or default
        views: 0,
        likes: 0,
        dislikes: 0,
        isNew: true, // Mark as new
        comments: [],
        content: `<p>${content.replace(/\n/g, '<br/>')}</p>` // Simple HTML formatting
    };

    onPost(newPost); // Call parent handler
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px', animation: 'fadeIn 400ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
      <div style={{ background: '#09090b', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '16px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto', animation: 'slideUp 500ms cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#f9fafb', margin: 0 }}>Tạo bài viết mới</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '4px' }}><X size={20} /></button>
        </div>
        
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#e4e4e7', marginBottom: '8px' }}>Danh mục</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#f4f4f5', fontSize: '14px', outline: 'none', transition: 'border 0.2s' }}>
              <option value="Tin Trường">Tin Trường</option>
              <option value="Học Tập">Học Tập</option>
              <option value="Giải Trí">Giải Trí</option>
              <option value="Kỹ Năng Sống">Kỹ Năng Sống</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#e4e4e7', marginBottom: '8px' }}>Tiêu đề</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề bài viết..." style={{ width: '100%', padding: '10px 12px', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#f4f4f5', fontSize: '14px', outline: 'none', transition: 'border 0.2s' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#e4e4e7', marginBottom: '8px' }}>Nội dung</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Viết nội dung bài đăng..." rows={6} style={{ width: '100%', padding: '12px', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#f4f4f5', fontSize: '14px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', transition: 'border 0.2s' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            {/* Hidden Input for File Selection */}
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*,video/*" 
                onChange={handleFileSelect} 
            />
            {/* Clickable Div to trigger Input */}
            <div 
                onClick={() => fileInputRef.current.click()}
                onDragOver={handleDragOver} 
                onDragLeave={handleDragLeave} 
                onDrop={handleDrop} 
                style={{ width: '100%', padding: '24px', background: isDragging ? 'rgba(139, 92, 246, 0.1)' : 'rgba(24, 24, 27, 0.5)', border: isDragging ? '1px dashed #8b5cf6' : '1px dashed #3f3f46', borderRadius: '8px', color: isDragging ? '#d8b4fe' : '#a1a1aa', fontSize: '14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
              <ImageIcon size={24} style={{ opacity: 0.8 }} />
              <span>{file ? `Đã chọn: ${file.name}` : (isDragging ? "Thả file để tải lên" : "Thêm ảnh/video")}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', paddingTop: '12px' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '10px 20px', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#e4e4e7', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.2s' }}>Hủy</button>
            <button onClick={handleSubmit} style={{ flex: 1, padding: '10px 20px', background: 'linear-gradient(to right, #8b5cf6, #3b82f6)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)', transition: 'transform 0.1s' }}>Đăng bài</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 9. MAIN APP COMPONENT
const App = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeNav, setActiveNav] = useState('Trang chủ');
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  // Hover States
  const [hoveredNav, setHoveredNav] = useState(null);
  const [hoveredCat, setHoveredCat] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  // Articles State for updates
  const [articles, setArticles] = useState(INITIAL_ARTICLES); // Corrected variable name
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS); // Corrected variable name
  const searchInputRef = useRef(null);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  // Parallax Scroll Effect for Background
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const videoSection = document.getElementById('video-section');
      const articlesSection = document.getElementById('articles-section');
      
      const videoOffset = videoSection ? videoSection.offsetTop - 150 : 9999;
      const articlesOffset = articlesSection ? articlesSection.offsetTop - 150 : 9999;

      if (scrollPosition < 200) { setActiveNav('Trang chủ'); } 
      else if (scrollPosition >= videoOffset && scrollPosition < articlesOffset) { setActiveNav('Video'); } 
      else if (scrollPosition >= articlesOffset) { setActiveNav('Tin tức'); }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus(); }, [isSearchOpen]);

  const categories = ['Tất cả', 'Tin Trường', 'Học Tập', 'Giải Trí', 'Kỹ Năng Sống'];
  const navItems = ['Trang chủ', 'Tin tức', 'Video'];

  const handleNavClick = (item) => {
    setActiveNav(item);
    if (selectedArticle) setSelectedArticle(null);
    if (item === 'Trang chủ') window.scrollTo({ top: 0, behavior: 'smooth' });
    else if (item === 'Video') document.getElementById('video-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    else if (item === 'Tin tức') document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMarkAllRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updatedNotifications);
  };
  
  // Handle creating a new post
  const handleCreatePost = (newPost) => {
      setArticles([newPost, ...articles]); // Add to top of list
      setShowCreatePost(false); // Close modal
  };

  const handleUpdateArticle = (updatedArticle) => {
      const updatedArticles = articles.map(art => art.id === updatedArticle.id ? updatedArticle : art);
      setArticles(updatedArticles);
      setSelectedArticle(updatedArticle); // Keep current article updated
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredArticles = articles
  .filter(article => {
    const matchesCategory = selectedCategory === 'Tất cả' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  })
  .sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#f9fafb', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', position: 'relative', overflowX: 'hidden' }}>
      <style>{GLOBAL_STYLES}</style> {/* Corrected variable name */}
      
      {/* Background Effects - Parallax & Glow */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* Lớp nền noise nhẹ */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, background: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

        {/* Blob 1: Tím (Purple) */}
        <div style={{
          position: 'absolute', top: '-15%', right: '-10%', width: '80vw', height: '80vw',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent 60%)', 
          filter: 'blur(100px)',
          transform: `translateY(${scrollY * 0.1}px)`, // Parallax effect
          transition: 'transform 0.1s ease-out'
        }} />

        {/* Blob 2: Xanh (Cyan/Blue) */}
        <div style={{
          position: 'absolute', bottom: '-15%', left: '-10%', width: '80vw', height: '80vw',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3), transparent 60%)',
          filter: 'blur(100px)',
          transform: `translateY(-${scrollY * 0.1}px)`, // Reverse parallax
          transition: 'transform 0.1s ease-out'
        }} />
      </div>

      <nav style={{ position: 'sticky', top: 0, zIndex: 9999, background: 'rgba(10, 10, 10, 0.3)', backdropFilter: 'blur(40px)', borderBottom: '1px solid rgba(167, 139, 250, 0.1)', boxShadow: '0 0 30px rgba(167, 139, 250, 0.05)', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-4px)', transition: 'all 800ms cubic-bezier(0.4, 0, 0.2, 1)', overflow: 'visible' }}>
        <div style={{ width: '100%', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => { setSelectedArticle(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-ozqHx0k3ZKISo0aAuPiJJ3OH4V4IxZQX3g&s" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#f9fafb', letterSpacing: '-0.5px' }}>KDC</div>
          </div>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '32px' }} className="hidden md:flex">
              {navItems.map((item) => (
                <button 
                    key={item} 
                    onClick={() => handleNavClick(item)} 
                    onMouseEnter={() => setHoveredNav(item)}
                    onMouseLeave={() => setHoveredNav(null)}
                    style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        // Color Logic: Active -> Purple, Hover -> White, Normal -> Gray
                        color: activeNav === item ? '#a78bfa' : (hoveredNav === item ? '#ffffff' : '#9ca3af'), 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        cursor: 'pointer', 
                        transition: 'all 300ms', 
                        position: 'relative', 
                        padding: '0 0 4px 0', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        textShadow: activeNav === item ? '0 0 8px rgba(167, 139, 250, 0.5)' : 'none'
                    }}
                >
                  {item}
                  <div style={{ position: 'absolute', bottom: '-21px', left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)', opacity: activeNav === item ? 1 : 0, transform: activeNav === item ? 'scaleX(1)' : 'scaleX(0.5)', transition: 'all 300ms', boxShadow: '0 -4px 10px rgba(139, 92, 246, 0.5)' }} />
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', position: 'relative' }}>
              <button onClick={() => setShowCreatePost(true)} style={{ padding: '8px 16px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '8px', color: '#a78bfa', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 300ms', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> Đăng bài
              </button>
              
              {/* Search Bar */}
              <div 
                style={{ 
                    display: 'flex', alignItems: 'center', 
                    background: isSearchOpen ? 'rgba(255,255,255,0.05)' : 'transparent', 
                    borderRadius: '8px', padding: isSearchOpen ? '0 8px' : '0', 
                    transition: 'all 0.3s ease', 
                    border: isSearchOpen ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent' 
                }}>
                <input ref={searchInputRef} type="text" placeholder="Tìm kiếm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: isSearchOpen ? '150px' : '0px', opacity: isSearchOpen ? 1 : 0, padding: isSearchOpen ? '8px' : '0', background: 'transparent', border: 'none', color: '#f9fafb', fontSize: '14px', outline: 'none', transition: 'all 0.3s ease' }} />
                <button 
                    onClick={() => { setIsSearchOpen(!isSearchOpen); if (isSearchOpen) setSearchQuery(''); }} 
                    onMouseEnter={() => setHoveredIcon('search')}
                    onMouseLeave={() => setHoveredIcon(null)}
                    style={{ 
                        background: 'transparent', border: 'none', 
                        color: hoveredIcon === 'search' || isSearchOpen ? '#ffffff' : '#9ca3af', 
                        cursor: 'pointer', padding: '8px', transition: 'color 0.3s'
                    }}>
                  {isSearchOpen ? <X size={20} /> : <Search size={20} />}
                </button>
              </div>

              {/* Notifications */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)} 
                  onMouseEnter={() => setHoveredIcon('bell')}
                  onMouseLeave={() => setHoveredIcon(null)}
                  style={{ 
                      background: 'transparent', border: 'none', 
                      color: showNotifications ? '#a78bfa' : (hoveredIcon === 'bell' ? '#ffffff' : '#9ca3af'), 
                      cursor: 'pointer', padding: '8px', position: 'relative',
                      transition: 'color 0.3s',
                      textShadow: showNotifications ? '0 0 8px rgba(167, 139, 250, 0.5)' : 'none'
                  }}>
                  <Bell size={20} />
                  {/* Notification Dot */}
                  {unreadCount > 0 && <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid #050505' }} />}
                </button>
                {showNotifications && <NotificationDropdown notifications={notifications} onClose={() => setShowNotifications(false)} onMarkAllRead={handleMarkAllRead} />}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {selectedArticle ? (
        <ArticleDetail 
            article={selectedArticle} 
            onBack={() => setSelectedArticle(null)} 
            allArticles={articles} 
            onArticleClick={setSelectedArticle}
            onUpdateArticle={handleUpdateArticle}
        />
      ) : (
        <>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '100px 24px 60px', position: 'relative', zIndex: 1, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(8px)', transition: 'all 900ms 200ms' }}>
            {/* WRAP HERO CONTENT IN FADE-IN SECTION */}
            <FadeInSection>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '72px', fontWeight: '800', marginBottom: '24px', background: 'linear-gradient(135deg, #fff 0%, #e2e8f0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em', lineHeight: '1.4' }}> {/* Fix: lineHeight 1.4 for title */}
                    Nơi Chia Sẻ<br />Câu Chuyện Tuổi Trẻ
                </h1>
                <p style={{ fontSize: '20px', color: '#cbd5e1', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>Tin tức, kỹ năng, cảm hứng và những câu chuyện từ chính các bạn học sinh THPT</p>
                </div>
                <VideoShowcase />
            </FadeInSection>
          </div>

          <div id="articles-section" style={{ maxWidth: '1800px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1, marginBottom: '20px' }}>
             {/* WRAP FILTER IN FADE-IN SECTION */}
             <FadeInSection>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {categories.map((cat, i) => (
                    <button 
                        key={cat} 
                        onClick={() => setSelectedCategory(cat)} 
                        onMouseEnter={() => setHoveredCat(cat)}
                        onMouseLeave={() => setHoveredCat(null)}
                        style={{ 
                            padding: '10px 24px', 
                            borderRadius: '100px', 
                            // Style Logic: Selected -> Purple Border, Hover -> White Border, Normal -> Faint White
                            border: selectedCategory === cat ? '1px solid rgba(168, 85, 247, 0.4)' : (hoveredCat === cat ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)'), 
                            // Style Logic: Selected -> Purple Bg, Normal/Hover -> Faint White
                            background: selectedCategory === cat ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.03)', 
                            // Color Logic: Selected -> Purple, Hover -> White, Normal -> Gray
                            color: selectedCategory === cat ? '#d8b4fe' : (hoveredCat === cat ? '#fff' : '#9ca3af'), 
                            fontSize: '15px', 
                            fontWeight: '500', 
                            cursor: 'pointer', 
                            transition: 'all 300ms', 
                            boxShadow: selectedCategory === cat ? '0 0 20px rgba(168, 85, 247, 0.15)' : 'none' 
                        }}
                    >
                    {cat}
                    </button>
                ))}
                </div>
            </FadeInSection>
          </div>

          <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '0 24px 100px', marginTop: '40px', position: 'relative', zIndex: 1 }}>
            {filteredArticles.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '40px', alignItems: 'stretch' }}>
                {filteredArticles.map((article, i) => (
                    // WRAP EACH ITEM IN FADE-IN SECTION WITH DELAY
                  <FadeInSection key={`${article.id}-${selectedCategory}`} delay={i * 100} className="stagger-item">
                    <NewsArticle {...article} onClick={() => setSelectedArticle(article)} />
                  </FadeInSection>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}><p>Không tìm thấy bài viết nào phù hợp với từ khóa "{searchQuery}"</p></div>
            )}
          </div>
        </>
      )}
      
      <footer style={{ textAlign: 'center', padding: '60px', color: '#64748b', fontSize: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
      Built by <img src="https://i.ibb.co/TBNykxRH/sniffen-terminal-window-v7.gif" alt="Sniffen" style={{ height: '40px', borderRadius: '4px' }} />
    </footer>
      <CreatePostModal isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} onPost={handleCreatePost} />
      
      <style>{GLOBAL_STYLES}</style>
    </div>
  );
};

export default App;
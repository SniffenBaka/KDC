import React from 'react';
import { ArrowLeft, Sparkles, Image, BarChart2, Quote, Activity, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactBitsBackground from '../components/ReactBitsBackground';
import LightRays from '../components/LightRays';
import GradientText from '../components/GradientText';
import ImageCarousel from '../components/ImageCarousel';
import PollComponent from '../components/PollComponent';
import QuoteBlock from '../components/QuoteBlock';
import InfoCard, { InfoCardGrid } from '../components/InfoCard';
import Timeline from '../components/Timeline';

const BRAND = {
  primary: '#9333EA',
  primaryHover: '#A855F7',
  soft: 'rgba(147, 51, 234, 0.14)',
  border: 'rgba(147, 51, 234, 0.35)',
};

const PRIMARY_GRADIENT = `linear-gradient(90deg, ${BRAND.primary} 0%, ${BRAND.primaryHover} 100%)`;

const Showcase = () => {
  const navigate = useNavigate();

  // Sample data
  const sampleImages = [
    'https://i.ibb.co/7d2yWj2M/Cn-P-14012026-180644.png',
    'https://i.ibb.co/STGDbkg/Cn-P-14012026-180806.png',
    'https://i.ibb.co/84GJKRJL/Cn-P-14012026-180939.png',
    'https://i.ibb.co/r2ZrymDr/Cn-P-14012026-181038.png',
  ];

  const sampleCaptions = [
    'Khoảnh khắc đầu tiên của năm học mới',
    'Những giờ học đáng nhớ',
    'Hoạt động ngoại khóa sôi động',
    'Kỷ niệm cùng bạn bè',
  ];

  const pollOptions = [
    'Rồi, thích rất lâu',
    'Có thích, nhưng nhanh quên',
    'Thích thầm thôi, không dám nói',
    'Chưa từng'
  ];

  const timelineEvents = [
    {
      date: 'Tháng 9, 2025',
      title: 'Khai giảng năm học mới',
      description: 'Ngày đầu tiên bước vào lớp 11A7, gặp gỡ những người bạn mới và bắt đầu hành trình học tập đầy thử thách.',
      location: 'THPT Tam Phú',
    },
    {
      date: 'Tháng 10, 2025',
      title: 'Ngày hội flashmob',
      description: 'Cùng theo dõi và cổ vũ những màn flashmob sôi động của khối 10, lưu lại không khí rộn ràng và tinh thần tuổi học trò.',
      location: 'Sân trường',
    },
    {
      date: 'Tháng 11, 2025',
      title: 'Chuyến đi học tập trải nghiệm',
      description: 'Hành trình leo núi Bà Đen và khám phá KDL Long Điền Sơn, nơi những kỷ niệm tuổi học trò được tạo nên.',
      location: 'Tây Ninh',
    },
    {
      date: 'Tháng 12, 2025',
      title: 'Ra mắt Eight Ducks',
      description: 'Website được tạo ra để lưu giữ những khoảnh khắc đẹp nhất của tuổi học trò, nơi mọi câu chuyện được kể lại.',
      location: 'Online',
    },
  ];


  // Wrapper đơn giản không dùng IntersectionObserver để tránh re-render
  const SectionWrapper = ({ children }) => {
    return <div>{children}</div>;
  };



  return (
    <div style={{ minHeight: '100vh', color: '#f9fafb', position: 'relative', overflowX: 'hidden' }}>
      {/* Background Effects */}
      <ReactBitsBackground />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
        <LightRays
          raysColor="#b943d0"
          raysSpeed={0.9}
          lightSpread={1}
          rayLength={2.2}
          fadeDistance={1.2}
          pulsating
          className="custom-rays"
        />
      </div>

      {/* Content */}
      <div className="showcase-container" style={{ maxWidth: '980px', margin: '0 auto', padding: '140px 24px 60px', position: 'relative', zIndex: 1 }}>

        {/* Back Button - Hidden on mobile since we have navbar */}
        <button
          className="back-button"
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${BRAND.border}`,
            padding: '10px 16px',
            borderRadius: '12px',
            color: '#e5e7eb',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            marginBottom: '32px',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(147, 51, 234, 0.15)';
            e.currentTarget.style.borderColor = BRAND.primaryHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            e.currentTarget.style.borderColor = BRAND.border;
          }}
        >
          <ArrowLeft size={18} />
          Quay lại trang chủ
        </button>

        {/* Header */}
        
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Sparkles size={32} color={BRAND.primaryHover} />
            </div>
            <h1 style={{ 
              fontSize: 'clamp(40px, 6vw, 56px)', 
              fontWeight: '700', 
              marginBottom: '16px',
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}>
              <GradientText colors={["#7B3FE4", "#A855F7", "#CBA7FF"]} animationSpeed={2.5} direction="horizontal" yoyo pauseOnHover={false}>
                <span className="showcase-title-line1">Showcase Nội Dung</span>
                <span className="showcase-title-break"> </span>
                <span className="showcase-title-line2">Sáng Tạo</span>
              </GradientText>
            </h1>
            <p style={{ 
              fontSize: '18px', 
              color: '#cbd5e1', 
              maxWidth: '700px', 
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Khám phá các định dạng nội dung đa dạng và sáng tạo của Eight Ducks
            </p>
          </div>
        

        {/* Section 1: Image Carousel */}
        
          <section style={{ marginBottom: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}><Image size={24} color="#a855f7" /></div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#f9fafb', margin: 0 }}>Bộ sưu tập hình ảnh</h2>
            </div>
            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              marginBottom: '40px',
              textAlign: 'center',
            }}>
              Lưu giữ những khoảng khắc đẹp về tuổi trẻ, thanh xuân của lớp 11A7
            </p>
            <ImageCarousel images={sampleImages} captions={sampleCaptions} />
          </section>
        

        {/* Section 2: Poll */}
        
          <section style={{ marginBottom: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}><BarChart2 size={24} color="#a855f7" /></div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#f9fafb', margin: 0 }}>Khảo sát tương tác</h2>
            </div>
            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              marginBottom: '40px',
              textAlign: 'center',
            }}>
              Bình chọn với thanh tiến trình động và lưu kết quả
            </p>
            <PollComponent
              question="Quan điểm của bạn về tình yêu tuổi học trò?"
              options={pollOptions}
              pollId="showcase-poll-1"
            />
          </section>
        

        {/* Section 3: Quote Blocks */}
        
          <section style={{ marginBottom: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
               <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}><Quote size={24} color="#a855f7" /></div>
               <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#f9fafb', margin: 0 }}>Trích dẫn nổi bật</h2>
            </div>
            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              marginBottom: '40px',
              textAlign: 'center',
            }}>
              Nhiều kiểu dáng khác nhau để làm nổi bật thông điệp quan trọng
            </p>
            <QuoteBlock
              text="Thanh xuân chỉ có một lần, hãy để nó được kể lại."
              author="Eight Ducks Team"
              variant="default"
            />
            <QuoteBlock
              text="Mỗi khoảnh khắc đều đáng giá, mỗi câu chuyện đều có ý nghĩa."
              author="Học sinh 11A7"
              variant="highlighted"
            />
            <QuoteBlock
              text="Tuổi học trò là những trang sách đẹp nhất trong cuộc đời."
              variant="bordered"
            />
          </section>
        

        {/* Section 4: Info Cards */}
        
          <section style={{ marginBottom: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
               <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}><Activity size={24} color="#a855f7" /></div>
               <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#f9fafb', margin: 0 }}>Thống kê & Thành tựu</h2>
            </div>
            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              marginBottom: '40px',
              textAlign: 'center',
            }}>
              Những thành tựu của Eight Ducks đã làm trong thời gian qua
            </p>
            <InfoCardGrid>
              <InfoCard
                icon="users"
                number={8}
                label="Thành viên"
                color="#3b82f6"
              />
              <InfoCard
                icon="heart"
                number={30}
                suffix="+"
                label="Lượt yêu thích"
                color="#ec4899"
              />
              <InfoCard
                icon="sparkles"
                number={5}
                label="Bài viết"
                color="#a855f7"
              />
              <InfoCard
                icon="trending"
                number={1000}
                suffix="+"
                label="Lượt xem"
                color="#10b981"
              />
            </InfoCardGrid>
          </section>
        

        {/* Section 5: Timeline */}
        
          <section style={{ marginBottom: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
               <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}><Calendar size={24} color="#a855f7" /></div>
               <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#f9fafb', margin: 0 }}>Dòng thời gian</h2>
            </div>
            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              marginBottom: '40px',
              textAlign: 'center',
            }}>
              Kể chuyện theo trình tự thời gian với bố cục đẹp mắt
            </p>
            <Timeline events={timelineEvents} />
          </section>
        

        {/* Footer CTA */}
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '80px',
          padding: '40px 24px',
          background: 'rgba(147, 51, 234, 0.05)',
          borderRadius: '24px',
          border: `1px dashed ${BRAND.border}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: '18px', color: '#e5e7eb', marginBottom: '24px', fontFamily: 'Inter, sans-serif' }}>
              Sẵn sàng kể câu chuyện của riêng bạn?
            </p>
            <button
              onClick={() => navigate('/', { state: { openCreatePost: true } })}
              style={{
                padding: '16px 36px',
                background: PRIMARY_GRADIENT,
                border: 'none',
                borderRadius: '999px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: `0 8px 30px ${BRAND.primary}50`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                letterSpacing: '0.01em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 12px 40px ${BRAND.primary}70`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 8px 30px ${BRAND.primary}50`;
              }}
            >
              Bắt đầu viết ngay
            </button>
          </div>
        </div>
        
        

        {/* Footer Credit */}
        
        <footer style={{ 
          textAlign: 'center', 
          marginTop: '60px', 
          paddingTop: '40px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
          color: '#64748b', 
          fontSize: '14px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '8px' 
        }}>
          Built by <img src="https://i.ibb.co/TBNykxRH/sniffen-terminal-window-v7.gif" alt="Sniffen" style={{ height: '32px', borderRadius: '4px' }} />
        </footer>
        
      </div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .showcase-container {
            padding: 100px 20px 40px !important;
          }
          .back-button {
            display: none !important; /* Hide back button on mobile, use navbar instead */
          }
          section {
            margin-bottom: 60px !important;
          }
          .showcase-title-break {
            display: none; /* Hide the space on mobile */
          }
          .showcase-title-line2 {
            display: block; /* Force second line to new line */
          }
        }
        @media (max-width: 480px) {
          .showcase-container {
            padding: 80px 16px 32px !important;
          }
          h1 {
            font-size: 32px !important;
          }
          h2 {
            font-size: 24px !important;
          }
          section {
            margin-bottom: 48px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Showcase;


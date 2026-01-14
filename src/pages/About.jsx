import React from 'react';
import { ArrowLeft, Heart, Camera, Pen, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactBitsBackground from '../components/ReactBitsBackground';
import LightRays from '../components/LightRays';
import GradientText from '../components/GradientText';

const BRAND = {
  primary: '#9333EA',
  primaryHover: '#A855F7',
  soft: 'rgba(147, 51, 234, 0.14)',
  border: 'rgba(147, 51, 234, 0.35)',
};

const PRIMARY_GRADIENT = `linear-gradient(90deg, ${BRAND.primary} 0%, ${BRAND.primaryHover} 100%)`;

const About = () => {
  const navigate = useNavigate();

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
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(80px, 10vw, 120px) 24px 60px', position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <button
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
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ 
            fontSize: 'clamp(40px, 6vw, 56px)', 
            fontWeight: '700', 
            marginBottom: '16px',
            letterSpacing: '-0.02em',
            lineHeight: '1.2'
          }}>
            <GradientText colors={["#7B3FE4", "#A855F7", "#CBA7FF"]} animationSpeed={2.5} direction="horizontal" yoyo pauseOnHover={false}>
              Về Eight Ducks
            </GradientText>
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#cbd5e1', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Eight Ducks - Many Stories
          </p>
        </div>

        {/* Content Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Card 1: Chúng tôi là ai */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: 'clamp(24px, 4vw, 32px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: PRIMARY_GRADIENT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Users size={24} color="#fff" />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#f9fafb' }}>
                Chúng tôi là ai?
              </h2>
            </div>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#cbd5e1', margin: '0 0 12px 0' }}>
              Nhóm học sinh lớp 11A7 THPT Tam Phú giàu năng lượng, đam mê con chữ và yêu thích kể chuyện.
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#cbd5e1', margin: 0 }}>
              Tụi mình tạo ra website này để lưu giữ những khoảnh khắc đẹp nhất của tuổi học trò - những cảm xúc chân thật, những ký ức không thể quên.
            </p>
          </div>

          {/* Card 2: Nội dung từ đâu */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: 'clamp(24px, 4vw, 32px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: PRIMARY_GRADIENT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Pen size={24} color="#fff" />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#f9fafb' }}>
                Nội dung từ đâu?
              </h2>
            </div>
            <ul style={{ fontSize: '16px', lineHeight: '1.8', color: '#cbd5e1', margin: 0, paddingLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#e5e7eb' }}>Bài viết:</strong> 100% do nhóm tự viết, lấy cảm hứng từ cuộc sống học đường
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#e5e7eb' }}>Hình ảnh:</strong> Tự chụp bởi các bạn trong nhóm, chỉnh sửa với AI (Nano Banana)
              </li>
              <li>
                <strong style={{ color: '#e5e7eb' }}>Video:</strong> Trích dẫn nguồn rõ ràng theo chuẩn MLA
              </li>
            </ul>
          </div>

          {/* Card 3: Disclaimer */}
          <div style={{
            background: 'rgba(147, 51, 234, 0.05)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${BRAND.border}`,
            borderRadius: '16px',
            padding: 'clamp(24px, 4vw, 32px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: PRIMARY_GRADIENT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Heart size={24} color="#fff" />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#f9fafb' }}>
                Lưu ý quan trọng
              </h2>
            </div>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#cbd5e1', margin: '0 0 12px 0' }}>
              Các câu chuyện trên website được <strong style={{ color: '#d8b4fe' }}>sáng tác và hư cấu hóa</strong> dựa trên cảm xúc và trải nghiệm thực tế của tuổi học trò.
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#cbd5e1', margin: 0 }}>
              Nhân vật và tình tiết chỉ là hư cấu, nhằm mục đích giải trí và gợi cảm xúc. Mọi sự trùng hợp đều là ngẫu nhiên.
            </p>
          </div>

          {/* Card 4: Mục đích */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: 'clamp(24px, 4vw, 32px)',
            textAlign: 'center'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: PRIMARY_GRADIENT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Camera size={24} color="#fff" />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#f9fafb' }}>
                Tại sao tạo ra website này?
              </h2>
            </div>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#cbd5e1', margin: 0 }}>
              Vì bọn tôi tin rằng mỗi cảm xúc, mỗi khoảnh khắc của tuổi học trò đều đáng được lưu giữ. 
              <br />
              <span style={{ color: '#a78bfa', fontStyle: 'italic' }}>
                "Thanh xuân chỉ có một lần, hãy để nó được kể lại."
              </span>
            </p>
          </div>

        </div>

        {/* Footer CTA */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '60px',
          padding: '40px 24px',
          background: 'rgba(147, 51, 234, 0.05)',
          borderRadius: '20px',
          border: `1px dashed ${BRAND.border}`
        }}>
          <p style={{ fontSize: '18px', color: '#e5e7eb', marginBottom: '20px' }}>
            Bạn cũng có câu chuyện muốn chia sẻ?
          </p>
          <button
            onClick={() => navigate('/', { state: { openCreatePost: true } })}
            style={{
              padding: '14px 32px',
              background: PRIMARY_GRADIENT,
              border: 'none',
              borderRadius: '999px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: `0 8px 24px ${BRAND.soft}`,
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Viết câu chuyện của bạn
          </button>
        </div>

        {/* Footer Credit */}
        <footer style={{ 
          textAlign: 'center', 
          padding: '40px 20px 20px', 
          color: '#64748b', 
          fontSize: '14px',
          marginTop: '20px',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '8px' 
        }}>
          Built by <img src="https://i.ibb.co/TBNykxRH/sniffen-terminal-window-v7.gif" alt="Sniffen" style={{ height: '40px', borderRadius: '4px' }} />
        </footer>
      </div>
    </div>
  );
};

export default About;

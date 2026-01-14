import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Users, Heart, Sparkles } from 'lucide-react';

const BRAND = {
  primary: '#9333EA',
  primaryHover: '#A855F7',
};

const ICONS = {
  'trending': TrendingUp,
  'users': Users,
  'heart': Heart,
  'sparkles': Sparkles,
};

const InfoCard = ({ 
  icon = 'sparkles',
  number = 0,
  label = "",
  suffix = "",
  color = BRAND.primary,
  animationDuration = 2000
}) => {
  const [displayNumber, setDisplayNumber] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const Icon = ICONS[icon] || Sparkles;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    const currentCard = cardRef.current;
    if (currentCard) {
      observer.observe(currentCard);
    }

    return () => {
      if (currentCard) {
        observer.unobserve(currentCard);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const target = typeof number === 'string' ? parseFloat(number) : number;
    const duration = animationDuration;
    const startTime = performance.now();

    const easeOutExpo = (t) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Calculate current value based on easing
      const current = Math.floor(easeOutExpo(progress) * target);
      setDisplayNumber(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayNumber(target);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, number, animationDuration]);

  return (
    <div
      ref={cardRef}
      style={{
        position: 'relative',
        background: 'rgba(20, 20, 20, 0.4)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '30px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        textAlign: 'center',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        overflow: 'hidden',
        height: '100%',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.border = `1px solid ${color}40`;
        e.currentTarget.style.boxShadow = `0 15px 40px -10px ${color}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.05)';
        e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.37)';
      }}
    >
      {/* Subtle Gradient Backdrop */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at top right, ${color}08, transparent 60%)`,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Floating Icon */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '60px',
        height: '60px',
        borderRadius: '20px',
        background: `linear-gradient(135deg, ${color}20, ${color}10)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${color}30`,
        boxShadow: `0 8px 20px ${color}15`,
      }}>
        <Icon size={28} color={color} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Number */}
        <div style={{
          fontSize: '48px',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #9333ea 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-2px',
          lineHeight: '1.1',
          marginBottom: '8px',
          display: 'inline-block'
        }}>
          {displayNumber}{suffix}
        </div>

        {/* Label */}
        <div style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontFamily: 'Inter, sans-serif'
        }}>
          {label}
        </div>
      </div>
    </div>
  );
};

// Grid Container Component
export const InfoCardGrid = ({ children }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)', // 4 cards per row on desktop
      gap: '24px',
      margin: '40px auto',
      maxWidth: '1200px',
    }}
    className="info-card-grid">
      {children}
      <style>{`
        @media (max-width: 1024px) {
          .info-card-grid {
            grid-template-columns: repeat(2, 1fr) !important; /* 2 cards on tablet */
            gap: 20px !important;
          }
        }
        @media (max-width: 640px) {
          .info-card-grid {
            grid-template-columns: 1fr !important; /* 1 card on mobile */
            gap: 16px !important;
            margin: 24px auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InfoCard;

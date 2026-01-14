import React from 'react';
import { Quote } from 'lucide-react';

const BRAND = {
  primary: '#9333EA',
  primaryHover: '#A855F7',
  soft: 'rgba(147, 51, 234, 0.14)',
  border: 'rgba(147, 51, 234, 0.35)',
};

const QuoteBlock = ({ 
  text = "", 
  author = "", 
  variant = "default"
}) => {
  // We'll use a unified premium style instead of drastically different "alert" boxes
  // Variants will just subtlely change the accent color or glow
  
  const getGlowColor = () => {
    switch(variant) {
      case 'highlighted': return 'rgba(168, 85, 247, 0.15)'; // Purple glow
      case 'bordered': return 'rgba(255, 255, 255, 0.03)'; // White/Neutral
      default: return 'rgba(147, 51, 234, 0.08)'; // Default primary glow
    }
  };

  const borderColor = variant === 'highlighted' ? BRAND.primaryHover : 'rgba(255, 255, 255, 0.1)';

  return (
    <div style={{
      margin: '40px auto',
      maxWidth: '800px',
      padding: '40px',
      minHeight: '180px',
      borderRadius: '24px',
      background: 'rgba(255, 255, 255, 0.01)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${borderColor}`,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      boxShadow: `0 10px 40px -10px rgba(0,0,0,0.3)`
    }}
    onMouseEnter={(e) => {
        e.currentTarget.style.border = `1px solid ${BRAND.primary}60`;
        e.currentTarget.style.boxShadow = `0 15px 50px -10px ${BRAND.soft}`;
    }}
    onMouseLeave={(e) => {
        e.currentTarget.style.border = `1px solid ${borderColor}`;
        e.currentTarget.style.boxShadow = `0 10px 40px -10px rgba(0,0,0,0.3)`;
    }}
    >
      {/* Large Watermark Quote Icon */}
      <div style={{
        position: 'absolute',
        top: '-10px',
        left: '20px',
        opacity: 0.05,
        transform: 'rotate(10deg)',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <Quote size={180} color="#fff" />
      </div>

      {/* Decorative tiny quote for visual anchor */}
      <div style={{ marginBottom: '20px', position: 'relative', zIndex: 1 }}>
        <Quote size={32} color={BRAND.primaryHover} fill={BRAND.primaryHover} style={{ opacity: 0.8 }} />
      </div>

      {/* Quote Text */}
      <blockquote style={{
        position: 'relative',
        zIndex: 1,
        margin: 0,
        padding: 0,
        fontSize: '22px', // Larger, editorial font size
        lineHeight: '1.5',
        color: '#f3f4f6',
        fontFamily: "'Playfair Display', serif", // Premium serif font if available, or just elegant serif
        fontWeight: '500',
        fontStyle: 'italic',
      }}>
        "{text}"
      </blockquote>

      {/* Author */}
      {author && (
        <div style={{
          position: 'relative',
          zIndex: 1,
          marginTop: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
           <div style={{ width: '30px', height: '1px', background: BRAND.primaryHover, opacity: 0.5 }}></div>
           <span style={{
             fontSize: '14px',
             color: '#94a3b8',
             fontWeight: '600',
             textTransform: 'uppercase',
             letterSpacing: '0.1em',
             fontFamily: 'Inter, sans-serif'
           }}>
             {author}
           </span>
        </div>
      )}

      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        background: `radial-gradient(circle at center, ${getGlowColor()} 0%, transparent 70%)`,
        zIndex: -1,
        pointerEvents: 'none'
      }} />
    </div>
  );
};

export default QuoteBlock;

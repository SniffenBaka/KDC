import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BRAND = {
  primary: '#9333EA',
  primaryHover: '#A855F7',
  soft: 'rgba(147, 51, 234, 0.14)',
  border: 'rgba(147, 51, 234, 0.35)',
  logo: 'https://i.ibb.co/twbnpPDK/d93ab92f-7d17-4f7e-8d6a-a2601020866b.png',
};

const PRIMARY_GRADIENT = `linear-gradient(90deg, ${BRAND.primary} 0%, ${BRAND.primaryHover} 100%)`;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredNav, setHoveredNav] = React.useState(null);
  
  const navItems = ['Trang chủ', 'Tin tức', 'Video', 'Showcase', 'Giới thiệu'];

  // Determine active nav based on current path
  const getActiveNav = () => {
    const path = location.pathname;
    if (path === '/') return 'Trang chủ';
    if (path === '/showcase') return 'Showcase';
    if (path === '/about') return 'Giới thiệu';
    return 'Trang chủ';
  };

  const activeNav = getActiveNav();

  const handleNavClick = (item) => {
    // Handle About page navigation
    if (item === 'Giới thiệu') {
      navigate('/about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Handle Showcase page navigation
    if (item === 'Showcase') {
      navigate('/showcase');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // For Trang chủ, Tin tức, Video - navigate to home and scroll to appropriate section
    navigate('/');
    
    if (item === 'Trang chủ') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item === 'Video') {
      setTimeout(() => {
        document.getElementById('video-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else if (item === 'Tin tức') {
      setTimeout(() => {
        document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <>
      <nav style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 9999, 
        background: 'rgba(255, 255, 255, 0.01)', 
        backdropFilter: 'blur(20px) saturate(160%)', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)', 
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        transition: 'all 800ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ 
          width: '100%', 
          padding: 'clamp(12px, 2.5vw, 16px) clamp(14px, 4vw, 40px)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
            <button
              onClick={() => handleNavClick('Trang chủ')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                padding: 0
              }}
            >
              <img 
                src={BRAND.logo} 
                alt="Logo" 
                style={{ 
                  width: 'clamp(32px, 7vw, 40px)', 
                  height: 'clamp(32px, 7vw, 40px)', 
                  borderRadius: '10px', 
                  objectFit: 'cover'
                }} 
              />
              <div 
                className="brand-title"
                style={{ 
                  fontSize: 'clamp(18px, 4vw, 24px)', 
                  fontWeight: '700', 
                  color: '#f9fafb', 
                  letterSpacing: '-0.5px' 
                }}
              >
                Eight Ducks
              </div>
            </button>
          </div>

          {/* Nav Items */}
          <div className="nav-links" style={{ display: 'flex', gap: 'clamp(16px, 3vw, 32px)', alignItems: 'center' }}>
            {navItems.map((item) => (
              <button 
                key={item} 
                onClick={() => handleNavClick(item)} 
                onMouseEnter={() => setHoveredNav(item)}
                onMouseLeave={() => setHoveredNav(null)}
                className="nav-item"
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: activeNav === item ? '#a78bfa' : (hoveredNav === item ? '#ffffff' : '#9ca3af'), 
                  fontSize: 'clamp(12px, 2vw, 14px)', 
                  fontWeight: '500', 
                  cursor: 'pointer', 
                  transition: 'all 300ms', 
                  position: 'relative', 
                  padding: '0 0 4px 0', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textShadow: activeNav === item ? '0 0 8px rgba(167, 139, 250, 0.5)' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {item}
                <div style={{ 
                  position: 'absolute', 
                  bottom: '-21px', 
                  left: 0, 
                  width: '100%', 
                  height: '2px', 
                  background: PRIMARY_GRADIENT, 
                  opacity: activeNav === item ? 1 : 0, 
                  transform: activeNav === item ? 'scaleX(1)' : 'scaleX(0.5)', 
                  transition: 'all 300ms', 
                  boxShadow: '0 -4px 10px rgba(139, 92, 246, 0.5)' 
                }} />
              </button>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links {
            gap: 12px !important;
          }
          .nav-links .nav-item:nth-child(2),
          .nav-links .nav-item:nth-child(3) {
            display: none !important; /* Hide Tin tức and Video on mobile */
          }
        }
        @media (max-width: 480px) {
          .brand-title {
            display: none !important; /* Hide brand title on very small screens */
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;

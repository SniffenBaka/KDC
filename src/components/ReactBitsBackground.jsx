
import React from 'react';

const ReactBitsBackground = () => {
    const fadeRef = React.useRef(null);
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

    React.useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      backgroundColor: '#0f0c29', 
      background: 'linear-gradient(to bottom, #141e30, #243b55)', // Slightly brighter midnight blue gradient
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      <style>{`
        @keyframes drift {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -50px) rotate(10deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes floatSlow {
          0% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(-50px, 50px) scale(1.1); opacity: 0.7; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
        }
        @keyframes auroraFlow {
          0% { transform: rotate(0deg) scale(1); filter: blur(100px); }
          50% { transform: rotate(180deg) scale(1.2); filter: blur(130px); }
          100% { transform: rotate(360deg) scale(1); filter: blur(100px); }
        }
      `}</style>

      {/* 1. Main Ambient Orb (Purple/Violet) - Center/Bottom */}
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '20%',
        width: '80vw',
        height: '80vw',
        background: 'radial-gradient(circle, rgba(118, 75, 162, 0.5), transparent 70%)',
        borderRadius: '50%',
        animation: 'floatSlow 20s ease-in-out infinite',
        mixBlendMode: 'screen',
        willChange: 'transform, opacity'
      }} />

      {/* 2. Secondary Orb (Cyan/Teal) - Top/Left */}
      <div style={{
        position: 'absolute',
        top: '-30%',
        left: '-10%',
        width: '70vw',
        height: '70vw',
        background: 'radial-gradient(circle, rgba(14, 210, 247, 0.35), transparent 65%)',
        borderRadius: '50%',
        animation: 'drift 25s ease-in-out infinite reverse',
        mixBlendMode: 'screen',
        filter: 'blur(80px)',
        willChange: 'transform'
      }} />

      {/* 3. Accent Orb (Pink/Magenta) - Top/Right */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-20%',
        width: '60vw',
        height: '60vw',
        background: 'radial-gradient(circle, rgba(255, 106, 136, 0.3), transparent 70%)',
        borderRadius: '50%',
        animation: 'floatSlow 18s ease-in-out infinite alternate',
        mixBlendMode: 'screen',
        filter: 'blur(90px)',
        willChange: 'transform, opacity'
      }} />

      {/* 4. Deep Depth Orb (Dark Blue) - Center/Top */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '30%',
        width: '90vw',
        height: '90vw',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2), transparent 60%)',
        borderRadius: '50%',
        animation: 'auroraFlow 30s linear infinite',
        mixBlendMode: 'overlay',
        zIndex: -2 // Behind others
      }} />

      {/* 5. Vignette Overlay (Focus Center) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, transparent 0%, rgba(6, 0, 16, 0.4) 60%, rgba(6, 0, 16, 0.9) 100%)',
        pointerEvents: 'none'
      }} />

      {/* 6. Interactive Mouse Spotlight */}
        <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, rgba(147, 197, 253, 0.08), transparent 70%)',
            transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)`,
            pointerEvents: 'none',
            zIndex: 0,
            willChange: 'transform',
            transition: 'transform 0.1s ease-out',
            mixBlendMode: 'plus-lighter'
        }} />
      
      {/* 7. Static Noise Texture (Film Grain Effect) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        pointerEvents: 'none',
        mixBlendMode: 'overlay'
      }}/>
    </div>
  );
};

export default ReactBitsBackground;

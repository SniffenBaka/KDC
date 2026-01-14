import React, { useState, useEffect, useRef } from 'react';

const FadeInSection = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { 
        if (entry.isIntersecting) setIsVisible(true); 
      });
    }, { threshold: 0.1 }); 
    
    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => { 
      if (currentRef) observer.unobserve(currentRef); 
    };
  }, []);
  
  return (
    <div ref={domRef} className={`reveal-section ${isVisible ? 'is-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

export default FadeInSection;

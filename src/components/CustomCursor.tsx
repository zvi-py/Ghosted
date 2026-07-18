import React, { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement>(null);
  
  const mouseRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef({ x: -100, y: -100 });
  const particleIdRef = useRef(0);
  const lastEmitRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Update cursor dot instantly
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Check if mouse is hovering over a button, link, input, or clickable item
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') !== null ||
        target.closest('a') !== null ||
        target.closest('[role="button"]') !== null ||
        target.classList.contains('cursor-pointer');
      
      setIsHovering(!!isClickable);

      // Emit ambient particles following cursor movement very subtly
      const now = Date.now();
      if (now - lastEmitRef.current > 30) {
        lastEmitRef.current = now;
        const size = Math.random() * 2.5 + 1.2;
        const colors = [
          'rgba(214, 184, 255, 0.45)', // #D6B8FF Soft Lavender
          'rgba(183, 133, 255, 0.45)', // #B785FF Neon Purple
          'rgba(143, 93, 255, 0.45)',  // #8F5DFF Electric Violet
          'rgba(125, 211, 252, 0.45)'  // #7DD3FC Aurora Blue
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        setParticles((prev) => [
          ...prev,
          {
            id: particleIdRef.current++,
            x: e.clientX,
            y: e.clientY,
            size,
            color: randomColor,
            alpha: 1,
            life: 0,
            maxLife: 30 // frames
          }
        ].slice(-15)); // Keep max 15 active particles for absolute performance
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  // Handle laggy follow effect (interpolation) for the glowing trail
  useEffect(() => {
    let animationFrameId: number;
    
    const updateTrail = () => {
      // Linear interpolation: current + (target - current) * factor
      const dx = mouseRef.current.x - trailRef.current.x;
      const dy = mouseRef.current.y - trailRef.current.y;
      
      // Responsive, fast-following interpolation
      trailRef.current = {
        x: trailRef.current.x + dx * 0.22,
        y: trailRef.current.y + dy * 0.22
      };

      if (cursorTrailRef.current) {
        cursorTrailRef.current.style.transform = `translate3d(${trailRef.current.x}px, ${trailRef.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Update ambient particle life
      setParticles((prev) => 
        prev
          .map((p) => ({
            ...p,
            life: p.life + 1,
            alpha: 1 - p.life / p.maxLife,
            y: p.y - 0.25, // very slowly float upwards
            x: p.x + (Math.random() - 0.5) * 0.4
          }))
          .filter((p) => p.life < p.maxLife)
      );

      animationFrameId = requestAnimationFrame(updateTrail);
    };

    animationFrameId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Subtle background portal transition layout shadow overlay inside Cursor */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {/* Soft custom cursor point */}
        <div
          ref={cursorDotRef}
          className="fixed w-2.5 h-2.5 rounded-full pointer-events-none bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] z-50 transition-[transform,background-color] duration-150 ease-out"
          style={{
            left: 0,
            top: 0,
            transform: `translate3d(${mouseRef.current.x}px, ${mouseRef.current.y}px, 0) translate(-50%, -50%) scale(${isHovering ? 2.2 : 1})`,
            backgroundColor: isHovering ? '#7c3aed' : '#FFFFFF'
          }}
        />

        {/* Outer luxurious glowing trail */}
        <div
          ref={cursorTrailRef}
          className="fixed rounded-full pointer-events-none border border-purple-500/35 z-40 transition-[width,height,background-color,box-shadow,border-color] duration-200 ease-out"
          style={{
            left: 0,
            top: 0,
            width: isHovering ? '44px' : '26px',
            height: isHovering ? '44px' : '26px',
            transform: `translate3d(${trailRef.current.x}px, ${trailRef.current.y}px, 0) translate(-50%, -50%)`,
            backgroundColor: isHovering ? 'rgba(124, 58, 237, 0.08)' : 'rgba(124, 58, 237, 0.02)',
            boxShadow: isHovering 
              ? '0 0 24px rgba(124, 58, 237, 0.4), inset 0 0 10px rgba(124, 58, 237, 0.2)' 
              : '0 0 14px rgba(124, 58, 237, 0.12)',
          }}
        />

        {/* Ambient dust trail particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="fixed rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity: p.alpha,
              boxShadow: `0 0 6px ${p.color}`,
              transition: 'opacity 0.1s linear'
            }}
          />
        ))}
      </div>
    </>
  );
};

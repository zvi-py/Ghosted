import React, { useEffect, useRef } from 'react';

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Star drawing helper
    const drawStar = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      c.beginPath();
      c.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        c.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        c.lineTo(x, y);
        rot += step;
      }
      c.lineTo(cx, cy - outerRadius);
      c.closePath();
      c.fill();
    };

    // Particle class
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      opacitySpeed: number;
      color: string;
      isSparkle: boolean;
    }

    // Bubble class for trendy floating animations
    interface Bubble {
      x: number;
      y: number;
      baseX: number;
      size: number;
      speedY: number;
      swaySpeed: number;
      swayRange: number;
      swayOffset: number;
      hue: 'purple' | 'sky';
    }

    const particles: Particle[] = [];
    const bubbles: Bubble[] = [];
    const colors = [
      'rgba(106, 93, 178, ',  // Celestial purple
      'rgba(142, 99, 227, ',  // Lavender-purple
      'rgba(125, 99, 212, ',  // Pastel violet
      'rgba(75, 92, 168, '    // Deep steel blue
    ];

    // Create initial particles
    const particleCount = Math.min(50, Math.floor((width * height) / 30000));
    for (let i = 0; i < particleCount; i++) {
      const colorTemplate = colors[Math.floor(Math.random() * colors.length)];
      const isSparkle = Math.random() > 0.65; // Some are elegant 4-point stars
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isSparkle ? Math.random() * 1.5 + 1.2 : Math.random() * 1.8 + 0.4,
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: (Math.random() - 0.5) * 0.12 - 0.05, // Subtle upward drift
        opacity: Math.random() * 0.6 + 0.25,
        opacitySpeed: (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        color: colorTemplate,
        isSparkle
      });
    }

    // Create initial floating bubbles
    const bubbleCount = 18;
    for (let i = 0; i < bubbleCount; i++) {
      const initialX = Math.random() * width;
      bubbles.push({
        x: initialX,
        y: Math.random() * (height + 200), // disperse them initially
        baseX: initialX,
        size: Math.random() * 14 + 8, // 8px to 22px bubbles
        speedY: -(Math.random() * 0.45 + 0.2), // slow upward speed
        swaySpeed: Math.random() * 0.015 + 0.005,
        swayRange: Math.random() * 15 + 8,
        swayOffset: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.5 ? 'purple' : 'sky'
      });
    }

    // Glassmorphic Bubble drawing helper
    const drawBubble = (c: CanvasRenderingContext2D, b: Bubble) => {
      c.save();
      c.beginPath();
      c.arc(b.x, b.y, b.size, 0, Math.PI * 2);
      c.closePath();

      // Radial gloss reflection gradient
      const highlightX = b.x - b.size * 0.3;
      const highlightY = b.y - b.size * 0.3;
      const grad = c.createRadialGradient(
        highlightX,
        highlightY,
        b.size * 0.1,
        b.x,
        b.y,
        b.size
      );

      grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      grad.addColorStop(0.3, b.hue === 'purple' ? 'rgba(216, 180, 254, 0.12)' : 'rgba(186, 230, 253, 0.12)');
      grad.addColorStop(0.8, b.hue === 'purple' ? 'rgba(168, 85, 247, 0.04)' : 'rgba(56, 189, 248, 0.04)');
      grad.addColorStop(0.95, b.hue === 'purple' ? 'rgba(192, 132, 252, 0.22)' : 'rgba(14, 165, 233, 0.22)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      c.fillStyle = grad;
      c.fill();

      // Elegant faint stroke outline
      c.strokeStyle = b.hue === 'purple' ? 'rgba(192, 132, 252, 0.25)' : 'rgba(56, 189, 248, 0.3)';
      c.lineWidth = 0.8;
      c.stroke();

      // Specular highlight bubble flare
      c.beginPath();
      c.arc(highlightX, highlightY, b.size * 0.15, 0, Math.PI * 2);
      c.fillStyle = 'rgba(255, 255, 255, 0.65)';
      c.fill();

      c.restore();
    };

    // Animation Loop
    const draw = () => {
      // Clear with soft luminous light-theme background
      ctx.fillStyle = '#f7f6fd';
      ctx.fillRect(0, 0, width, height);

      // Create a soft linear vertical sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#f2effd'); // Soft celestial lilac-blue top
      skyGrad.addColorStop(0.5, '#f9f8fc'); // Luminous ivory center
      skyGrad.addColorStop(1, '#ebe8f7'); // Soft pastel lavender bottom
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // --- DRAW THE MAJESTIC AURORA BOREALIS WAVES ---
      const time = Date.now() * 0.0004;
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';

      // Aurora Wave 1 - Delicate Lavender Pink Glow (Left-Center)
      const wave1X = width * 0.3 + Math.sin(time * 0.7) * width * 0.12;
      const wave1Y = height * 0.35 + Math.cos(time * 0.5) * height * 0.05;
      const grad1 = ctx.createRadialGradient(
        wave1X,
        wave1Y,
        50,
        wave1X,
        wave1Y,
        Math.max(width, height) * 0.65
      );
      grad1.addColorStop(0, 'rgba(188, 160, 242, 0.22)'); // Soft lavender
      grad1.addColorStop(0.4, 'rgba(142, 99, 227, 0.08)');
      grad1.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.arc(wave1X, wave1Y, Math.max(width, height) * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // Aurora Wave 2 - Radiant Celestial Sky Blue (Right-Center)
      const wave2X = width * 0.68 + Math.cos(time * 0.6) * width * 0.14;
      const wave2Y = height * 0.3 + Math.sin(time * 0.4) * height * 0.06;
      const grad2 = ctx.createRadialGradient(
        wave2X,
        wave2Y,
        80,
        wave2X,
        wave2Y,
        Math.max(width, height) * 0.6
      );
      grad2.addColorStop(0, 'rgba(141, 163, 242, 0.25)'); // Glowing light sky blue
      grad2.addColorStop(0.4, 'rgba(106, 93, 178, 0.09)');
      grad2.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(wave2X, wave2Y, Math.max(width, height) * 0.6, 0, Math.PI * 2);
      ctx.fill();

      // Aurora Wave 3 - Soft Magenta/Lilac Accent (Center-Lower)
      const wave3X = width * 0.48 + Math.sin(time * 0.4) * width * 0.1;
      const wave3Y = height * 0.55 + Math.cos(time * 0.8) * height * 0.08;
      const grad3 = ctx.createRadialGradient(
        wave3X,
        wave3Y,
        20,
        wave3X,
        wave3Y,
        Math.max(width, height) * 0.5
      );
      grad3.addColorStop(0, 'rgba(222, 193, 255, 0.22)'); // Soft lilac-pink
      grad3.addColorStop(0.5, 'rgba(142, 99, 227, 0.07)');
      grad3.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad3;
      ctx.beginPath();
      ctx.arc(wave3X, wave3Y, Math.max(width, height) * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // --- DRAW SOPHISTICATED EDITORIAL GRID & CROSSHAIRS ---
      ctx.save();
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.035)'; // Very faint elegant lilac lines
      ctx.lineWidth = 0.8;
      const gridSize = 120;
      
      // Draw vertical grid lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Draw horizontal grid lines
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw elegant little + crosshairs at intersections
      ctx.fillStyle = 'rgba(124, 58, 237, 0.15)';
      for (let x = gridSize; x < width; x += gridSize) {
        for (let y = gridSize; y < height; y += gridSize) {
          ctx.font = '7px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('+', x, y);
        }
      }
      ctx.restore();

      // --- DRAW STAR CONSTELLATION CONNECTIONS ---
      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.06; // extremely subtle connection
            ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // --- DRAW TWINKLING STARS & SPARKLES ---
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle
        p.x += p.speedX;
        p.y += p.speedY;

        // Pulsing twinkles
        p.opacity += p.opacitySpeed;
        if (p.opacity > 0.85 || p.opacity < 0.2) {
          p.opacitySpeed = -p.opacitySpeed;
        }

        // Wrap around borders
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = height;

        ctx.fillStyle = p.color + p.opacity + ')';

        if (p.isSparkle) {
          // Draw high-fidelity 4-point star sparkle
          ctx.shadowBlur = p.size * 3.5;
          ctx.shadowColor = 'rgba(142, 99, 227, 0.4)';
          drawStar(ctx, p.x, p.y, 4, p.size * 3.2, p.size * 0.6);
        } else {
          // Draw classic circular star
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0; // Reset shadow for next draws
      }

      // --- DRAW FLOATING BUBBLES ---
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];

        // Gently drift upward
        b.y += b.speedY;

        // Soft sine wave swaying side to side
        b.swayOffset += b.swaySpeed;
        b.x = b.baseX + Math.sin(b.swayOffset) * b.swayRange;

        // When bubble floats off screen top, reset to bottom
        if (b.y < -b.size - 10) {
          b.y = height + b.size + Math.random() * 80;
          b.x = Math.random() * width;
          b.baseX = b.x;
          b.size = Math.random() * 14 + 8;
          b.speedY = -(Math.random() * 0.45 + 0.2);
        }

        // Keep horizontal coordinates within wrap boundaries
        if (b.x < -b.size) {
          b.x = width + b.size;
          b.baseX = b.x;
        } else if (b.x > width + b.size) {
          b.x = -b.size;
          b.baseX = b.x;
        }

        drawBubble(ctx, b);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-20 pointer-events-none" />;
};

"use client";
import { useEffect, useRef, ReactNode } from "react";

interface YellowStarShapesBackgroundProps {
  children?: ReactNode;
}

export default function YellowStarShapesBackground({ children }: YellowStarShapesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fonction pour dessiner une étoile à 5 branches
  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, alpha: number) => {
    const spikes = 5;
    const step = Math.PI / spikes;
    ctx.beginPath();
    for (let i = 0; i < 2 * spikes; i++) {
      const r = i % 2 === 0 ? radius : radius / 2;
      const angle = i * step - Math.PI / 2;
      const px = x + r * Math.cos(angle);
      const py = y + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(${color},${alpha})`;
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 20 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 8 + 4,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      alpha: Math.random() * 0.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach(star => {
        // Déplacement
        star.x += star.vx;
        star.y += star.vy;

        // Rebond sur les bords
        if (star.x < 0 || star.x > width) star.vx *= -1;
        if (star.y < 0 || star.y > height) star.vy *= -1;

        // Dessiner une vraie étoile
        drawStar(ctx, star.x, star.y, star.radius, "255,223,0", star.alpha); // jaune
      });

      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="yellow-star-shapes-bg">
      <canvas ref={canvasRef} className="canvas" />
      <div className="overlay">{children}</div>

      <style jsx>{`
        .yellow-star-shapes-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: transparent;
          z-index: -10;
        }
        .canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .overlay {
          position: relative;
          z-index: 10;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}

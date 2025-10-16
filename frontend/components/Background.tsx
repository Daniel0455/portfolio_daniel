"use client";

import React, { useEffect, useRef } from "react";

export default function FuturisticBackground({ children }) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const nodes = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];

        // Interaction avec le curseur
        const dxMouse = n1.x - mouse.current.x;
        const dyMouse = n1.y - mouse.current.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 150) {
          n1.x -= dxMouse * 0.015;
          n1.y -= dyMouse * 0.015;
        }

        // Mouvement naturel
        n1.x += n1.vx;
        n1.y += n1.vy;

        if (n1.x < 0 || n1.x > width) n1.vx *= -1;
        if (n1.y < 0 || n1.y > height) n1.vy *= -1;

        // --- Dessiner les points ---
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgb(220, 8, 134)";
        ctx.fill();

        // --- Connecter les lignes entre les points ---
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = 1 - dist / 130;
            const gradient = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
            gradient.addColorStop(0, `rgba(220,8,134,${alpha})`);
            gradient.addColorStop(0.5, `rgba(152,19,251,${alpha})`);
            gradient.addColorStop(1, `rgba(25,93,252,${alpha})`);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    draw();

    // Gestion du redimensionnement
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Suivi du curseur
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="neural-bg">
      <canvas ref={canvasRef} className="canvas" />
      <div className="overlay">{children}</div>

      <style jsx>{`
        .neural-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background-color: transparent;
          z-index: -10;
        }
        .canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background: transparent;
        }
        .overlay {
          position: relative;
          z-index: 10;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
      `}</style>
    </div>
  );
}

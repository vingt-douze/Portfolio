import { useEffect, useRef } from "react";
import "./background.scss";
import { veryLongText } from "./text";

const fontSize = 16;
const maxBlur = 2; // Flou maximal (en pixels)
const maxChar = 75;
const fadeDuration = 1700; // ms, for each fade (in and out)
const maxDelay = 2500; // ms
const startDelay = 0; // ms

type Char = { col: number; row: number; start: number };

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const container = canvas?.parentElement;
    if (!canvas || !ctx || !container) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let columns = 1;
    let top = 0;

    // The canvas only covers the viewport plus a margin and scrolls natively with the page.
    // It is moved (and redrawn in the same frame) only when the viewport leaves it.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      width = window.innerWidth;
      height = Math.ceil(window.innerHeight * 1.5);
      columns = Math.floor(width / fontSize);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px Arial`;
      ctx.textBaseline = "top";
      top = Number.NEGATIVE_INFINITY;
    };

    const reset = (char: Char, now: number) => {
      char.row = -1;
      char.start = now + Math.random() * maxDelay;
    };

    // Place the character when it starts to appear, so it is always in the viewport
    const place = (char: Char) => {
      const firstRow = Math.ceil(window.scrollY / fontSize);
      const rows = Math.floor(window.innerHeight / fontSize);
      char.col = Math.floor(Math.random() * columns);
      char.row = firstRow + Math.floor(Math.random() * rows);
    };

    const chars: Char[] = Array.from({ length: maxChar }, () => ({ col: 0, row: -1, start: 0 }));
    for (const char of chars) reset(char, performance.now() + startDelay);

    const draw = (now: number) => {
      const scrollY = window.scrollY;
      if (scrollY < top || scrollY + window.innerHeight > top + height) {
        const maxTop = Math.max(0, container.offsetHeight - height);
        const newTop = Math.min(Math.max(0, scrollY - (height - window.innerHeight) / 2), maxTop);
        if (newTop !== top) {
          top = newTop;
          canvas.style.transform = `translateY(${top}px)`;
        }
      }

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("--text-color-secondary");

      for (const char of chars) {
        const elapsed = now - char.start;
        if (elapsed < 0) continue;
        if (elapsed >= fadeDuration * 2) {
          reset(char, now);
          continue;
        }
        if (char.row < 0) place(char);

        const alpha = elapsed < fadeDuration ? elapsed / fadeDuration : 2 - elapsed / fadeDuration;
        ctx.globalAlpha = alpha;
        // ctx.filter = `blur(${maxBlur - alpha * maxBlur}px)`;
        const text = veryLongText[(char.row * columns + char.col) % veryLongText.length];
        ctx.fillText(text, char.col * fontSize, char.row * fontSize - top);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

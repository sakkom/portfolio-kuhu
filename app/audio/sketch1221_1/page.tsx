"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function createSpectrumAnalyser(
  canvas: HTMLCanvasElement,
  freqData: Uint8Array,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = freqData.length,
    h = 255 + 20;
  canvas.width = w;
  canvas.height = h;

  ctx.strokeStyle = "white";
  ctx.strokeRect(0, 0, w, h);

  const barWidth = w / freqData.length;
  for (let i = 0; i < freqData.length; i++) {
    const y = freqData[i];
    ctx.fillStyle = `hsl(${i % 360}, 50%, 20%)`;
    ctx.fillRect(barWidth * i + 10, h - 10, barWidth, -y);
    if (i % 100 == 0) {
      ctx.fillStyle = "white";
      ctx.fillRect(barWidth * i + 10, h - 10, barWidth, -h + 20);
    }
  }
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    /*web audio api */
    const ctx = new AudioContext();
    const speaker = ctx.destination;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.connect(speaker);

    const freqData = new Uint8Array(analyser.frequencyBinCount);

    let refId = 0;

    const handleClick = () => {
      ctx.resume();
      const audio = new Audio("/audio/audio-01.mp3");
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      audio.play();

      const loop = () => {
        if (!canvasRef.current) return;

        analyser.getByteFrequencyData(freqData);
        createSpectrumAnalyser(canvasRef.current, freqData);

        refId = requestAnimationFrame(loop);
      };
      loop();
    };

    window.addEventListener("click", handleClick, { once: true });
    return () => {
      cancelAnimationFrame(refId);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

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

  const barWidth = (w / freqData.length) * 20;
  for (let i = 0; i < freqData.length; i++) {
    const y = freqData[i];
    ctx.fillStyle = `hsl(${i % 360}, 50%, 20%)`;
    ctx.fillRect(barWidth * i + 10, h - 10, barWidth, -y);
    // if (i % 10 == 0) {
    //   ctx.fillStyle = "white";
    //   ctx.fillRect(barWidth * i + 10, h - 10, barWidth, -h + 20);
    // }
  }
}

function drawKick(canvas: HTMLCanvasElement, isKick: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = 512;
  canvas.height = 512;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const radius = isKick * 100;
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
  ctx.fill();
}

function getBaseAverage(freqData: Uint8Array) {
  let sum = 0;
  const bin = 44100 / 2048;
  // 0 ~ 100hzの低音
  const startBin = Math.floor(20 / bin);
  const endBin = Math.ceil(50 / bin);
  for (let j = startBin; j < endBin; j++) {
    sum += freqData[j];
  }
  sum /= endBin - startBin;
  // sum /= 255;
  return sum;
}

function getAverageEnergy(freqData: Uint8Array, targetHz: [number, number]) {
  const bin = 44100 / 2048;
  const start = Math.floor(targetHz[0] / bin);
  const end = Math.ceil(targetHz[1] / bin);

  let sum = 0;
  for (let i = start; i < end; i++) {
    sum += freqData[i];
  }
  sum /= end - start;
  return sum;
}
function getAverageRatio(freqData: Uint8Array, targetHz: [number, number]) {
  let a = getAverageEnergy(freqData, targetHz);
  a /= 255;
  return a;
}

function isOnSubBass(freqData: Uint8Array, clock: number, deltaTime: number) {
  const aver = getAverageEnergy(freqData, [20, 50]);
  const isEnergy = aver > 180;
  clock = isEnergy ? clock + deltaTime : 0;
  const isOn = clock > deltaTime * 10;
  return { isOn: Number(isOn), newClock: clock };
}

//clockの更新はuseRefで行う。条件に応じて計測
// endtimeは時間を距離で考えている。10frame分167msくらい
function getSubBaseRatio(
  freqData: Uint8Array,
  clock: number,
  deltaTime: number,
) {
  const aver = getAverageEnergy(freqData, [20, 50]);
  const isEnergy = aver > 180;
  clock = isEnergy ? clock + deltaTime : 0;
  const endTime = deltaTime * 10;
  const progress = Math.min(clock / endTime, 1.0);
  // const is = clock > deltaTime * 10;
  return { newClock: clock, progress };
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const measureClock = useRef(0);

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
      // const audio = new Audio("/audio/o_o_out_on_Wisdom_Teeth.mp3");

      const source = ctx.createMediaElementSource(audio);

      const highPass = ctx.createBiquadFilter();
      highPass.type = "highpass";
      highPass.frequency.value = 20;
      const lowPass = ctx.createBiquadFilter();
      lowPass.type = "lowpass";
      lowPass.frequency.value = 50;
      source.connect(highPass);
      highPass.connect(lowPass);
      lowPass.connect(analyser);
      analyser.connect(speaker);

      // source.connect(analyser);
      // analyser.connect(speaker);

      audio.play();

      const clock = new THREE.Clock();

      const loop = () => {
        if (!canvasRef.current) return;

        analyser.getByteFrequencyData(freqData);

        createSpectrumAnalyser(canvasRef.current, freqData);

        const deltaTime = clock.getDelta();
        const result = getSubBaseRatio(
          freqData,
          measureClock.current,
          deltaTime,
        );
        measureClock.current = result.newClock;
        // changeCircle = Math.pow(changeCircle, 10) * 2.5;

        drawKick(canvasRef.current, result.progress);

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

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { any } from "three/tsl";

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

function drawBaseCircle(canvas: HTMLCanvasElement, baseRatios: number[]) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = 1024;
  canvas.height = 512;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < baseRatios.length; i++) {
    const radius = baseRatios[i] * 100;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(100 + i * 100, canvas.height / 2, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawKick(canvas: HTMLCanvasElement, isKick: boolean) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = 512;
  canvas.height = 512;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const radius = Number(isKick) * 100;
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
  ctx.fill();
}

function averageBase04(freqData: Uint8Array): number[] {
  const ratios = [];

  for (let i = 1; i <= 10; i++) {
    const range = i * 5;
    let sum = 0;
    for (let j = 0; j < range; j++) {
      sum += freqData[j];
    }
    sum /= range;
    sum /= 255;
    ratios.push(sum);
  }
  return ratios;
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

function isOnSubBass(freqData: Uint8Array, clock: number, deltaTime: number) {
  const aver = getBaseAverage(freqData);
  const isEnergy = aver > 180;
  clock = isEnergy ? clock + deltaTime : 0;
  const isOn = clock > deltaTime * 10;
  return { isOn: isOn, newClock: clock };
}

function kickDetection(
  freqData: Uint8Array,
  lastEnergy: number,
  lastKickTime: number,
  timestamp: number,
) {
  let isKick = false;
  const nowEnergy = getBaseAverage(freqData);
  const decayed = lastEnergy * 0.9;
  const changeEnergy = nowEnergy - lastEnergy;

  const spanKick = Math.abs(timestamp - lastKickTime);

  let newKickTime = lastKickTime;
  // console.log({
  //   time: (timestamp / 1000).toFixed(1) + "s",
  //   now: nowEnergy.toFixed(0),
  //   change: changeEnergy.toFixed(1),
  //   span: spanKick.toFixed(0),
  // });

  if (changeEnergy > 20 && spanKick > 200 && nowEnergy > 150) {
    isKick = true;
    newKickTime = timestamp;
    console.log("kick!");
    console.log("kick!", {
      now: nowEnergy.toFixed(1),
      change: changeEnergy.toFixed(1),
      span: spanKick.toFixed(0),
    });
  }

  return {
    isKick,
    lastEnergy: nowEnergy,
    lastKickTime: newKickTime,
  };
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastEnergy = useRef(0);
  const lastKickTime = useRef(0);
  const isOnMouse = useRef(false);
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
      const audio = new Audio("/audio/audio-04.mp3");
      const source = ctx.createMediaElementSource(audio);
      /*一部の音を聞く */
      const highPass = ctx.createBiquadFilter();
      highPass.type = "highpass";
      highPass.frequency.value = 0;
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
      const loop = (timestamp: number) => {
        if (!canvasRef.current) return;

        analyser.getByteFrequencyData(freqData);
        createSpectrumAnalyser(canvasRef.current, freqData);
        // const ratios = averageBase04(freqData);
        // drawBaseCircle(canvasRef.current, ratios);
        // const result = kickDetection(
        //   freqData,
        //   lastEnergy.current,
        //   lastKickTime.current,
        //   timestamp,
        // );
        // lastEnergy.current = result.lastEnergy;
        // lastKickTime.current = result.lastKickTime;
        // drawKick(canvasRef.current, result.isKick);
        const deltaTime = clock.getDelta();
        const { isOn, newClock } = isOnSubBass(
          freqData,
          measureClock.current,
          deltaTime,
        );
        isOnMouse.current = isOn;
        measureClock.current = newClock;
        drawKick(canvasRef.current, isOnMouse.current);

        refId = requestAnimationFrame(loop);
      };
      loop(0);
    };

    window.addEventListener("click", handleClick, { once: true });
    return () => {
      cancelAnimationFrame(refId);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

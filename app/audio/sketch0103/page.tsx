"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function createSpectrumAnalyser(
  canvas: HTMLCanvasElement,
  freqData: Uint8Array,
  rangeHz: [number, number],
  aver: number,
  binFlux: number,
  fftSize: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width,
    h = canvas.height;
  canvas.width = w;
  canvas.height = h;

  ctx.strokeStyle = "white";
  ctx.strokeRect(0, 0, w, h);

  const bin = 44100 / fftSize;
  const start = Math.floor(rangeHz[0] / bin);
  const end = Math.ceil(rangeHz[1] / bin);

  const binNum = end - start;
  const barWidth = w / binNum;
  // console.log(barWidth);

  for (let i = start; i < end; i++) {
    const y = freqData[i];
    if (i == binFlux) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = `white`;
    }
    ctx.fillRect(barWidth * (i - start), h - 10, barWidth, -y);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(0, h - aver, w, 1);

  ctx.fillStyle = "green";
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(0, h - i * 50 - 10, 10, 1);
  }
}

export default function Page() {
  const spectrumCanvas = useRef<HTMLCanvasElement>(null);
  const prevFreq = useRef<number[]>([]);
  const flux = useRef<number[]>([]);
  const [maxFlux, setMaxFlux] = useState<{ vol: number; info: string }>();
  //各binに対して10フレーム分のボリュームを保持
  const prevFrames = useRef<number[][]>(new Array(1024).fill(new Array(10)));
  const prevMinFrames = useRef<number[]>([]);
  const prevFluxFrames = useRef<number[]>([]);
  const lastKick = useRef(0);

  const FRAMES = 2.0;
  const TARGETHZ: [number, number] = [500, 750];

  useEffect(() => {
    if (!spectrumCanvas.current) return;

    const clock = new THREE.Clock();

    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.connect(ctx.destination);
    const freqBuffer = new Uint8Array(analyser.frequencyBinCount);

    const bin = 44100 / analyser.fftSize;
    const start = Math.ceil(TARGETHZ[0] / bin);
    const end = Math.floor(TARGETHZ[1] / bin);

    const handleClick = () => {
      ctx.resume();
      // const audio = new Audio("/audio/A1_Alright_DIRT082.mp3");
      const audio = new Audio("/audio/audio-02.mp3");
      // const audio = new Audio(
      //   "/audio/Synaptic_Paths_Free_Bandcamp_Download.mp3",
      // );
      const source = ctx.createMediaElementSource(audio);
      const highPass = ctx.createBiquadFilter();
      highPass.type = "highpass";
      highPass.frequency.value = TARGETHZ[0];
      const lowPass = ctx.createBiquadFilter();
      lowPass.type = "lowpass";
      lowPass.frequency.value = TARGETHZ[1];
      source.connect(highPass);
      highPass.connect(lowPass);
      lowPass.connect(analyser);
      analyser.connect(ctx.destination);
      audio.play();
      audio.currentTime = 60.0;

      const loop = () => {
        if (!spectrumCanvas.current) return;

        analyser.getByteFrequencyData(freqBuffer);

        //各binに対して10フレーム分のボリュームを保持
        for (let i = start; i < end; i++) {
          if (!prevFrames.current[i]) {
            prevFrames.current[i] = [];
          }
          if (prevFrames.current[i].length > FRAMES) {
            prevFrames.current[i].shift();
          }
          prevFrames.current[i].push(freqBuffer[i]);
        }
        // console.log(prevFrame.current);
        //過去10フレームの最初値と現在の値のfluxを取る。min検出
        for (let i = start; i < end; i++) {
          const targetBin = prevFrames.current[i];
          let minFramesNum = 255.0;
          for (let j = 0; j < FRAMES; j++) {
            const thisNum = targetBin[j];
            if (minFramesNum > thisNum) {
              minFramesNum = thisNum;
            }
          }
          prevMinFrames.current[i] = minFramesNum;
        }
        //平均値
        for (let i = start; i < end; i++) {
          const targetBin = prevFrames.current[i];
          let sum = 0.0;
          for (let j = 0; j < FRAMES; j++) {
            const thisNum = targetBin[j];
            sum += thisNum;
          }
          sum /= FRAMES;
          prevMinFrames.current[i] = sum;
        }
        // console.log(prevMinFrames.current);
        // frame in 最初値と現在のfluxを取得
        for (let i = start; i < end; i++) {
          const d = freqBuffer[i] - prevMinFrames.current[i];
          prevFluxFrames.current[i] = d;
        }
        // console.log(prevFluxFrames);
        //最大変化binを取得
        let maxFlux = 0.0;
        let binFlux = 0.0;
        for (let i = start; i < end; i++) {
          if (maxFlux < prevFluxFrames.current[i]) {
            maxFlux = prevFluxFrames.current[i];
            if (maxFlux > 10) {
              binFlux = i;
              setMaxFlux({ vol: maxFlux, info: `bin is ${binFlux}` });
            }
          }
        }

        const delay = clock.getElapsedTime() - lastKick.current;

        let counter = 0.0;
        for (let i = start; i < end; i++) {
          if (10 < prevFluxFrames.current[i] && delay > 0.3) {
            counter++;
          }
        }

        if (counter >= (end - start) * 0.8 && delay > 0.3) {
          let sum = 0.0;
          for (let i = start; i < end; i++) {
            sum += freqBuffer[i];
          }
          sum /= end - start;
          // if (sum > 100) {
          console.log("kick?");
          lastKick.current = clock.getElapsedTime();
          // }

          // console.log(counter, `max size ${end - start}`);
        }

        createSpectrumAnalyser(
          spectrumCanvas.current,
          freqBuffer,
          // TARGETHZ,
          [0, 22050],
          0.0,
          binFlux,
          analyser.fftSize,
        );

        /*一つのフレームでのflux検出 */

        //flux取得
        // for (let i = 0; i < freqBuffer.length; i++) {
        //   if (prevFreq.current.length > 0 && flux.current) {
        //     const diff = freqBuffer[i] - prevFreq.current[i];
        //     flux.current[i] = diff;
        //   }
        // }
        //fluxの最大変化binを取得
        // let maxVol = 0.0;
        // let binNum = 0.0;
        // for (let i = 0; i < freqBuffer.length; i++) {
        //   if (maxVol < flux.current[i]) {
        //     maxVol = flux.current[i];
        //     binNum = i;
        //     if (maxVol > 30) {
        //       setMaxFlux({ vol: maxVol, info: `bin is ${binNum}` });
        //     }
        //   }
        // }
        //ひとつ前の値を保持で次の計算にまわす
        // for (let i = 0; i < freqBuffer.length; i++) {
        //   prevFreq.current[i] = freqBuffer[i];
        // }

        requestAnimationFrame(loop);
      };
      loop();
    };
    window.addEventListener("click", handleClick, { once: true });
  }, []);

  return (
    <>
      <canvas ref={spectrumCanvas} width={1024} height={255} />
      <div>
        <div>{maxFlux?.vol}</div>
        <div>{maxFlux?.info}</div>
      </div>
    </>
  );
}

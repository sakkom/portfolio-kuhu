"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { range } from "three/src/nodes/TSL.js";

const full: [number, number] = [0, 22050];
const subBass: [number, number] = [20, 50];
const bass: [number, number] = [50, 200];
const middleBass: [number, number] = [200, 800];
const midde: [number, number] = [800, 1500];
const middleHight: [number, number] = [2000, 4000];
//かちゃかしゃ聞こえる。
const high: [number, number] = [5000, 10000];
const superHigh: [number, number] = [10000, 16000];
const superSuperHight: [number, number] = [16000, 20000];

const hikaku: [number, number] = [20, 60];
// const target: [number, number] = [50, 250];
const target: [number, number] = [20, 500];

export function createSpectrumAnalyser(
  canvas: HTMLCanvasElement,
  freqData: Uint8Array,
  rangeHz: [number, number],
  aver: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width,
    h = canvas.height;
  canvas.width = w;
  canvas.height = h;

  ctx.strokeStyle = "white";
  ctx.strokeRect(0, 0, w, h);

  const bin = 44100 / 2048;
  const start = Math.floor(rangeHz[0] / bin);
  const end = Math.ceil(rangeHz[1] / bin);

  const binNum = end - start;
  const barWidth = w / binNum;
  // console.log(barWidth);

  for (let i = start; i < end; i++) {
    const y = freqData[i];
    ctx.fillStyle = `hsl(${(i * 10) % 360}, 50%, 50%)`;
    ctx.fillRect(barWidth * (i - start), h - 10, barWidth, -y);
    // if (i % 10 == 0) {
    //   ctx.fillStyle = "gray";
    //   ctx.fillRect(barWidth * i + 10, h - 10, barWidth, -h + 20);
    // }
  }

  ctx.fillStyle = "red";
  ctx.fillRect(0, h - aver, w, 1);

  ctx.fillStyle = "green";
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(0, h - i * 50 - 10, 10, 1);
  }

  // ctx.fillStyle = "green";
  // for (let i = 0; i < 5; i++) {
  //   ctx.fillRect((i * w) / bin, h, 1, -10);
  // }
}

function drawKick(canvas: HTMLCanvasElement, isKick: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = 256;
  canvas.height = 256;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const radius = (isKick * canvas.width) / 2;
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

export function getAverageEnergy(
  freqData: Uint8Array,
  targetHz: [number, number],
) {
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

//clockの更新はuseRefで行う。条件に応じて計測
// endtimeは時間を距離で考えている。10frame分167msくらい
function getSubBaseRatio(
  freqData: Uint8Array,
  clock: number,
  deltaTime: number,
  rangeHz: [number, number],
  threshold: number,
) {
  const aver = getAverageEnergy(freqData, rangeHz);
  const isEnergy = aver > threshold;
  clock = isEnergy ? clock + deltaTime : 0;
  const endTime = deltaTime * 1;
  const progress = Math.min(clock / endTime, 1.0);
  // const is = clock > deltaTime * 10;
  return { newClock: clock, progress };
}

export default function Page() {
  const canvasSpectrumRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const measureClock = useRef(0);
  const [aver, setAver] = useState<number>(0);
  const [del, setDel] = useState<number>(0);
  const prevSum = useRef<number>(0);
  const prevSums = useRef<number[]>([]);
  const lastKick = useRef(0);

  /* range is here */
  // const rangeHz: [number, number] = [60, 1000];
  const rangeHz: [number, number] = full;

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

    /*three */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1 / 1, 0.1, 100);
    camera.position.set(0, 0, 20);
    const light = new THREE.DirectionalLight(0xffffff, 3.0);
    light.position.set(5, 5, 5);
    scene.add(light);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(1024 / 2, 1024 / 2);

    const geometry = new THREE.BoxGeometry(0.1, 5, 5, 10, 10, 10);
    const material = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleClick = () => {
      ctx.resume();
      // const audio = new Audio("/audio/o_o_out_on_Wisdom_Teeth.mp3");
      const audio = new Audio(
        "/audio/seductive-chill-hip-hop-instrumental-hear-me-134134.mp3",
      );
      // const audio = new Audio("/audio/A1_Alright_DIRT082.mp3");
      // const audio = new Audio(
      //   "/audio/Synaptic_Paths_Free_Bandcamp_Download.mp3",
      // );
      // const audio = new Audio("/audio/audio-05.mp3");
      const source = ctx.createMediaElementSource(audio);

      const highPass = ctx.createBiquadFilter();
      highPass.type = "highpass";
      highPass.frequency.value = rangeHz[0];
      const lowPass = ctx.createBiquadFilter();
      lowPass.type = "lowpass";
      lowPass.frequency.value = rangeHz[1];
      source.connect(highPass);
      highPass.connect(lowPass);
      lowPass.connect(analyser);
      analyser.connect(speaker);

      // source.connect(analyser);
      // analyser.connect(speaker);

      audio.playbackRate = 1.0;
      audio.currentTime = 70;
      audio.play();

      const clock = new THREE.Clock();

      const loop = () => {
        if (!canvasRef.current) return;
        if (!canvasSpectrumRef.current) return;

        //sketch this here
        analyser.getByteFrequencyData(freqData);
        const currentMiddleAver = getAverageEnergy(freqData, rangeHz);
        const bassAver = getAverageEnergy(freqData, bass);
        const deltaMiddle = currentMiddleAver - prevSum.current;
        let isKick = false;
        // console.log(deltaMiddle);
        // if (deltaMiddle > 30) {
        //   isKick = true;
        //   console.log("isKick", { deltaMiddle });
        //   setDel(deltaMiddle);
        // }
        // prevSum.current = currentMiddleAver;

        prevSums.current.push(currentMiddleAver);
        if (prevSums.current.length > 5) {
          prevSums.current.shift();
        }
        const loopNum = prevSums.current.length;
        let sum = 0;
        let minAve = 1000;
        for (let i = 0; i < loopNum; i++) {
          sum += prevSums.current[i];
          minAve = Math.min(minAve, prevSums.current[i]);
        }
        sum /= loopNum;
        const delta = currentMiddleAver - minAve;
        const currentTime = clock.getElapsedTime();
        const coolDown = currentTime - lastKick.current;
        if (delta > 30 && coolDown > 0.3 && currentMiddleAver > 0) {
          // console.log(delta);

          isKick = true;
          console.log("isKick", { delta });
          lastKick.current = currentTime;
        }
        const timeSinceLastKick = currentTime - lastKick.current;
        const shouldShowKick = timeSinceLastKick < 0.1 ? 1 : 0;

        // const deltaRatio =
        //   timeSinceLastKick < 1.0
        //     ? ((delta / 30) * currentMiddleAver) / 255
        //     : 0;
        // const deltaRatio =
        //   timeSinceLastKick < 0.5 ? currentMiddleAver / 255 : 0;
        const deltaRatio = currentMiddleAver / 255;
        console.log(deltaRatio);

        setDel(delta);

        const aver = getAverageEnergy(freqData, rangeHz);
        setAver(aver);
        createSpectrumAnalyser(
          canvasSpectrumRef.current,
          freqData,
          rangeHz,
          aver,
        );

        const deltaTime = clock.getDelta();
        const result = getSubBaseRatio(
          freqData,
          measureClock.current,
          deltaTime,
          rangeHz,
          220,
        );
        measureClock.current = result.newClock;
        // changeCircle = Math.pow(changeCircle, 10) * 2.5;

        // drawKick(canvasRef.current, result.progress);
        drawKick(canvasRef.current, Number(shouldShowKick));
        // mesh.scale(Number(deltaRatio), Number(deltaRatio), Number(deltaRatio));
        mesh.scale.x = Math.pow(deltaRatio, 5.0) * 10.0;
        mesh.scale.y = Math.pow(deltaRatio, 5.0) * 10.0;
        mesh.scale.z = Math.pow(deltaRatio, 5.0) * 10.0;
        mesh.rotateX(deltaRatio * 0.05);
        mesh.rotateY(deltaRatio * 0.05);
        mesh.rotateZ(deltaRatio * 0.05);
        renderer.render(scene, camera);

        refId = requestAnimationFrame(loop);
      };
      loop();
    };

    window.addEventListener("click", handleClick, { once: true });
    return () => {
      cancelAnimationFrame(refId);
    };
  }, []);

  return (
    <>
      <h6>
        {rangeHz[0]}hz-{rangeHz[1]}hz average: {aver}
      </h6>
      <div style={{ display: "flex" }}>
        <canvas ref={canvasSpectrumRef} />
        <canvas ref={canvasRef} />
      </div>
      {/*<h1>delta: {del}</h1>*/}
    </>
  );
}

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { rmsShader } from "./shader";
import { count } from "node:console";
import { time } from "three/src/nodes/TSL.js";

const TARGETHZ: [number, number] = [0, 22050];

function getRms(timeBuffer: Float32Array) {}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smoothRms = useRef<number>(0);
  const prevRms = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048 / 2;
    const timeBuffer = new Float32Array(analyser.fftSize);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    const material = new THREE.ShaderMaterial(rmsShader);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleClick = () => {
      //初期化
      ctx.resume();
      // const audio = new Audio("/audio/audio-03.mp3");
      // const audio = new Audio(
      //   "/audio/Synaptic_Paths_Free_Bandcamp_Download.mp3",
      // );
      // const audio = new Audio("/audio/o_o_out_on_Wisdom_Teeth.mp3");
      const audio = new Audio("/audio/GOOD LIFE EDIT - DEYO X MALOCO.wav");
      audio.currentTime = 0.0;

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
      /*音をだすまでここまで*/

      const clock = new THREE.Clock();
      const loop = () => {
        analyser.getFloatTimeDomainData(timeBuffer);
        // console.log(timeBuffer);

        let sum = 0.0;
        for (let i = 0; i < analyser.fftSize; i++) {
          sum += timeBuffer[i] * timeBuffer[i];
        }
        sum /= analyser.fftSize;
        const rms = Math.sqrt(sum);
        smoothRms.current = smoothRms.current * 0.8 + rms * 0.2;
        // console.log(smoothRms.current);

        //ゼロ交差法
        let counter = 0;
        for (let i = 0; i < analyser.fftSize - 1; i++) {
          const one = Math.sign(timeBuffer[i]);
          const two = Math.sign(timeBuffer[i + 1]);
          if ((one == 1.0 && two == -1.0) || (one == -1.0 && two == 1.0)) {
            counter++;
          }
        }
        const zcr = counter / analyser.fftSize;

        // material.uniforms.uRms.value = rms;
        material.uniforms.uRms.value = smoothRms.current;
        material.uniforms.uZcr.value = zcr;
        material.uniforms.uTime.value = clock.getElapsedTime();

        renderer.render(scene, camera);
        requestAnimationFrame(loop);
      };
      loop();
    };
    window.addEventListener("click", handleClick, { once: true });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <canvas ref={canvasRef} height={512 * 1.2} width={512 * 1.2} />
    </div>
  );
}

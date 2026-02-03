"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { glslSchoolWeek3 } from "./shader";
import { count } from "node:console";
import { time } from "three/src/nodes/TSL.js";
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
} from "three/examples/jsm/Addons.js";
import { rippleShader } from "./ripple";
import { glitch0109 } from "./glitch";
import { fisheye0109 } from "./fisheye";

const TARGETHZ: [number, number] = [0, 22050];

export namespace AudioAnalyser {
  export function init(fftSize: number) {
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = fftSize;
    const buffer = new Float32Array(analyser.fftSize);
    return { ctx, analyser, buffer };
  }

  export function play(
    ctx: AudioContext,
    analyser: AnalyserNode,
    audio: HTMLAudioElement,
    currTime?: number,
  ) {
    ctx.resume();
    audio.currentTime = currTime || 0;
    const source = ctx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    audio.play();
  }

  export function getData(
    analyser: AnalyserNode,
    buffer: Float32Array<ArrayBuffer>,
  ) {
    return analyser.getFloatTimeDomainData(buffer);
  }

  export function getRms(fftSize: number, buffer: Float32Array<ArrayBuffer>) {
    let sum = 0.0;
    for (let i = 0; i < fftSize; i++) {
      sum += Math.pow(buffer[i], 2);
    }
    sum /= fftSize;
    return Math.sqrt(sum);
  }

  export function getRmsTime(rms: number, threshold: number, step: number) {
    if (rms > threshold) {
      return rms * step;
    } else {
      return 0;
    }
  }

  export function getZcr(fftSize: number, buffer: Float32Array<ArrayBuffer>) {
    let counter = 0;
    for (let i = 0; i < fftSize - 1; i++) {
      const one = Math.sign(buffer[i]);
      const two = Math.sign(buffer[i + 1]);
      if ((one == 1.0 && two == -1.0) || (one == -1.0 && two == 1.0)) {
        counter++;
      }
    }
    return counter / fftSize;
  }
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smoothRms = useRef<number>(0);
  const rmsTime = useRef<number>(0);
  const zcr = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    canvasRef.current.width = innerHeight;
    canvasRef.current.height = innerHeight;

    const { ctx, analyser, buffer } = AudioAnalyser.init(2048);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    const material = new THREE.ShaderMaterial(glslSchoolWeek3);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const ripple = new ShaderPass(rippleShader);
    const glitch = new ShaderPass(glitch0109);
    const fisheye = new ShaderPass(fisheye0109);
    composer.addPass(fisheye);
    composer.addPass(ripple);
    composer.addPass(glitch);

    const handleClick = () => {
      const audio = new Audio(
        "/audio/sample-pack-link-in-bio-dopetronic-aliens-in-my-basement-331356.mp3",
      );
      AudioAnalyser.play(ctx, analyser, audio);

      const clock = new THREE.Clock();
      const loop = () => {
        AudioAnalyser.getData(analyser, buffer);

        const rms = AudioAnalyser.getRms(analyser.fftSize, buffer);
        smoothRms.current = smoothRms.current * 0.98 + rms * 0.02;

        rmsTime.current += AudioAnalyser.getRmsTime(rms, 0.5, 0.1);

        zcr.current = AudioAnalyser.getZcr(analyser.fftSize, buffer);

        // material.uniforms.uRms.value = rms;
        material.uniforms.uRms.value = smoothRms.current;
        material.uniforms.uZcr.value = zcr.current;
        material.uniforms.uAngle.value = rmsTime.current;
        material.uniforms.uTime.value = clock.getElapsedTime();

        ripple.uniforms.uAngle.value = rmsTime.current;
        ripple.uniforms.uRms.value = smoothRms.current;

        glitch.uniforms.uAngle.value = rmsTime.current;
        glitch.uniforms.uRms.value = smoothRms.current;

        fisheye.uniforms.uAngle.value = rmsTime.current;
        fisheye.uniforms.uRms.value = smoothRms.current;

        // renderer.render(scene, camera);
        composer.render();
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
      <canvas
        ref={canvasRef}
        style={
          {
            // border: "1px solid white",
          }
        }
      />
    </div>
  );
}

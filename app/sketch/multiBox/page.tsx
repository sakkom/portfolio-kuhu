"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
} from "three/examples/jsm/Addons.js";
import { boxShder } from "./box";

function getBaseAverage(freqData: Uint8Array) {
  let sum = 0;
  const bin = 44100 / 2048;
  // 0 ~ 100hzの低音
  const startBin = Math.floor(20 / bin);
  const endBin = Math.ceil(2500 / bin);
  for (let j = startBin; j < endBin; j++) {
    sum += freqData[j];
  }
  sum /= endBin - startBin;
  // sum /= 255;
  return sum;
}

function isOnSubBass(freqData: Uint8Array, clock: number, deltaTime: number) {
  const aver = getBaseAverage(freqData);
  const isEnergy = aver > 100;
  clock = isEnergy ? clock + deltaTime : 0;
  // const isOnRatio = clock > deltaTime * 5;
  const isOnRatio = Math.min(clock / (deltaTime * 10.0), 1.0);

  return { isOn: Number(isOnRatio), newClock: clock };
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isOnMouse = useRef(0);
  const measureClock = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    const material = new THREE.ShaderMaterial(boxShder);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.connect(ctx.destination);
    const timeBuffer = new Float32Array(analyser.fftSize);
    const freqData = new Uint8Array(analyser.frequencyBinCount);

    const timeTexture = new THREE.DataTexture(
      timeBuffer,
      analyser.fftSize,
      1,
      THREE.RedFormat,
      THREE.FloatType,
    );
    timeTexture.needsUpdate = true;

    // const composer = new EffectComposer(renderer);
    // composer.addPass(new RenderPass(scene, camera));
    // const shader0 = new ShaderPass(glitchShader);
    // const shader1 = new ShaderPass(fishShader);
    // composer.addPass(shader0);
    // composer.addPass(shader1);

    const handleClick = () => {
      ctx.resume();
      const audio = new Audio(
        "/audio/seductive-chill-hip-hop-instrumental-hear-me-134134.mp3",
      );
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      audio.play();

      const clock = new THREE.Clock();

      const loop = () => {
        analyser.getFloatTimeDomainData(timeBuffer);
        analyser.getByteFrequencyData(freqData);

        material.uniforms.uTimeTex.value = timeTexture;
        timeTexture.needsUpdate = true;
        material.uniforms.uTime.value += 0.0167;

        //
        // shader0.uniforms.uTimeTex.value = timeTexture;
        // shader1.uniforms.uTimeTex.value = timeTexture;
        // shader1.uniforms.uTime.value += 0.0167;

        // composer.render();

        const deltaTime = clock.getDelta();
        const { isOn, newClock } = isOnSubBass(
          freqData,
          measureClock.current,
          deltaTime,
        );
        isOnMouse.current = isOn;
        measureClock.current = newClock;
        material.uniforms.uKick.value = isOnMouse.current;
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
      <canvas ref={canvasRef} height={512 * 2} width={512 * 2} />
    </div>
  );
}

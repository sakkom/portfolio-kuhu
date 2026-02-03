"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { wavesShader } from "./shader";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smoothBuffer = useRef(new Float32Array(512));

  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(512, 512);

    const material = new THREE.ShaderMaterial(wavesShader);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.connect(ctx.destination);
    const timeBuffer = new Float32Array(analyser.fftSize);

    const dataTexture = new THREE.DataTexture(
      smoothBuffer.current,
      512,
      1,
      THREE.RedFormat,
      THREE.FloatType,
    );
    dataTexture.needsUpdate = true;

    const clock = new THREE.Clock();
    const handleClick = () => {
      ctx.resume();
      const audio = new Audio("/audio/audio-02.mp3");
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      audio.play();

      const loop = () => {
        analyser.getFloatTimeDomainData(timeBuffer);
        for (let i = 0; i < timeBuffer.length; i++) {
          // const normalized = timeBuffer[i] * 0.5 + 0.5; // 0.0〜1.0
          // const stepValue = Math.floor(timeBuffer[i] * 10) / 10;
          smoothBuffer.current[i] =
            smoothBuffer.current[i] * 0.96 + timeBuffer[i] * 0.04;
        }

        material.uniforms.uAudioTexture.value = dataTexture;
        dataTexture.needsUpdate = true;
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
        minHeight: "100vh",
      }}
    >
      <canvas
        ref={canvasRef}
        width={512}
        height={512}
        // style={{ border: "1px solid white" }}
      />
    </div>
  );
}

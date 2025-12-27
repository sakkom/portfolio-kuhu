"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  createSpectrumAnalyser,
  getAverageEnergy,
} from "../sketch1222/sketch1222_2/page";

export default function Page() {
  const canvasFFTRef = useRef<HTMLCanvasElement>(null);
  const canvasTimeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasTimeRef.current) return;
    if (!canvasFFTRef.current) return;
    let refId = 0;

    /*web audio api */
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.connect(ctx.destination);
    analyser.fftSize = 2048;
    const timeData = new Float32Array(analyser.fftSize);
    const fftData = new Uint8Array(analyser.frequencyBinCount);

    /*time data */
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasTimeRef.current });

    const dataTexture = new THREE.DataTexture(
      timeData,
      analyser.fftSize,
      1,
      THREE.RedFormat,
      THREE.FloatType,
    );
    dataTexture.needsUpdate = true;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uAudioTexture: { value: dataTexture },
        uTime: { value: null },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uAudioTexture;
        uniform float uTime;

        void main() {
          vec2 uv = vUv;

          vec2 pos = uv;

          float noise = texture2D(uAudioTexture, vec2(pos.x, 0.5)).r * 0.25 + 0.5;
          float col = abs(pos.y - noise);
          col = smoothstep(0.01, -0.0, col);

          gl_FragColor = vec4(vec3(col), 1.0);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const targetHz: [number, number] = [20, 22050];

    const handleClick = () => {
      ctx.resume();
      // const audio = new Audio("/audio/audio-01.mp3");
      // const audio = new Audio(
      //   "/audio/seductive-chill-hip-hop-instrumental-hear-me-134134.mp3",
      // );
      const audio = new Audio("/audio/audio-03.mp3");
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      audio.play();

      const loop = () => {
        if (!canvasFFTRef.current) return;

        analyser.getFloatTimeDomainData(timeData);
        analyser.getByteFrequencyData(fftData);

        const a = getAverageEnergy(fftData, targetHz);
        createSpectrumAnalyser(canvasFFTRef.current, fftData, targetHz, a);

        dataTexture.needsUpdate = true;
        material.uniforms.uTime.value += 0.167;
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
    <div style={{ display: "flex" }}>
      <canvas ref={canvasFFTRef} height={512} width={512} />
      <canvas ref={canvasTimeRef} height={512} width={1024} />
    </div>
  );
}

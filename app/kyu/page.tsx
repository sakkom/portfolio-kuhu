"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createSpectrumAnalyser, AudioAnalyser } from "../audio/util";

export default function Page() {
  const canvasFFTRef = useRef<HTMLCanvasElement>(null);
  const canvasTimeRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!canvasTimeRef.current) return;
    if (!canvasFFTRef.current) return;
    if (!videoRef.current) return;
    let refId = 0;

    const { ctx, analyser, buffer } = AudioAnalyser.init(2048);

    /*web  api */
    const timeData = new Float32Array(analyser.fftSize);
    const fftData = new Uint8Array(analyser.frequencyBinCount);

    /*time data */
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasTimeRef.current });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(512, 512);

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
        uZrc: { value: null },
        uRms: { value: null },
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
        uniform float uZrc;
        uniform float uRms;

        float rand2(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
          vec2 uv = vUv - 0.5;

          vec2 pos = uv;

          // float noise = texture2D(uAudioTexture, vec2(pos.x, 0.5)).r * 0.25 + 0.5;
          // float col = abs(pos.y - noise);
          // col = smoothstep(0.01, -0.0, col);

          // float ashi = 1.0 -step(uRrc, 0.1);

          vec2 offset = vec2(rand2(uv) - 0.5, rand2(uv * 12.34) - 0.5) *  uRms * 10.0;
          uv += offset;
          float circle = length(uv) - uRms;
          float circleCol = step(circle, 0.01);
          gl_FragColor = vec4(vec3(circleCol), 1.0);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const targetHz: [number, number] = [20, 22050];

    const handleClick = () => {
      if (!videoRef.current) return;
      ctx.resume();
      // const audio = new Audio("/audio/audio-01.mp3");
      // const audio = new Audio(
      //   "/audio/seductive-chill-hip-hop-instrumental-hear-me-134134.mp3",
      // );
      const audio = new Audio("/audio/audio_clean.wav");
      const source = ctx.createMediaElementSource(videoRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      // videoRef.current.muted = true;
      videoRef.current.currentTime = 129;
      videoRef.current.play();
      // audio.play();

      const loop = () => {
        if (!canvasFFTRef.current) return;
        AudioAnalyser.getData(analyser, buffer);
        const uRms = AudioAnalyser.getRms(analyser.fftSize, buffer);
        const uZrc = AudioAnalyser.getZcr(analyser.fftSize, buffer);
        console.log(uZrc);
        console.log(uRms);

        analyser.getFloatTimeDomainData(timeData);
        analyser.getByteFrequencyData(fftData);

        createSpectrumAnalyser(canvasFFTRef.current, fftData, targetHz, 0);

        dataTexture.needsUpdate = true;
        material.uniforms.uTime.value += 0.167;
        material.uniforms.uRms.value = uRms;
        material.uniforms.uZrc.value = uZrc;
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
    <div>
      <div style={{ display: "flex" }}>
        <video ref={videoRef} src="/audio/Hull.mp4" controls width={512} />
        <canvas ref={canvasFFTRef} height={512} width={1024} />
      </div>

      <canvas ref={canvasTimeRef} height={512} width={512} />
    </div>
  );
}

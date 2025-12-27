"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { angleAudioShader } from "./shader";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    /*web audio api */
    const ctx = new AudioContext();
    const speaker = ctx.destination;

    // const osc = ctx.createOscillator();
    const analyser = ctx.createAnalyser();
    analyser.smoothingTimeConstant = 1.0;

    // osc.connect(analyser);
    analyser.connect(speaker);

    // const timeData = new Float32Array(analyser.fftSize);
    analyser.fftSize = 1024;
    const timeData = new Float32Array(analyser.fftSize);

    const dataTexture = new THREE.DataTexture(
      timeData,
      analyser.fftSize,
      1,
      THREE.RedFormat,
      THREE.FloatType,
    );
    // dataTexture.wrapS = THREE.RepeatWrapping;
    dataTexture.needsUpdate = true;

    const w = 512,
      h = 512;
    canvasRef.current.width = w;
    canvasRef.current.height = h;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    // renderer.setSize(512, 512);

    const option = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      type: THREE.UnsignedByteType,
    };
    let bufferA = new THREE.WebGLRenderTarget(w, h, option);
    let bufferB = new THREE.WebGLRenderTarget(w, h, option);

    const material = new THREE.ShaderMaterial(angleAudioShader);
    const geometry = new THREE.PlaneGeometry(2, 2, 10, 10);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleClick = () => {
      ctx.resume();
      const audio = new Audio("/audio/audio-01.mp3");
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      audio.play();

      const loop = () => {
        analyser.getFloatTimeDomainData(timeData);

        // material.uniforms.uVideo.value = videoTex;
        dataTexture.needsUpdate = true;
        material.uniforms.uAudio.value = dataTexture;

        material.uniforms.uTime.value += 0.0167;
        material.uniforms.uPrevTex.value = bufferA.texture;
        renderer.setRenderTarget(bufferB);
        renderer.render(scene, camera);

        renderer.setRenderTarget(null);
        renderer.render(scene, camera);

        [bufferA, bufferB] = [bufferB, bufferA];
        requestAnimationFrame(loop);
      };
      loop();
    };

    window.addEventListener("click", handleClick, { once: true });
  }, []);

  return <canvas ref={canvasRef} />;
}

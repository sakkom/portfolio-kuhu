"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { overlapShader } from "./shader";
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
} from "three/examples/jsm/Addons.js";
import { glitchShader } from "./glitch";
import { fishShader } from "./fish";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    const material = new THREE.ShaderMaterial(overlapShader);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.connect(ctx.destination);
    const timeBuffer = new Float32Array(analyser.fftSize);

    const timeTexture = new THREE.DataTexture(
      timeBuffer,
      analyser.fftSize,
      1,
      THREE.RedFormat,
      THREE.FloatType,
    );
    timeTexture.needsUpdate = true;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const shader0 = new ShaderPass(glitchShader);
    const shader1 = new ShaderPass(fishShader);
    composer.addPass(shader0);
    composer.addPass(shader1);

    const handleClick = () => {
      ctx.resume();
      const audio = new Audio(
        "/audio/seductive-chill-hip-hop-instrumental-hear-me-134134.mp3",
      );
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      audio.play();

      const loop = () => {
        analyser.getFloatTimeDomainData(timeBuffer);

        material.uniforms.uTimeTex.value = timeTexture;
        timeTexture.needsUpdate = true;
        material.uniforms.uTime.value += 0.0167;

        //
        shader0.uniforms.uTimeTex.value = timeTexture;
        shader1.uniforms.uTimeTex.value = timeTexture;
        shader1.uniforms.uTime.value += 0.0167;

        composer.render();
        // renderer.render(scene, camera);

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

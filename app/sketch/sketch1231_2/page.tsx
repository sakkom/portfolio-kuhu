"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { sketch1230Shader } from "./shader";
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
} from "three/examples/jsm/Addons.js";
import { noiseShader } from "./noiseShader";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    const material = new THREE.ShaderMaterial(sketch1230Shader);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const shader0 = new ShaderPass(noiseShader);
    composer.addPass(shader0);

    const clock = new THREE.Clock();

    const loop = () => {
      material.uniforms.uTime.value += clock.getDelta();
      shader0.uniforms.uTime.value = clock.getElapsedTime();
      // renderer.render(scene, camera);
      composer.render();
      requestAnimationFrame(loop);
    };
    loop();
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
      <canvas ref={canvasRef} width={512} height={512} />
    </div>
  );
}

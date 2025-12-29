"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { sketch1229Shader } from "./shader";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    const material = new THREE.ShaderMaterial(sketch1229Shader);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();
    const loop = () => {
      material.uniforms.uTime.value += clock.getDelta();
      renderer.render(scene, camera);
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
      <canvas
        ref={canvasRef}
        width={512}
        height={512}
        // style={{ border: "1px solid white" }}
      />
    </div>
  );
}

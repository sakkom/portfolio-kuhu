"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { sketch0119 } from "./shader";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });

    const material = new THREE.ShaderMaterial(sketch0119);
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
        width={512 * 1.2}
        height={512 * 1.2}
        // style={{ border: "1px solid white" }}
      />
    </div>
  );
}

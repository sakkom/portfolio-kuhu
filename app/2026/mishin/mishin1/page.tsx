// page.tsx
"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 画像テクスチャ
    const texture = new THREE.TextureLoader().load("/kusa0.jpg", () => {
      renderer.render(scene, camera);
    });
    const aspect = 4 / 3;
    const geo = new THREE.PlaneGeometry(2 / aspect, 2);
    const mat = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    renderer.render(scene, camera);
  }, []);

  const savePNG = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = "output.png";
    a.click();
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      <button
        onClick={savePNG}
        style={{ position: "absolute", bottom: 20, left: 20, zIndex: 2 }}
      >
        Save PNG
      </button>
    </div>
  );
}

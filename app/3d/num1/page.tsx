"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const clock = new THREE.Clock();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1 / 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    camera.position.z = 10;
    const light = new THREE.DirectionalLight(0xffffff, 10);
    light.position.set(0, 0, 0.01);
    scene.add(light);
    const controls = new OrbitControls(camera, canvasRef.current);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(512 * 1.2, 512 * 1.2);

    const meshs: THREE.Mesh[] = [];
    for (let j = 0; j < 10; j++) {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i < 1000; i++) {
        const t = i / 1000.0;
        const theta = t * Math.PI;
        const phi = t * Math.PI * 10;
        const p = new THREE.Vector3(
          Math.sin(theta) * Math.cos(phi) * j,
          Math.cos(theta) * j,
          Math.sin(theta) * Math.sin(phi) * j,
        );
        points.push(p);
      }
      const curve = new THREE.CatmullRomCurve3(points, false);
      const geometry = new THREE.TubeGeometry(curve, 10000, 0.01 * j, 8);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0, 0.0, 1.0 - (j * j) / 10.0),
        // wireframe: true,
        metalness: 0.5,
        roughness: 0.5,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotateZ(j);
      meshs.push(mesh);
    }
    meshs.forEach((m) => scene.add(m));

    let counter = 0;
    const loop = () => {
      // material.uniforms.uTime.value += clock.getDelta();
      meshs.forEach((m, i) => {
        m.rotateY(0.1);
        // m.rotateX(0.01);
        if (counter % 30.0 == 0) {
          const scale = Math.random() * (10.0 - i + 1);
          // m.scale.x = scale;
          // m.scale.y = scale;
          // m.scale.z = scale;
        }
      });
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
      counter++;
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

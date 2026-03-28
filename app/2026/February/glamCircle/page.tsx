"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gLCircle } from "./gC";

function setThree(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  // const aspect = 4 / 3;
  const aspect = WIDTH / HEIGHT;
  const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  scene.background = null;
  return { scene, camera, renderer };
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const { scene, camera, renderer } = setThree(canvasRef.current);
    // renderer.outputColorSpace = THREE.SRGBColorSpace;
    scene.background = new THREE.Color(0x000000);
    camera.position.z = 1;

    const glC = gLCircle(scene);
    glC.init();

    const loop = () => {
      glC.update();
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />
    </div>
  );
}

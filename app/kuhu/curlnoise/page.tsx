"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { curlnoise } from "./shader";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const cam = new THREE.PerspectiveCamera(
      45,
      canvasWidth / canvasHeight,
      0.1,
      100,
    );
    cam.position.set(0, 0, 3.0);

    const controls = new OrbitControls(cam, canvas);
    controls.rotateSpeed = 1.0;

    const geometry = new THREE.PlaneGeometry(2, 2);

    const material = new THREE.ShaderMaterial(curlnoise);
    material.uniforms.uResolution.value.set(
      window.innerWidth,
      window.innerHeight,
    );

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const animate = () => {
      requestAnimationFrame(animate);

      material.uniforms.uTime.value += 0.0167;

      controls.update();
      renderer.render(scene, cam);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
}

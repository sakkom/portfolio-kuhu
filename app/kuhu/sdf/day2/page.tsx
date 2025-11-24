"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { sdfShader } from "./shader";

export default function RandVertex() {
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
    scene.background = new THREE.Color(0xfffff0);
    // const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const cam = new THREE.PerspectiveCamera(
      45,
      canvasWidth / canvasHeight,
      0.1,
      1000,
    );
    cam.position.z = 3.0;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial(sdfShader);
    material.uniforms.uResolution.value.set(canvasWidth, canvasHeight);
    material.uniforms.uCamPos.value = cam.position;
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();
    const animate = () => {
      // cam.position.z += Math.sin(clock.getElapsedTime() + 1.0);
      // cam.position.x = Math.cos(clock.getElapsedTime()) * 1.0;
      // cam.position.y = Math.sin(clock.getElapsedTime()) * 1.0;
      // if (Math.random() > 0.95) {
      //   cam.position.set(Math.random(), Math.random(), 0.01);
      // }
      material.uniforms.uTime.value += 0.0167;
      requestAnimationFrame(animate);
      renderer.render(scene, cam);
    };
    animate();
  }, []);
  return <canvas ref={canvasRef} />;
}

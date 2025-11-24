"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { sdfShader } from "./shader";

export default function Sdf2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    // const canvasWidth = window.innerWidth;
    // const canvasHeight = window.innerHeight;
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfffff0);
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial(sdfShader);
    material.uniforms.uResolution.value.set(canvasWidth, canvasHeight);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      material.uniforms.uTime.value += 0.0167;
      requestAnimationFrame(animate);
      renderer.render(scene, cam);
    };
    animate();
  }, []);
  return <canvas className="article-canvas" ref={canvasRef} />;
}

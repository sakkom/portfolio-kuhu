"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { metaball2D } from "./shader";
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
    cam.position.set(0, 0, 1.0);

    const controls = new OrbitControls(cam, canvas);
    controls.rotateSpeed = 0.2;

    // ベジェ曲線用のジオメトリ（100頂点）
    const geometry = new THREE.PlaneGeometry(2, 2, 1000, 100);

    const material = new THREE.ShaderMaterial({
      uniforms: metaball2D.uniforms,
      vertexShader: metaball2D.vertexShader,
      fragmentShader: metaball2D.fragmentShader,
    });
    material.uniforms.uResolution.value.set(
      window.innerWidth,
      window.innerHeight,
    );

    const points = new THREE.Mesh(geometry, material);
    scene.add(points);

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

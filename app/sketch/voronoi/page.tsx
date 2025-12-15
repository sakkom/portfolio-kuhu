"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { week2Shader } from "./shader";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xfffff0);
    scene.background = new THREE.Color(0x000000);
    const cam = new THREE.PerspectiveCamera(
      45,
      canvas.width / canvas.height,
      0.1,
      100,
    );
    cam.position.set(0, 0, 3.0);
    const controls = new OrbitControls(cam, canvas);
    controls.rotateSpeed = 0.2;

    const video = document.createElement("video");
    video.src = "/videos/cat2.mp4";
    video.loop = true;
    video.muted = true;
    video.play();

    const videoTex = new THREE.VideoTexture(video);

    const aspectRatio = window.innerWidth / window.innerHeight;
    const geometry = new THREE.SphereGeometry(1);
    const material = new THREE.ShaderMaterial(week2Shader);
    material.side = THREE.DoubleSide;
    material.uniforms.uResolution.value.set(
      window.innerWidth,
      window.innerHeight,
    );
    material.uniforms.uTexture0.value = videoTex;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

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

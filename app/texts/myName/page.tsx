"use client";
import { create } from "node:domain";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { myNameShader } from "./shader";

export function createMyname() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // const w = window.innerWidth;
  // const h = window.innerHeight;
  const w = 1024;
  const h = 1024;
  const dpr = window.devicePixelRatio;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  // canvas.width = w;
  // canvas.height = h;

  if (!ctx) return;
  ctx.scale(dpr, dpr);

  ctx.strokeStyle = "black";
  ctx.lineWidth = 10;
  ctx.strokeRect(0, 0, w, h);

  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  // ctx.strokeRect(0, 0, 500, 500);
  ctx.fillStyle = "white";
  const lines = ["HELLO", "MY NAME IS", "SAKAMAHARUKI"];
  const boxSize = 1000;
  const fontSize = boxSize / 3;
  const fonts = ["Georgia", "Impact", "Helvetica"];
  ctx.font = `normal ${fontSize}px 'Georgia'`;

  lines.forEach((line, i) => {
    const lineWidth = ctx.measureText(line).width;
    const charWidth = lineWidth / line.length;
    const scaleX = boxSize / lineWidth;
    ctx.save();
    // ctx.translate(w / 2, h / 3.5);
    ctx.scale(scaleX, 1 * 1.2);
    ctx.fillText(line, 0, i * fontSize * 0.85);
    ctx.restore();
  });

  return canvas;
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x000000);

    const cam = new THREE.PerspectiveCamera(
      45,
      canvasWidth / canvasHeight,
      0.1,
      100,
    );
    cam.position.set(0, 0, 3.0);

    // const controls = new OrbitControls(cam, canvas);
    // controls.rotateSpeed = 1.0;

    const img = new THREE.CanvasTexture(createMyname());
    const aspect = window.innerWidth / window.innerHeight;
    const geometry = new THREE.PlaneGeometry(2, 2, 100);
    // const geometry = new THREE.SphereGeometry(2, 50, 50);

    const material = new THREE.ShaderMaterial(myNameShader);

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    // s.rotateY(-0.5);

    const clock = new THREE.Clock();
    const animate = () => {
      material.uniforms.uTexture.value = img;
      material.uniforms.uTime.value += 0.33;

      renderer.render(scene, cam);
      requestAnimationFrame(animate);
      // s.rotateY(-0.01);
      // controls.update();
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
}

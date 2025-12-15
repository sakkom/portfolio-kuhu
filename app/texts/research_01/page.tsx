"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { textMetaball } from "./shader";

function createTexture() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const scale = window.devicePixelRatio;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  ctx.scale(scale, scale);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const baseSize = Math.min(width, height);
  const titleSize = baseSize * 0.05;
  const contentSize = baseSize * 0.02;
  const lh = 30;
  //title
  ctx.font = `${titleSize}px Helvetica`;
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.fillText("Contacts", width / 2, height / 2 - lh);

  const contacts = ["https://github.com/sakkom", "sacamaro.crypto@gmail.com"];
  ctx.font = `${contentSize}px Helvetica`;
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  contacts.forEach((text, i) => {
    ctx.fillText(text, width / 2, height / 2 + i * lh);
  });
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
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

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial(textMetaball);
    material.uniforms.uResolution.value.set(
      window.innerWidth,
      window.innerHeight,
    );
    const textTexture = createTexture();
    material.uniforms.uTextTexture.value = textTexture;

    const points = new THREE.Mesh(geometry, material);
    scene.add(points);

    const animate = () => {
      requestAnimationFrame(animate);

      material.uniforms.uTime.value += 0.0167;

      renderer.render(scene, cam);
    };

    animate();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "transparent",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
      />
      <h1 style={{ fontFamily: "helvetica", color: "black" }}>Contact</h1>
    </div>
  );
}

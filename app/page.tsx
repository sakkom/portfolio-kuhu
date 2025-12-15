"use client";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { textMetaball } from "./texts/research_01/shader";
import Image from "next/image";
import Link from "next/link";
import "@/app/styles/main.css";
import { articles, ArticleData } from "./data/articles";

export default function Home() {
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
    <div>
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
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            margin: "2vmin 0",
            backgroundColor: "#111111",
            color: "#dddddd",
            padding: "0vmin 2vmin",
          }}
        >
          <h3>2025November</h3>
        </div>
        <div id="main-container">
          {[...articles].reverse().map((a: ArticleData) => (
            <div key={a.id} style={{ padding: "2vmin 10vmin" }}>
              <Link href={`${process.env.NEXT_PUBLIC_LOCAL}/${a.path}`}>
                <div style={{ backgroundColor: "#111111", padding: "0 2vmin" }}>
                  <h1>{a.title}</h1>
                </div>

                <Image
                  src={a.gif}
                  alt={a.title}
                  width={700}
                  height={500}
                  style={{ width: "100%", height: "auto" }}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

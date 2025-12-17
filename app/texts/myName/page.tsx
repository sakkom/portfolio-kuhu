"use client";
import { create } from "node:domain";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

function createImg() {
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
  // ctx.strokeRect(0, 0, w, h);

  // ctx.fillStyle = "black";
  // ctx.font = "bold 150px 'Georgia'";
  // ctx.textAlign = "left";
  // ctx.textBaseline = "middle";

  // const lineHeight = 75;
  // const lineWidth = 200;
  // ctx.textAlign = "center";
  // ctx.fillText("Hello ", w / 2, h / 2 - lineHeight * 3);
  // ctx.textAlign = "center";
  // ctx.fillText("MY NAME IS ", w / 2, h / 2 - lineHeight);
  // ctx.textAlign = "center";
  // ctx.fillText("sakama haruki", w / 2, h / 2 + lineHeight * 1.3);

  // const lineHeight = 55;
  // ctx.font = "bold 120px 'Georgia'";
  // ctx.textBaseline = "middle";
  // const text = "hello my name is sakama haruki ";
  // for (let i = 0; i < 1; i++) {
  // const widthPosition = Math.random() * -w;
  // text.split("").map((char, i) => {
  //   const waveY = (Math.sin(i * 0.6) * h) / 4;
  //   ctx.fillText(char, i * 68, h / 2 + waveY);
  // });
  // if (i % 2 == 0) {
  //   // ctx.filter = `blur(${(i / 9) * 50}px)`;
  //   ctx.fillText(text, 0, h / 2 + i * lineHeight);
  //   ctx.filter = "none";
  // } else {
  //   // ctx.filter = `blur(${((i + 1) / 9) * 50}px)`;
  //   // ctx.fillText(text, widthPosition, h / 2 - (i + 1) * lineHeight);
  //   ctx.filter = "none";
  // }
  // }

  // console.log(lines);
  //
  // const lineHeight = 300;
  // ctx.font = "bold 150px 'Georgia'";
  // for (let y = 0; y < lines.length; y++) {
  //   const char = lines[y].split("");
  //   for (let x = 0; x < char.length; x++) {
  //     ctx.fillText(char[x], x * 150, (y + 1) * lineHeight);
  //   }
  // }

  // ctx.fillStyle = "red";
  // ctx.fillRect(0, 0, w, 450);

  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  // ctx.strokeRect(0, 0, 500, 500);
  ctx.fillStyle = "black";
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
    ctx.scale(scaleX, 1 * 1.2);
    ctx.fillText(line, 0, i * fontSize * 0.75);
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
    cam.position.set(0, 0, 10.0);

    const controls = new OrbitControls(cam, canvas);
    controls.rotateSpeed = 1.0;

    const img = new THREE.CanvasTexture(createImg());
    const aspect = window.innerWidth / window.innerHeight;
    const geometry = new THREE.PlaneGeometry(2, 2, 100);
    // const geometry = new THREE.SphereGeometry(2, 50, 50);

    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      // color: 0xffffff,
      // wireframe: true,
      map: img,
      side: THREE.DoubleSide,
    });

    const s = new THREE.Mesh(geometry, material);
    scene.add(s);
    // s.rotateY(-0.5);

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      // s.rotateY(-0.01);
      controls.update();
      renderer.render(scene, cam);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
}

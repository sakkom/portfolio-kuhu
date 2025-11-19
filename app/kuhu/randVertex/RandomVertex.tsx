"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { randVertexShader } from "./shader";

export default function RandVertex() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = canvasRef.current.clientWidth;
    canvas.height = canvasRef.current.clientWidth;
    /*initThreeBasic */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(
      canvasRef.current.clientWidth,
      canvasRef.current.clientHeight,
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfffff0);
    const cam = new THREE.PerspectiveCamera(
      45,
      canvas.width / canvas.height,
      0.1,
      1000,
    );
    cam.position.set(0, 0, 100);
    const light = new THREE.DirectionalLight(0xffffff);
    light.intensity = 5;
    light.position.set(0, 0, 1);
    scene.add(light);

    const positions = [];
    const colors = [];
    const sizes = [];

    const space = canvasRef.current.clientWidth / 10;
    for (let i = 0; i <= canvasRef.current.clientWidth; i += space) {
      for (let j = 0; j <= canvasRef.current.clientHeight; j += space) {
        const w = canvasRef.current?.clientWidth;
        const h = canvasRef.current?.clientHeight;
        const x = i / w;
        const y = j / h;
        const signedX = x * 2.0 - 1.0;
        const signedY = y * 2.0 - 1.0;

        positions.push(signedX, signedY, 0);
        colors.push(x, y, 0.5, 1.0);
        /*開発環境820pxから比例*/
        /*float scale = pow(1.0 - normalizeDist, 3.0);により指定可能*/
        sizes.push((w / 820) * 180.0);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 4));
    geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

    randVertexShader.uniforms.uResolution.value.set(
      canvasRef.current?.clientWidth,
      canvasRef.current?.clientHeight,
    );
    const material = new THREE.ShaderMaterial(randVertexShader);
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    window.addEventListener("pointermove", (e) => {
      if (!canvasRef.current) return;
      const w = canvasRef.current?.clientWidth;
      const h = canvasRef.current?.clientHeight;
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = (e.pageX - rect.left) / w;
      const y = (e.pageY - rect.top) / h;
      const signedX = x * 2.0 - 1.0;
      const signedY = y * 2.0 - 1.0;
      randVertexShader.uniforms.uMouse.value.set(signedX, -signedY);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, cam);
    };
    animate();
  }, []);
  return <canvas className="article-canvas" ref={canvasRef} />;
}
